"""Extract zápočet questions from the RNS PDFs into src/data/questions.json.

Usage: python scripts/extract.py   (needs: pip install pymupdf)

Source of truth is the text of Zápočet_RNS.pdf (it already contains the
"Správna odpoveď" lines). The highlight annotations in Zápočet_RNS_odpovede2/3.pdf
are cross-checked against it; mismatches are printed and written to
scripts/crosscheck.json for review in ISSUES.md.
"""
import json
import re
import sys
import unicodedata
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parent.parent
SOURCE = "Zápočet_RNS.pdf"
HIGHLIGHTED = ["Zápočet_RNS_odpovede2.pdf", "Zápočet_RNS_odpovede3.pdf"]
OUT = ROOT / "src" / "data" / "questions.json"
CROSSCHECK = ROOT / "scripts" / "crosscheck.json"

OPTION_RE = re.compile(r"^([A-D])\)\s*(.*)$")
ANSWER_RE = re.compile(r"^Správna odpoveď:\s*[„“\"]?(.*?)[„“\"]?\s*$")
POINTS_RE = re.compile(r"\s*\((\d+)b\.\)\s*$")

# Plain-text formulas from the PDF -> KaTeX. Exact strings only, so nothing
# is rewritten by accident; anything not listed stays as in the PDF.
MATH = [
    ("(𝑢, 𝑢̇)", r"$(u, \dot{u})$"),
    ("(𝑦, 𝑦̇)", r"$(y, \dot{y})$"),
    ("(u, y)", r"$(u, y)$"),
    ("dy/dt + y^2 = 1", r"$\frac{dy}{dt} + y^2 = 1$"),
    ("F * F’ < 0", r"$F \cdot F' < 0$"),
    ("F + F’ < 0", r"$F + F' < 0$"),
    ("F * F’ > 0", r"$F \cdot F' > 0$"),
    ("F + F’ > 0", r"$F + F' > 0$"),
    ("F’", r"$F'$"),
    ("Re(G(jw)) =  Re(1/GN(A))  a Im(G(jw)) = Im(1/GN(A))",
     r"$\mathrm{Re}(G(jw)) = \mathrm{Re}(1/G_N(A))$ a $\mathrm{Im}(G(jw)) = \mathrm{Im}(1/G_N(A))$"),
    ("Re(G(jw)) =  Re(GN(A))      a Im(G(jw)) = Im(GN(A))",
     r"$\mathrm{Re}(G(jw)) = \mathrm{Re}(G_N(A))$ a $\mathrm{Im}(G(jw)) = \mathrm{Im}(G_N(A))$"),
    ("Re(G(jw)) =  Re(-GN(A))     a Im(G(jw)) = Im(-GN(A))",
     r"$\mathrm{Re}(G(jw)) = \mathrm{Re}(-G_N(A))$ a $\mathrm{Im}(G(jw)) = \mathrm{Im}(-G_N(A))$"),
    ("Re(G(jw)) =  Re(-1/GN(A)) a Im(G(jw)) = Im(-1/GN(A))",
     r"$\mathrm{Re}(G(jw)) = \mathrm{Re}(-1/G_N(A))$ a $\mathrm{Im}(G(jw)) = \mathrm{Im}(-1/G_N(A))$"),
    ("Re(G(jw)) =  0 a Im(GN(A)) = -1",
     r"$\mathrm{Re}(G(jw)) = 0$ a $\mathrm{Im}(G_N(A)) = -1$"),
    ("Re(G(jw)) = -1 a Im(GN(A)) =  0",
     r"$\mathrm{Re}(G(jw)) = -1$ a $\mathrm{Im}(G_N(A)) = 0$"),
    ("Re(G(jw)GN(A)) = -1 a Im(G(jw)GN(A)) = 0",
     r"$\mathrm{Re}(G(jw)G_N(A)) = -1$ a $\mathrm{Im}(G(jw)G_N(A)) = 0$"),
    ("Re(G(jw)GN(A)) =  0 a Im(G(jw)GN(A)) = -1",
     r"$\mathrm{Re}(G(jw)G_N(A)) = 0$ a $\mathrm{Im}(G(jw)G_N(A)) = -1$"),
    ("G(jw) = GN(A)", r"$G(jw) = G_N(A)$"),
    ("G(jw)GN(A) = 1", r"$G(jw)G_N(A) = 1$"),
    ("G(jw)GN(A) = -1", r"$G(jw)G_N(A) = -1$"),
    ("G(jw) = -GN(A)", r"$G(jw) = -G_N(A)$"),
    ("G(jw)", r"$G(jw)$"),
    ("GN(A)", r"$G_N(A)$"),
]
MATH = [(re.sub(r"\s+", " ", p).strip(), t) for p, t in MATH]


def to_md(text):
    text = re.sub(r"\s+", " ", text).strip()
    if text in dict(MATH):
        return dict(MATH)[text]
    for plain, tex in MATH:
        # skip spans that are already inside $...$
        parts = re.split(r"(\$[^$]*\$)", text)
        text = "".join(p if p.startswith("$") else p.replace(plain, tex) for p in parts)
    return text


def plain(md):
    """Searchable plain text (no $, no markdown)."""
    return re.sub(r"[$*\\]", "", md)


def slug(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def parse(pdf_path):
    topic = None
    questions = []
    cur = None
    mode = None  # "q" | "opt"

    def finish():
        nonlocal cur
        if cur:
            questions.append(cur)
        cur = None

    for pno, page in enumerate(pymupdf.open(pdf_path), start=1):
        for raw in page.get_text().splitlines():
            line = raw.strip()
            if not line:
                continue
            if line.startswith("Téma:"):
                finish()
                topic = line[len("Téma:"):].strip()
                continue
            m = ANSWER_RE.match(line)
            if m and cur:
                cur["answerRaw"] = m.group(1).strip()
                finish()
                mode = None
                continue
            m = OPTION_RE.match(line)
            if m and cur:
                cur["options"].append({"key": m.group(1), "text": m.group(2)})
                mode = "opt"
                continue
            if mode == "opt":
                cur["options"][-1]["text"] = (cur["options"][-1]["text"] + " " + line).strip()
            elif cur and mode == "q":
                cur["question"] += " " + line
            else:
                finish()
                cur = {"topic": topic, "question": line, "options": [], "page": pno}
                mode = "q"
    finish()
    return questions


def highlights(pdf_path):
    out = []
    for pno, page in enumerate(pymupdf.open(pdf_path), start=1):
        for a in page.annots():
            if a.type[1] == "Highlight":
                out.append((pno, a.rect.y0))
    return out


def option_positions(pdf_path):
    """(page, y, letter) of every option line, in reading order."""
    pos = []
    for pno, page in enumerate(pymupdf.open(pdf_path), start=1):
        for b in page.get_text("dict")["blocks"]:
            for l in b.get("lines", []):
                t = "".join(s["text"] for s in l["spans"]).strip()
                if OPTION_RE.match(t):
                    pos.append((pno, l["bbox"][1], t[0]))
    return pos


def main():
    qs = parse(ROOT / SOURCE)
    topics = []
    result = []
    problems = []
    for i, q in enumerate(qs, start=1):
        if q["topic"] not in topics:
            topics.append(q["topic"])
        question = q["question"]
        pm = POINTS_RE.search(question)
        points = int(pm.group(1)) if pm else None
        question = POINTS_RE.sub("", question).strip()
        options = [{"key": o["key"], "text": to_md(o["text"])} for o in q["options"]]
        raw = q.get("answerRaw", "")
        km = re.fullmatch(r"([A-D])\)\s*", raw)
        correct = km.group(1) if km else None
        if correct:
            opt = next((o for o in options if o["key"] == correct), None)
            if not opt:
                problems.append(f"q{i}: correct key {correct} not among options")
            answer = f"**{correct})** {opt['text'] if opt else ''}".strip()
        else:
            answer = to_md(raw)
        if not raw:
            problems.append(f"q{i}: no 'Správna odpoveď' line")
        if points is None:
            problems.append(f"q{i}: no point value '(1b.)' in question text")
        qmd = to_md(question)
        result.append({
            "id": f"q{i:03d}",
            "topicId": f"t{topics.index(q['topic']) + 1}",
            "topic": q["topic"],
            "question": qmd,
            "options": options,
            "correct": correct,
            "answer": answer,
            "points": points,
            "images": [],
            "source": {"pdf": SOURCE, "page": q["page"]},
            "searchText": plain(qmd + " " + " ".join(o["text"] for o in options) + " " + answer),
        })

    # Cross-check "Správna odpoveď" against highlights in the annotated copies.
    check = []
    for name in HIGHLIGHTED:
        path = ROOT / name
        if not path.exists():
            continue
        pos = iter(option_positions(path))
        owners = [(next(pos), q) for q in result for _ in q["options"]]
        marked = {}
        for pno, y in highlights(path):
            best = min((o for o in owners if o[0][0] == pno),
                       key=lambda o: abs(o[0][1] - y), default=None)
            if best and abs(best[0][1] - y) < 6:
                marked.setdefault(best[1]["id"], set()).add(best[0][2])
        for q in result:
            got = marked.get(q["id"], set())
            if q["correct"] and got != {q["correct"]}:
                check.append({"pdf": name, "id": q["id"], "page": q["source"]["page"],
                              "statedCorrect": q["correct"], "highlighted": sorted(got)})

    OUT.parent.mkdir(parents=True, exist_ok=True)
    data = {
        "generatedFrom": [SOURCE] + HIGHLIGHTED,
        "topics": [{"id": f"t{i + 1}", "name": t, "slug": slug(t)} for i, t in enumerate(topics)],
        "questions": result,
    }
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    CROSSCHECK.write_text(json.dumps({"parseWarnings": problems, "highlightMismatches": check},
                                     ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{len(result)} questions, {len(topics)} topics -> {OUT.relative_to(ROOT)}")
    for p in problems:
        print("WARN", p)
    for c in check:
        print("MISMATCH", c)
    return 0


if __name__ == "__main__":
    sys.exit(main())
