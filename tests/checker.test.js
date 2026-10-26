"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const checker = require("../docs/checker.js");

const EM = String.fromCharCode(8212);
const EN = String.fromCharCode(8211);
const CURLY = String.fromCharCode(8217);
const POUND = String.fromCharCode(163);

function rules(result) {
  return result.issues.map(function (i) { return i.rule; });
}
function flagged(result, text) {
  return result.issues.some(function (i) { return i.text.toLowerCase() === text.toLowerCase(); });
}
function words(n) {
  return new Array(n).fill("word").join(" ");
}

test("clean plain text raises nothing", () => {
  const r = checker.analyse("I sent the proposal on Monday. Can you confirm the date by Friday?", { useCase: "email" });
  assert.deepStrictEqual(r.issues, []);
  assert.deepStrictEqual(r.notes, []);
});

test("stock phrases are flagged", () => {
  const r = checker.analyse("Hope you are well. I wanted to reach out to touch base, in order to move forward.");
  ["Hope you are well", "reach out", "touch base", "in order to"].forEach((t) =>
    assert.ok(r.issues.some((i) => i.text.toLowerCase().includes(t.toLowerCase())), t));
});

test("thanking in advance is flagged", () => {
  assert.ok(flagged(checker.analyse("Please send it. Thanks in advance!", { useCase: "email" }), "Thanks in advance"));
});

test("a long first line in a post gets one flag, not two", () => {
  const r = checker.analyse("I'm writing " + words(25) + ". Short one.", { useCase: "post" });
  assert.strictEqual(r.issues.filter((i) => i.rule === "opening" || i.rule === "long").length, 1);
  assert.strictEqual(r.issues.find((i) => i.rule === "opening" || i.rule === "long").rule, "opening");
});

test("a hedge is flagged, with a message that allows real uncertainty", () => {
  const r = checker.analyse("I think the launch will slip.");
  const hit = r.issues.find((i) => i.text === "I think");
  assert.ok(hit);
  assert.match(hit.message, /real uncertainty/);
});

test("overlapping flags are not stacked: 'just checking in' is one stock phrase", () => {
  const r = checker.analyse("Just checking in on the order.");
  assert.strictEqual(r.wordIssues.length, 1);
  assert.strictEqual(r.wordIssues[0].rule, "stock");
});

test("word flags never overlap and are in order", () => {
  const r = checker.analyse("I just wanted to reach out, and it is really a robust, seamless leverage of in order to " + EM + " things.");
  for (let i = 1; i < r.wordIssues.length; i++) {
    assert.ok(r.wordIssues[i].start >= r.wordIssues[i - 1].end);
  }
});

test("em dashes and spaced en dashes are flagged, hyphens and ranges are not", () => {
  assert.ok(rules(checker.analyse("A " + EM + " B")).includes("dash"));
  assert.ok(rules(checker.analyse("A " + EN + " B")).includes("dash"));
  assert.ok(!rules(checker.analyse("The 2020" + EN + "2022 plan is well-known.")).includes("dash"));
  assert.ok(!rules(checker.analyse("A well-known plan.")).includes("dash"));
});

test("sentences over 25 words are flagged, 25 are not, over 40 are 'very long'", () => {
  assert.ok(!rules(checker.analyse(words(25) + ".")).includes("long"));
  const r26 = checker.analyse(words(26) + ".");
  assert.strictEqual(r26.issues.find((i) => i.rule === "long").label, "Long sentence");
  assert.strictEqual(checker.analyse(words(41) + ".").issues.find((i) => i.rule === "long").label, "Very long sentence");
});

test("possible passives are flagged, adjectives that look like passives are not", () => {
  assert.ok(flagged(checker.analyse("The proposal was sent last week."), "was sent"));
  assert.ok(!rules(checker.analyse("I am excited and interested.")).includes("passive"));
  assert.ok(!rules(checker.analyse("The office is located in Leeds.")).includes("passive"));
});

test("three sentences with the same opening are flagged on the third; two are not", () => {
  const three = checker.analyse("We sent it. We checked it. We fixed it.");
  assert.strictEqual(three.issues.filter((i) => i.rule === "repeat").length, 1);
  assert.strictEqual(checker.analyse("We sent it. We checked it. Then it shipped.").issues.filter((i) => i.rule === "repeat").length, 0);
  assert.strictEqual(checker.analyse("- We sent it\n- We checked it\n- We fixed it").issues.filter((i) => i.rule === "repeat").length, 0);
});

test("email: a second question is flagged, one question is not", () => {
  assert.ok(rules(checker.analyse("Can you confirm? Can you also call?", { useCase: "email" })).includes("ask"));
  assert.ok(!rules(checker.analyse("Can you confirm the date?", { useCase: "email" })).includes("ask"));
  assert.ok(!rules(checker.analyse("Can you confirm? Can you also call?", { useCase: "report" })).includes("ask"));
});

test("email: over 150 words is noted, 150 is not", () => {
  assert.strictEqual(checker.analyse(words(151) + ".", { useCase: "email" }).notes.filter((n) => n.rule === "length").length, 1);
  assert.strictEqual(checker.analyse(words(150) + ".", { useCase: "email" }).notes.filter((n) => n.rule === "length").length, 0);
});

test("notes: impressions and agreement are flagged", () => {
  const r = checker.analyse("Ines reckons feedback is positive so far. We agreed the plan.", { useCase: "notes" });
  assert.ok(flagged(r, "reckons"));
  assert.ok(flagged(r, "positive so far"));
  assert.ok(flagged(r, "agreed") || flagged(r, "we agreed"));
});

test("notes: a bare number is flagged, a sourced number or a year is not", () => {
  assert.ok(rules(checker.analyse("Spend is 70,000 now.", { useCase: "notes" })).includes("source"));
  assert.ok(!rules(checker.analyse("61,000 spent as at the 5 September finance report.", { useCase: "notes" })).includes("source"));
  assert.ok(!rules(checker.analyse("We started in 2026.", { useCase: "notes" })).includes("source"));
  assert.ok(!rules(checker.analyse("Spend is 70,000 now.", { useCase: "any" })).includes("source"));
});

test("report: a missing finding in the opening is noted, a recommendation is not", () => {
  const flat = checker.analyse("This report covers the background to the project and its history. " + words(100) + ".", { useCase: "report" });
  assert.strictEqual(flat.notes.filter((n) => n.rule === "opening").length, 1);
  const led = checker.analyse("We recommend moving to the new supplier. The background follows.", { useCase: "report" });
  assert.strictEqual(led.notes.filter((n) => n.rule === "opening").length, 0);
});

test("report: calling it twice gives the same answer (no leftover regex state)", () => {
  const withFinding = "We recommend moving to the new supplier. The background follows.";
  const without = "This report covers the background only. " + words(100) + ".";
  [withFinding, without].forEach((text) => {
    const first = checker.analyse(text, { useCase: "report" });
    const second = checker.analyse(text, { useCase: "report" });
    const third = checker.analyse(text, { useCase: "report" });
    assert.deepStrictEqual(first.notes, second.notes);
    assert.deepStrictEqual(second.notes, third.notes);
    assert.deepStrictEqual(first.issues, third.issues);
  });
  assert.strictEqual(checker.analyse(withFinding, { useCase: "report" }).notes.length, 0);
});

test("report: a closing summary phrase is flagged", () => {
  assert.ok(flagged(checker.analyse("We found it. In conclusion, we found it.", { useCase: "report" }), "In conclusion"));
});

test("post: a long first line, a hype opener and engagement bait are flagged", () => {
  const r = checker.analyse("I'm thrilled to share " + words(22) + ".\n\nWe sold forty units. Thoughts?", { useCase: "post" });
  assert.ok(rules(r).includes("opening"));
  assert.ok(rules(r).includes("hype"));
  assert.ok(rules(r).includes("bait"));
});

test("post: a short plain first line and an ordinary ending are not flagged", () => {
  const r = checker.analyse("We sold 40 units in March. Two came back.", { useCase: "post" });
  assert.deepStrictEqual(rules(r).filter((x) => x === "opening" || x === "bait" || x === "hype"), []);
});

test("post: many hashtags and emojis are noted", () => {
  const r = checker.analyse("Short. #a #b #c #d \u{1F600}\u{1F600}\u{1F600}", { useCase: "post" });
  assert.deepStrictEqual(r.notes.map((n) => n.rule).sort(), ["emoji", "hashtags"]);
});

test("house formatting is off by default", () => {
  const text = "On 21 May we paid " + POUND + "18k, " + CURLY + "ninety-five per cent" + CURLY + ", 3 people.";
  assert.deepStrictEqual(rules(checker.analyse(text)).filter((x) => x === "format"), []);
});

test("house formatting flags dates, numbers, currency, percentages and curly quotes", () => {
  const on = { houseFormatting: true };
  assert.ok(flagged(checker.analyse("On 21 May we met.", on), "21 May"));
  assert.ok(flagged(checker.analyse("On May 21st we met.", on), "May 21st"));
  assert.ok(!rules(checker.analyse("On 21st May we met.", on)).includes("format"));
  assert.ok(flagged(checker.analyse("We hired 3 people.", on), "3"));
  assert.ok(!rules(checker.analyse("We hired three people and 12 more.", on)).includes("format"));
  assert.ok(flagged(checker.analyse("We hired twelve people.", on), "twelve"));
  assert.ok(flagged(checker.analyse("It cost " + POUND + "18k.", on), POUND + "18k"));
  assert.ok(flagged(checker.analyse("It rose ninety-five per cent.", on), "per cent"));
  assert.ok(flagged(checker.analyse("It" + CURLY + "s here.", on), CURLY));
  assert.ok(!rules(checker.analyse("Spend " + POUND + "18,000 or 95% at 3 pm.", on)).includes("format"));
});

test("an unknown use case is treated as 'any'", () => {
  assert.strictEqual(checker.analyse("Hello.", { useCase: "banana" }).useCase, "any");
});

test("empty and whitespace-only text do not throw", () => {
  [undefined, null, "", "   \n  "].forEach((t) => {
    const r = checker.analyse(t, { useCase: "post" });
    assert.deepStrictEqual(r.issues, []);
    assert.strictEqual(r.stats.words, 0);
    assert.strictEqual(r.stats.readingEase, null);
  });
});

test("syllable counts are sensible", () => {
  assert.strictEqual(checker.syllables("cat"), 1);
  assert.strictEqual(checker.syllables("water"), 2);
  assert.strictEqual(checker.syllables("beautiful"), 3);
  assert.strictEqual(checker.syllables("the"), 1);
});

test("reading ease is higher for short plain text than for dense text", () => {
  const plain = checker.analyse("I sent it. You read it. We agreed on it.").stats.readingEase;
  const dense = checker.analyse("The implementation of organisational transformation necessitates comprehensive stakeholder consultation throughout the programme.").stats.readingEase;
  assert.ok(plain > 70);
  assert.ok(dense < 30);
});

test("sentence splitting handles abbreviations, decimals, questions and new lines", () => {
  assert.strictEqual(checker.splitSentences("Use a tool, e.g. a hammer. Then stop.").length, 2);
  assert.strictEqual(checker.splitSentences("It cost 3.5 million. Fine.").length, 2);
  assert.strictEqual(checker.splitSentences("Why? Because. Done!").length, 3);
  assert.strictEqual(checker.splitSentences("One line\nTwo line").length, 2);
  assert.strictEqual(checker.splitSentences('He said "stop." Then left.').length, 2);
});

test("a clear text is not told it is wrong: no flag claims a fact is false", () => {
  const r = checker.analyse("Sales rose 12% in March because we added two reps.", { useCase: "report" });
  r.issues.concat(r.notes).forEach((i) => assert.doesNotMatch(i.message, /\b(false|wrong|incorrect|untrue)\b/i));
});

test("the checker and the page make no network calls", () => {
  const sources = [fs.readFileSync(path.join(__dirname, "../docs/checker.js"), "utf8"),
                   fs.readFileSync(path.join(__dirname, "../docs/index.html"), "utf8")];
  sources.forEach((src) => {
    assert.doesNotMatch(src, /\bfetch\s*\(/);
    assert.doesNotMatch(src, /XMLHttpRequest|WebSocket|sendBeacon|navigator\.clipboard\.read/);
    assert.doesNotMatch(src, /<script[^>]+src="https?:/);
    assert.doesNotMatch(src, /<link[^>]+href="https?:/);
  });
});

test("the checker source holds no literal dash or curly quote", () => {
  const src = fs.readFileSync(path.join(__dirname, "../docs/checker.js"), "utf8");
  [8211, 8212, 8216, 8217, 8220, 8221].forEach((code) => assert.ok(!src.includes(String.fromCharCode(code)), String(code)));
});
