/*
 * Say It Plainly: the private checker.
 *
 * Plain JavaScript, no dependencies, no network. It takes text and returns
 * prompts to look again. It does not judge the writing, and it cannot tell
 * whether a sentence is true. Each flag is a question for the writer.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.SayItPlainly = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var USE_CASES = ["any", "email", "notes", "report", "post"];
  var MONTHS = "January|February|March|April|May|June|July|August|September|October|November|December";
  var ABBREVIATIONS = ["e.g", "i.e", "etc", "mr", "mrs", "ms", "dr", "vs", "no", "st", "approx", "inc", "ltd", "cf"];

  var FILLER = "Filler. Does it say anything? If not, cut it.";
  var BUZZ = "A stock word. Use the plain one, or say what you mean.";
  var MACHINE = "Often seen in machine-written text. Keep it only if it says something.";
  var HEDGE = "Keep it if it marks real uncertainty. Cut it if it hides a claim.";

  function rx(source, flags) {
    return new RegExp(source, flags || "gi");
  }

  // [regex, rule, label, message]
  var WORD_RULES = [
    [rx("\\bjust (?:checking in|circling back|following up|touching base)\\b"), "stock", "Stock phrase", FILLER],
    [rx("\\bcircling back\\b"), "stock", "Stock phrase", FILLER],
    [rx("\\btouch(?:ing)? base\\b"), "stock", "Stock phrase", FILLER],
    [rx("\\bhope (?:you(?:'re| are) (?:well|doing well)|this (?:email |message )?finds you well)\\b"), "stock", "Stock phrase", FILLER],
    [rx("\\bI(?:'d| would) love to\\b"), "stock", "Stock phrase", FILLER],
    [rx("\\bI(?:'m| am) (?:so |really |very )?excited to\\b"), "stock", "Stock phrase", FILLER],
    [rx("\\bI wanted to (?:reach out|touch base|follow up|check in)\\b"), "stock", "Stock phrase", FILLER],
    [rx("\\breach(?:ing)? out\\b"), "stock", "Stock phrase", FILLER],
    [rx("\\b(?:please )?(?:do not|don't) hesitate to\\b"), "stock", "Stock phrase", FILLER],
    [rx("\\bat your earliest convenience\\b"), "stock", "Stock phrase", FILLER],
    [rx("\\bthanks in advance\\b|\\bthank you in advance\\b"), "stock", "Stock phrase", "Don't thank someone for something they have not done yet."],
    [rx("\\b(?:going|moving) forward\\b"), "stock", "Stock phrase", FILLER],
    [rx("\\bat the end of the day\\b"), "stock", "Stock phrase", FILLER],
    [rx("\\bin order to\\b"), "stock", "Stock phrase", "Two words do this job: \"to\"."],
    [rx("\\bdue to the fact that\\b"), "stock", "Stock phrase", "Use \"because\"."],
    [rx("\\bwith regards? to\\b"), "stock", "Stock phrase", "Use \"about\"."],
    [rx("\\bneedless to say\\b|\\bit goes without saying\\b"), "stock", "Stock phrase", "If it goes without saying, don't say it."],
    [rx("\\bas per\\b"), "stock", "Stock phrase", "Use \"as in\" or \"following\", or cut it."],
    [rx("\\bmove the needle\\b|\\blow-hanging fruit\\b"), "stock", "Stock phrase", "A metaphor you have read so often you no longer see it. Say what you mean."],
    [rx("\\b(?:leverag(?:e|es|ed|ing)|unlock(?:s|ed|ing)?|seamless(?:ly)?|eye-opening|synerg(?:y|ies)|game[- ]chang(?:er|ing)|best-in-class|cutting-edge|deep dive|div(?:e|ing) deeper|aligned on|utili[sz](?:e|es|ed|ing|ation)|facilitat(?:e|es|ed|ing)|robust|holistic|paradigm)\\b"), "stock", "Stock word", BUZZ],
    [rx("\\b(?:delv(?:e|es|ed|ing)|tapestry|testament to|ever-evolving|fast-paced world|navigat(?:e|ing) the complexities|it(?:'s| is) (?:important|worth) (?:to )?not(?:e|ing)|in the realm of|pivotal|underscor(?:e|es|ed|ing)|showcas(?:e|es|ed|ing)|vibrant|unleash(?:es|ed|ing)?|harness(?:es|ed|ing)? the power|embark(?:s|ed|ing)? on a journey)\\b"), "machine", "Common in machine-written text", MACHINE],
    [rx("\\b(?:I think|I feel|I believe|perhaps|maybe|sort of|kind of|somewhat|basically|just|really|very|quite|a bit|a little)\\b"), "hedge", "Hedge", HEDGE],
    [rx("\\u2014"), "dash", "Em dash", "Use a comma, a colon or a full stop."],
    [rx("\\s\\u2013\\s"), "dash", "Spaced en dash", "Use a comma, a colon or a full stop."]
  ];

  var PASSIVE = rx("\\b(?:am|is|are|was|were|be|been|being)\\s+(?:\\w+ly\\s+)?(\\w+(?:ed|en)|made|done|sent|given|seen|known|taken|found|held|kept|shown|written|built|run|set|put|got|told|paid|left|lost|chosen)\\b");
  var NOT_PASSIVE = ["excited", "interested", "pleased", "concerned", "worried", "tired", "supposed", "used", "based", "related", "located", "married", "scared", "surprised", "delighted", "involved", "open", "broken", "ready", "afraid", "bored", "confused", "pleased", "satisfied", "disappointed", "determined", "gotten"];

  var NOTES_IMPRESSION = rx("\\b(?:seems?|seemed|apparently|reckons?|looks? like|probably|supposedly|allegedly|going well|positive so far|good progress|on track|much better|in good shape|happy with)\\b");
  var NOTES_AGREED = rx("\\b(?:it was |we |everyone |all )?agreed\\b");
  var REPORT_FINDING = rx("\\b(?:recommend|should|found|show(?:s|ed)?|result|conclude|decid|propose|need to|must)\\w*", "i");
  var REPORT_CLOSE = rx("\\b(?:in conclusion|to summari[sz]e|in summary|key takeaways?|as previously mentioned)\\b");
  var POST_OPENER = rx("\\b(?:I(?:'m| am) (?:so |really |very )?(?:thrilled|excited|humbled|delighted|proud)|excited to (?:announce|share)|humbled|in today(?:'s)? |let(?:'s| us) dive)\\b");
  var POST_BAIT = rx("(?:thoughts\\?|agree\\?|what do you think\\?|drop a comment|comment below|like and share|tag someone|follow for more)[\\s\\S]{0,3}$", "i");

  var EMOJI = new RegExp("[\\u{1F300}-\\u{1FAFF}\\u{2600}-\\u{27BF}]", "gu");

  function collect(text, regex, rule, label, message, level) {
    var out = [];
    var re = new RegExp(regex.source, regex.flags.indexOf("g") === -1 ? regex.flags + "g" : regex.flags);
    var m;
    while ((m = re.exec(text)) !== null) {
      if (m[0].length === 0) { re.lastIndex++; continue; }
      out.push({ start: m.index, end: m.index + m[0].length, text: m[0], rule: rule, label: label, message: message, level: level || "word" });
    }
    return out;
  }

  function splitSentences(text) {
    var out = [];
    var n = text.length;
    var start = 0;
    var i = 0;
    function push(a, b) {
      while (a < b && /\s/.test(text.charAt(a))) a++;
      while (b > a && /\s/.test(text.charAt(b - 1))) b--;
      if (b > a) out.push({ start: a, end: b, text: text.slice(a, b) });
    }
    function isAbbreviation(pos) {
      var j = pos;
      while (j > 0 && /[A-Za-z.]/.test(text.charAt(j - 1))) j--;
      var word = text.slice(j, pos).toLowerCase();
      return ABBREVIATIONS.indexOf(word) !== -1;
    }
    while (i < n) {
      var c = text.charAt(i);
      if (c === "\n") {
        push(start, i);
        start = i + 1;
      } else if (c === "." || c === "!" || c === "?") {
        var j = i;
        while (j + 1 < n && /[.!?]/.test(text.charAt(j + 1))) j++;
        var next = text.charAt(j + 1);
        var atEnd = j + 1 >= n;
        if (!atEnd && /["')\]]/.test(next) && (j + 2 >= n || /\s/.test(text.charAt(j + 2)))) { j++; next = text.charAt(j + 1); atEnd = j + 1 >= n; }
        if (atEnd || /\s/.test(next)) {
          if (c === "." && j === i && isAbbreviation(i)) { i = j + 1; continue; }
          push(start, j + 1);
          start = j + 1;
        }
        i = j;
      }
      i++;
    }
    push(start, n);
    return out;
  }

  function wordsIn(text) {
    return text.match(/[A-Za-z0-9\u00A3$%]+(?:['\u2019-][A-Za-z0-9]+)*/g) || [];
  }

  function syllables(word) {
    var w = word.toLowerCase().replace(/[^a-z]/g, "");
    if (!w) return 0;
    if (w.length <= 3) return 1;
    w = w.replace(/eau/g, "a").replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
    var groups = w.match(/[aeiouy]{1,2}/g);
    return groups ? groups.length : 1;
  }

  function statsFor(text, sentences) {
    var words = wordsIn(text);
    var syl = 0;
    for (var i = 0; i < words.length; i++) syl += syllables(words[i]);
    var w = words.length;
    var s = sentences.length;
    if (!w || !s) return { words: w, sentences: s, averageSentence: 0, readingEase: null, grade: null, band: "" };
    var ease = 206.835 - 1.015 * (w / s) - 84.6 * (syl / w);
    var grade = 0.39 * (w / s) + 11.8 * (syl / w) - 15.59;
    var band = ease >= 70 ? "easy to read" : ease >= 60 ? "plain" : ease >= 50 ? "fairly hard" : "hard";
    return { words: w, sentences: s, averageSentence: Math.round((w / s) * 10) / 10,
             readingEase: Math.round(ease * 10) / 10, grade: Math.round(grade * 10) / 10, band: band };
  }

  function dropOverlaps(issues) {
    issues.sort(function (a, b) { return a.start - b.start || (b.end - b.start) - (a.end - a.start); });
    var kept = [];
    var lastEnd = -1;
    for (var i = 0; i < issues.length; i++) {
      if (issues[i].start >= lastEnd) { kept.push(issues[i]); lastEnd = issues[i].end; }
    }
    return kept;
  }

  function formattingIssues(text, useCase) {
    var out = [];
    out = out.concat(collect(text, rx("[\\u2018\\u2019\\u201C\\u201D]", "g"), "format", "Curly quote", "Use a straight quote or apostrophe."));
    out = out.concat(collect(text, new RegExp("\\b\\d{1,2}(?!\\d|st\\b|nd\\b|rd\\b|th\\b)\\s+(?:" + MONTHS + ")\\b", "g"), "format", "Date", "Write dates like 21st May."));
    out = out.concat(collect(text, new RegExp("\\b(?:" + MONTHS + ")\\s+\\d{1,2}(?:st|nd|rd|th)?\\b", "g"), "format", "Date", "Write dates like 21st May."));
    var digit = /(^|[\s(])([1-9])(?=\s+[a-z])(?!\s+(?:am|pm|per|x)\b)/gm;
    var m;
    while ((m = digit.exec(text)) !== null) {
      var at = m.index + m[1].length;
      out.push({ start: at, end: at + 1, text: m[2], rule: "format", label: "Number", message: "Spell out one to nine in prose.", level: "word" });
    }
    out = out.concat(collect(text, rx("\\b(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand)\\b(?=\\s+[a-z])"), "format", "Number", "Use numerals for 10 and above."));
    out = out.concat(collect(text, rx("\\u00A3\\s?\\d[\\d,.]*k\\b"), "format", "Currency", "Write the full figure, like \u00A318,000."));
    out = out.concat(collect(text, rx("\\b(?:[a-z]+(?:-[a-z]+)?\\s+)?(?:thousand|million)\\s+pounds\\b"), "format", "Currency", "Write the full figure, like \u00A318,000."));
    out = out.concat(collect(text, rx("\\b\\d[\\d,]*\\s?(?:pounds|GBP|quid)\\b"), "format", "Currency", "Write the full figure, like \u00A318,000."));
    out = out.concat(collect(text, rx("\\b(?:per ?cent|percent)\\b"), "format", "Percentage", "Write 95%, not per cent."));
    if (useCase === "email" || useCase === "report" || useCase === "any") {
      out = out.concat(collect(text, EMOJI, "format", "Emoji", "No emojis in writing for customers.", "word"));
    }
    return out;
  }

  function analyse(text, options) {
    options = options || {};
    var useCase = USE_CASES.indexOf(options.useCase) === -1 ? "any" : options.useCase;
    text = String(text || "");
    var sentences = splitSentences(text);
    var words = [];
    var sentenceLevel = [];
    var notes = [];

    for (var r = 0; r < WORD_RULES.length; r++) {
      words = words.concat(collect(text, WORD_RULES[r][0], WORD_RULES[r][1], WORD_RULES[r][2], WORD_RULES[r][3]));
    }

    var passives = collect(text, PASSIVE, "passive", "Possible passive", "Who did it? Name them. Ignore this if the doer does not matter.");
    words = words.concat(passives.filter(function (p) {
      var participle = p.text.split(/\s+/).pop().toLowerCase();
      return NOT_PASSIVE.indexOf(participle) === -1;
    }));

    if (options.houseFormatting) {
      words = words.concat(formattingIssues(text, useCase));
      if (useCase === "email") {
        var heading = /^#{1,6}\s.*$/gm, h;
        while ((h = heading.exec(text)) !== null) {
          sentenceLevel.push({ start: h.index, end: h.index + h[0].length, text: h[0], rule: "format", label: "Heading in an email", message: "Headings are for documents, not messages.", level: "sentence" });
        }
      }
    }

    // sentence-level checks
    var previousOpenings = [];
    var questionCount = 0;
    var longLimit = 25;
    for (var s = 0; s < sentences.length; s++) {
      var sen = sentences[s];
      var count = wordsIn(sen.text).length;
      if (count > longLimit && !(useCase === "post" && s === 0 && count > 20)) {
        sentenceLevel.push({ start: sen.start, end: sen.end, text: sen.text, rule: "long", label: count > 40 ? "Very long sentence" : "Long sentence",
          message: count + " words. Can it become two?", level: "sentence" });
      }
      var first = (sen.text.match(/^[\s\-*\d.)]*([A-Za-z']+)/) || [])[1];
      var isListItem = /^\s*(?:[-*]|\d+[.)])\s/.test(sen.text);
      if (first && !isListItem) {
        previousOpenings.push(first.toLowerCase());
        var k = previousOpenings.length;
        if (k >= 3 && previousOpenings[k - 1] === previousOpenings[k - 2] && previousOpenings[k - 2] === previousOpenings[k - 3]) {
          sentenceLevel.push({ start: sen.start, end: sen.end, text: sen.text, rule: "repeat", label: "Same opening three times",
            message: "Three sentences in a row start with \"" + first + "\". Vary the shape, or join two.", level: "sentence" });
        }
      } else {
        previousOpenings = [];
      }

      if (useCase === "email" && /\?["')\]]*$/.test(sen.text)) {
        questionCount++;
        if (questionCount === 2) {
          sentenceLevel.push({ start: sen.start, end: sen.end, text: sen.text, rule: "ask", label: "A second question",
            message: "More than one ask in this message. Which one do you most need answered?", level: "sentence" });
        }
      }
      var withoutYears = sen.text.replace(/\b(?:19|20)\d{2}\b/g, "");
      if (useCase === "notes" && /\d{3,}|[\u00A3$]\s?\d|\d\s?%/.test(withoutYears)
          && !/\b(?:report|source|according|as at|as of|per the|from the|said|says|reports?)\b/i.test(sen.text)
          && !new RegExp("\\b(?:" + MONTHS + ")\\b").test(sen.text)) {
        sentenceLevel.push({ start: sen.start, end: sen.end, text: sen.text, rule: "source", label: "Number with no source",
          message: "Where does this number come from, and as of when?", level: "sentence" });
      }
    }

    if (useCase === "notes") {
      words = words.concat(collect(text, NOTES_IMPRESSION, "impression", "Impression or result?", "Say who thought this, and whether anything confirms it."));
      words = words.concat(collect(text, NOTES_AGREED, "decision", "Decision or discussion?", "Who agreed, and to what exactly? If nobody decided, say so."));
    }

    if (useCase === "report") {
      var firstChunk = text.split(/\s+/).slice(0, 80).join(" ");
      if (text.trim() && !REPORT_FINDING.test(firstChunk)) {
        notes.push({ rule: "opening", label: "No finding up front", message: "I could not see a finding or a recommendation in the first 80 words. Say it first." });
      }
      words = words.concat(collect(text, REPORT_CLOSE, "close", "Does this add anything?", "If the reader has read the point, a summary repeats it."));
    }

    if (useCase === "post" && sentences.length) {
      var firstSentence = sentences[0];
      var fw = wordsIn(firstSentence.text).length;
      if (fw > 20) {
        sentenceLevel.push({ start: firstSentence.start, end: firstSentence.end, text: firstSentence.text, rule: "opening", label: "Long first line",
          message: fw + " words. The reader decides here whether to read the second line.", level: "sentence" });
      }
      words = words.concat(collect(text, POST_OPENER, "hype", "Hype opener", "Open with a fact, a number or a claim."));
      var bait = POST_BAIT.exec(text.trim());
      if (bait) {
        var at2 = text.lastIndexOf(bait[0]);
        sentenceLevel.push({ start: at2, end: at2 + bait[0].length, text: bait[0], rule: "bait", label: "Engagement bait", message: "End where the thought stops, not with a request for comments.", level: "sentence" });
      }
      var hashtags = (text.match(/#\w+/g) || []).length;
      if (hashtags > 3) notes.push({ rule: "hashtags", label: "Many hashtags", message: hashtags + " hashtags. Keep only the ones a reader would search for." });
      var emojiCount = (text.match(EMOJI) || []).length;
      if (emojiCount > 2) notes.push({ rule: "emoji", label: "Many emojis", message: emojiCount + " emojis. Keep only the ones that help a reader." });
    }

    var stats = statsFor(text, sentences);
    if (useCase === "email" && stats.words > 150) {
      notes.push({ rule: "length", label: "Long for an email", message: stats.words + " words. Could the ask go first, and the rest shrink?" });
    }

    var wordIssues = dropOverlaps(words);
    var issues = wordIssues.concat(sentenceLevel).sort(function (a, b) { return a.start - b.start; });
    return { issues: issues, wordIssues: wordIssues, notes: notes, stats: stats, useCase: useCase, houseFormatting: !!options.houseFormatting };
  }

  return { analyse: analyse, splitSentences: splitSentences, syllables: syllables, USE_CASES: USE_CASES };
});
