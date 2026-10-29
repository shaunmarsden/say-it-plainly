"""Unblind round five and add up the totals. Run with:
python3 evidence/skill-test-round-five/analyse.py evidence/skill-test-round-five
"""
import json, re, sys
from pathlib import Path
folder = Path(sys.argv[1])
mapping = json.loads((folder / "mapping.json").read_text())
scores = json.loads((folder / "scores.json").read_text())
def rewrite(t):
    # The rewrite only: drop a "Here is..." first line and stop at the reply's notes.
    lines = t.strip().split("\n")
    if lines[0].startswith("Here"):
        lines = lines[1:]
    out = []
    for line in lines:
        if re.match(r"^(\*\*)?(What I changed|Notes on what I changed)", line):
            break
        out.append(line)
    return "\n".join(out).strip().strip("-").strip()
for arm in ("bare", "paragraph", "skill"):
    cs = [c for c, m in mapping.items() if m["arm"] == arm]
    for c in cs:
        assert scores[c]["draft"] == mapping[c]["draft"], c
    lost = sum(scores[c]["lost"] for c in cs)
    inv = sum(scores[c]["invented"] for c in cs)
    words = [len(rewrite((folder / "replies" / f"{c}.txt").read_text()).split()) for c in cs]
    bait = sum(scores[c].get("bait_cut", 0) for c in cs)
    print(f'{arm:9} lost={lost} invented={inv} lost+invented={lost + inv} '
          f'additions={sum(scores[c]["additions"] for c in cs)} mean rewrite words={sum(words) / len(words):.0f} '
          f'post replies cutting question and hashtags={bait}/2')
