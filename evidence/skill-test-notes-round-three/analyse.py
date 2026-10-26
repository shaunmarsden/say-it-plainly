"""Unblind round three and compute totals. Run from the repository root with:
python3 evidence/skill-test-notes-round-three/analyse.py <folder with replies/, scores.json, mapping>
"""
import json, subprocess, sys
from pathlib import Path

folder = Path(sys.argv[1])
root = Path(__file__).resolve().parents[2]
mapping = json.loads((folder / "MAPPING_DO_NOT_READ_UNTIL_SCORED.json").read_text())
scores = json.loads((folder / "scores.json").read_text())
ARMS = ("bare", "paragraph", "skill1", "skill2")

# (lines to skip at the start, text that ends the rewrite), fixed while the methods were hidden
CUT = {
    "e188742": (0, "What I changed"), "e205673": (0, None), "e206769": (1, "**What I changed**"),
    "e227884": (0, "**What I changed**"), "e295497": (0, "What I changed"), "e304869": (1, "Two small notes on what I did"),
    "e308430": (0, "**What I changed**"), "e311870": (0, None), "e324297": (0, "Notes on what I left alone"),
    "e356265": (1, "Two things I changed on purpose."), "e393650": (0, "**What I changed**"), "e406034": (0, "**What I changed**"),
    "e422618": (1, "Three things I would fix before you send this:"), "e427795": (1, "Two things I changed that you should check."),
    "e515460": (0, "What I changed"), "e538167": (1, "Changes I made:"), "e561081": (1, "Two notes. Your draft says"),
    "e610550": (0, "**What I changed**"), "e630552": (1, "What I changed:"), "e648562": (0, "---"),
    "e769857": (0, "**What I changed**"), "e784911": (0, "**What I changed**"), "e910961": (1, "Two things to check before this goes anywhere."),
    "e988511": (0, None),
}

def rewrite(cid):
    text = (folder / "replies" / f"{cid}.txt").read_text()
    skip, end = CUT[cid]
    text = "\n".join(text.split("\n")[skip:])
    if end:
        text = text[: text.index(end)]
    return text.strip()

def words(t): return len(t.split())

def flags(t):
    js = ("const c=require(%r);const r=c.analyse(require('fs').readFileSync(0,'utf8'),{useCase:'notes',houseFormatting:false});"
          "console.log(r.issues.length)") % str(root / "docs" / "checker.js")
    return int(subprocess.run(["node", "-e", js], input=t, capture_output=True, text=True, check=True).stdout)

drafts = {d: (Path(__file__).parent / "drafts" / f"{d}.txt").read_text() for d in ("workshop", "pipeline", "escalation")}
print("Draft words / checker flags:", {d: (words(t), flags(t)) for d, t in drafts.items()})

rows = []
for cid, m in sorted(mapping.items(), key=lambda kv: (kv[1]["draft"], ARMS.index(kv[1]["arm"]), kv[1]["run"])):
    lost, inv, add = scores[cid]
    rw = rewrite(cid)
    rows.append((m["draft"], m["arm"], m["run"], cid, len(lost), inv, add, words(rw), flags(rw)))
    print(f'{m["draft"]:10} {m["arm"]:10} run{m["run"]} {cid} lost={len(lost)} invented={inv} additions={add} words={words(rw)} flags={flags(rw)}')

print()
for arm in ARMS:
    r = [x for x in rows if x[1] == arm]
    lost = sum(x[4] for x in r); inv = sum(x[5] for x in r); add = sum(x[6] for x in r)
    prob = sum(1 for x in r if x[4] or x[5])
    print(f"{arm:10} replies={len(r)} lost={lost} invented={inv} replies with lost-or-invented={prob} replies with an addition={add} "
          f"mean words={sum(x[7] for x in r)/len(r):.0f} mean flags={sum(x[8] for x in r)/len(r):.1f}")
print()
for d in ("workshop", "pipeline", "escalation"):
    for arm in ARMS:
        r = [x for x in rows if x[0] == d and x[1] == arm]
        print(f"{d:10} {arm:10} lost+invented={sum(x[4]+x[5] for x in r)} additions={sum(x[6] for x in r)} words={[x[7] for x in r]}")
