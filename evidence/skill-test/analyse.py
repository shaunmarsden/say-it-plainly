"""Unblind the skill test and compute the totals. Run from the repository root with:
python3 evidence/skill-test/analyse.py <folder holding replies/, scores.json and the mapping file>
"""
import json, re, subprocess, sys
from pathlib import Path

folder = Path(sys.argv[1])
root = Path(__file__).resolve().parents[2]
mapping = json.loads((folder / "MAPPING_DO_NOT_READ_UNTIL_SCORED.json").read_text())
scores = json.loads((folder / "scores.json").read_text())

# Where the rewritten text starts and ends in each reply, fixed while the arms were hidden.
# (lines to skip at the start, text that ends the rewrite)
CUT = {
    "c155470": (0, None), "c235353": (0, "Best,\nSam"), "c316908": (1, "What I changed"),
    "c328280": (1, "Two things I could not tell"), "c329360": (0, "**What I changed**"),
    "c422856": (0, "**What I changed**"), "c490527": (1, "What I changed:"),
    "c491583": (0, "**What I changed**"), "c506435": (1, "What I changed:"),
    "c528971": (0, "What I changed"), "c620390": (0, "---"), "c620449": (0, None),
    "c749533": (0, "**What I changed**"), "c813579": (0, "**What I changed**"),
    "c825260": (1, None), "c891357": (0, None), "c906041": (1, "What I changed:"),
    "c908060": (0, None),
}

def rewrite(cid):
    text = (folder / "replies" / f"{cid}.txt").read_text()
    skip, end = CUT[cid]
    text = "\n".join(text.split("\n")[skip:])
    if end:
        i = text.index(end)
        text = text[: i + len(end)] if end.startswith("Best") else text[:i]
    return text.strip()

def words(t): return len(t.split())

def flags(t, use):
    js = ("const c=require(%r);const r=c.analyse(require('fs').readFileSync(0,'utf8'),{useCase:%r,houseFormatting:false});"
          "console.log(r.issues.length)") % (str(root / "docs" / "checker.js"), use)
    return int(subprocess.run(["node", "-e", js], input=t, capture_output=True, text=True, check=True).stdout)

use = {"email": "email", "notes": "notes", "report": "report"}
drafts = {d: (root / "evidence/skill-test/drafts" / f"{d}.txt").read_text() for d in use}
print("Draft words / checker flags:", {d: (words(t), flags(t, d)) for d, t in drafts.items()})

rows = []
for cid, m in sorted(mapping.items(), key=lambda kv: (kv[1]["draft"], kv[1]["arm"], kv[1]["run"])):
    lost, inv = scores[cid]
    rw = rewrite(cid)
    rows.append((m["draft"], m["arm"], m["run"], cid, len(lost), inv, words(rw), flags(rw, m["draft"]), lost))
    print(f'{m["draft"]:7} {m["arm"]:10} run{m["run"]} {cid} lost={len(lost)} {lost} invented={inv} words={words(rw)} flags={flags(rw, m["draft"])}')

print()
for arm in ("bare", "paragraph", "skill"):
    r = [x for x in rows if x[1] == arm]
    lost = sum(x[4] for x in r); inv = sum(x[5] for x in r)
    print(f"{arm:10} replies={len(r)} items lost={lost} invented={inv} total={lost+inv} per reply={(lost+inv)/len(r):.2f} "
          f"mean words={sum(x[6] for x in r)/len(r):.0f} mean flags={sum(x[7] for x in r)/len(r):.1f}")
print()
for d in use:
    for arm in ("bare", "paragraph", "skill"):
        r = [x for x in rows if x[0] == d and x[1] == arm]
        print(f"{d:7} {arm:10} lost+invented={sum(x[4]+x[5] for x in r)} words={[x[6] for x in r]} flags={[x[7] for x in r]}")
