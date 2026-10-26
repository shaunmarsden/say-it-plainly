"""Unblind the other-skills test and compute totals. Run from the repository root with:
python3 evidence/skill-test-other-skills/analyse.py <folder with replies/, scores.json, mapping>
"""
import json, subprocess, sys
from pathlib import Path
folder = Path(sys.argv[1]); root = Path(__file__).resolve().parents[2]
mapping = json.loads((folder / "MAPPING_DO_NOT_READ_UNTIL_SCORED.json").read_text())
scores = json.loads((folder / "scores.json").read_text())
ARMS = ("bare", "paragraph", "skill"); DRAFTS = ("email", "report", "post", "general")
USE = {"email": "email", "report": "report", "post": "post", "general": "general"}
# (lines to skip at the start, text that ends the rewrite), fixed while the methods were hidden
CUT = {
    "h123209": (0, None), "h147741": (1, "Two things I changed beyond wording."), "h246128": (3, "\n---"),
    "h248629": (1, "What I changed:"), "h252623": (1, "Notes on what I changed:"), "h266609": (0, "**What I changed**"),
    "h297823": (0, None), "h317871": (3, "\n---"), "h324193": (0, None), "h363132": (1, "**What I changed**"),
    "h364935": (0, "**What I changed**"), "h425615": (3, "\n---"), "h504668": (0, "---"), "h532567": (0, "**What I changed**"),
    "h566859": (0, "**What I changed**"), "h574398": (1, "What I changed:"), "h593485": (0, None), "h673168": (1, "What I changed:"),
    "h695557": (0, None), "h722413": (0, "What I changed"), "h757123": (1, "What I changed:"), "h801114": (1, "**What I changed**"),
    "h882873": (0, "**What I changed**"), "h884400": (0, None),
}
def rewrite(cid):
    t = (folder / "replies" / f"{cid}.txt").read_text()
    skip, end = CUT[cid]
    t = "\n".join(t.split("\n")[skip:])
    if end: t = t[: t.index(end)]
    return t.strip()
def words(t): return len(t.split())
def flags(t, use):
    js = ("const c=require(%r);const r=c.analyse(require('fs').readFileSync(0,'utf8'),{useCase:%r,houseFormatting:false});console.log(r.issues.length)") % (str(root / "docs" / "checker.js"), use)
    return int(subprocess.run(["node", "-e", js], input=t, capture_output=True, text=True, check=True).stdout)
drafts = {d: (Path(__file__).parent / "drafts" / f"{d}.txt").read_text() for d in DRAFTS}
print("Draft words / flags:", {d: (words(t), flags(t, USE[d])) for d, t in drafts.items()})
rows = []
for cid, m in mapping.items():
    lost, inv, add = scores[cid]; rw = rewrite(cid)
    rows.append((m["draft"], m["arm"], m["run"], cid, lost, inv, add, words(rw), flags(rw, USE[m["draft"]])))
for r in sorted(rows, key=lambda r: (DRAFTS.index(r[0]), ARMS.index(r[1]), r[2])):
    print(f"{r[0]:8} {r[1]:10} run{r[2]} {r[3]} lost={r[4]} invented={r[5]} additions={r[6]} words={r[7]} flags={r[8]}")
print()
for arm in ARMS:
    x = [r for r in rows if r[1] == arm]
    print(f"{arm:10} replies={len(x)} lost={sum(r[4] for r in x)} invented={sum(r[5] for r in x)} additions={sum(r[6] for r in x)} mean words={sum(r[7] for r in x)/len(x):.0f} mean flags={sum(r[8] for r in x)/len(x):.1f}")
print()
for d in DRAFTS:
    for arm in ARMS:
        x = [r for r in rows if r[0] == d and r[1] == arm]
        print(f"{d:8} {arm:10} words={[r[7] for r in x]} flags={[r[8] for r in x]}")
