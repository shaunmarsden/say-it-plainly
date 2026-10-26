"""Unblind round two and compute totals. Run from the repository root with:
python3 evidence/skill-test-notes-round-two/analyse.py <folder with replies/, scores.json, mapping>
"""
import json, subprocess, sys
from pathlib import Path

folder = Path(sys.argv[1])
root = Path(__file__).resolve().parents[2]
mapping = json.loads((folder / "MAPPING_DO_NOT_READ_UNTIL_SCORED.json").read_text())
scores = json.loads((folder / "scores.json").read_text())

# (lines to skip at the start, text that ends the rewrite), fixed while the methods were hidden
CUT = {
    "d139626": (1, "Things for you to check before this goes anywhere:"), "d187503": (1, "Two small things I changed."),
    "d190434": (1, "Two small changes"), "d305664": (0, "What I changed"), "d314013": (0, "WHAT I CHANGED"),
    "d320196": (0, 'I kept "I think" on the 5 November date'), "d323222": (0, "**What I changed**"),
    "d325039": (1, None), "d469981": (0, None), "d527051": (0, "What I changed"),
    "d581509": (1, "Two things to check on your side:"), "d586317": (1, "Two things to check before you send this on:"),
    "d739045": (0, "What I changed"), "d791864": (0, "What I changed"), "d814676": (1, None),
    "d817260": (0, None), "d965121": (1, "The two points where Hollis and Mei disagreed"), "d978793": (0, None),
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

drafts = {d: (Path(__file__).parent / "drafts" / f"{d}.txt").read_text() for d in ("planning", "supplier", "pipeline")}
print("Draft words / checker flags:", {d: (words(t), flags(t)) for d, t in drafts.items()})

rows = []
for cid, m in sorted(mapping.items(), key=lambda kv: (kv[1]["draft"], kv[1]["arm"], kv[1]["run"])):
    lost, inv, add = scores[cid]
    rw = rewrite(cid)
    rows.append((m["draft"], m["arm"], m["run"], cid, len(lost), inv, add, words(rw), flags(rw)))
    print(f'{m["draft"]:9} {m["arm"]:10} run{m["run"]} {cid} lost={len(lost)} invented={inv} additions={add} words={words(rw)} flags={flags(rw)}')

print()
for arm in ("bare", "paragraph", "skill"):
    r = [x for x in rows if x[1] == arm]
    lost = sum(x[4] for x in r); inv = sum(x[5] for x in r); add = sum(x[6] for x in r)
    print(f"{arm:10} replies={len(r)} lost={lost} invented={inv} (lost+invented per reply {(lost+inv)/len(r):.2f}) "
          f"replies with an addition={add} mean words={sum(x[7] for x in r)/len(r):.0f} mean flags={sum(x[8] for x in r)/len(r):.1f}")
print()
for d in ("planning", "supplier", "pipeline"):
    for arm in ("bare", "paragraph", "skill"):
        r = [x for x in rows if x[0] == d and x[1] == arm]
        print(f"{d:9} {arm:10} lost+invented={sum(x[4]+x[5] for x in r)} additions={sum(x[6] for x in r)} words={[x[7] for x in r]}")
