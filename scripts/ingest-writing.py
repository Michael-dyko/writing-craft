#!/usr/bin/env python3
"""Convert Notion export in content/Writing into notes + extracted exercises."""

from __future__ import annotations

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "content" / "Writing"
NOTES_DIR = ROOT / "content" / "notes"
EXERCISES_DIR = ROOT / "content" / "exercises"
OLD_DIRS = [
    ROOT / "content" / "techniques",
    ROOT / "content" / "glossary",
    ROOT / "content" / "articles",
]

HEADING_RE = re.compile(r"^(#{1,6})\s+(.*)$")
META_RE = re.compile(r"^([^:]+):\s*(.*)$")
ORDER_RE = re.compile(r"^:\s*(\d+)\s*$")


def slugify(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9\u0400-\u04ff]+", "-", value)
    return value.strip("-")[:80].rstrip("-")


def unique_slug(base: str, used: set[str]) -> str:
    slug = slugify(base) or "zametka"
    if slug not in used:
        used.add(slug)
        return slug
    index = 2
    while f"{slug}-{index}" in used:
        index += 1
    slug = f"{slug}-{index}"
    used.add(slug)
    return slug


def parse_heading(line: str) -> tuple[int, str] | None:
    match = HEADING_RE.match(line)
    if not match:
        return None
    return len(match.group(1)), match.group(2).strip()


def is_exercise_heading(text: str) -> bool:
    if re.fullmatch(r"(?:\d+\.\s+)?Упражнения", text, flags=re.I):
        return False
    return "упражнение" in text.lower()


def exercise_title(text: str) -> str:
    title = re.sub(r"^\d+\.\s+", "", text).strip()
    title = re.sub(
        r"^Упражнение(?:\s*№\s*\d+)?(?:\s+\d+)?(?:[.:]\s*|\s+)?",
        "",
        title,
        flags=re.I,
    ).strip()
    return title or text


def split_values(value: str) -> list[str]:
    return [part.strip() for part in value.split(",") if part.strip()]


def parse_notion(raw: str) -> tuple[str, dict[str, object], str]:
    lines = raw.splitlines()
    title = lines[0].lstrip("# ").strip() if lines else ""
    meta: dict[str, object] = {}
    index = 1
    while index < len(lines):
        line = lines[index].strip()
        if not line:
            index += 1
            continue
        order = ORDER_RE.match(line)
        if order:
            meta["order"] = int(order.group(1))
            index += 1
            continue
        if line.startswith("#"):
            break
        field = META_RE.match(line)
        if not field:
            break
        key, value = field.group(1).strip(), field.group(2).strip()
        if key in {"Задача", "Область", "Жанр", "Этап работы"}:
            meta[key] = split_values(value)
        else:
            meta[key] = value
        index += 1
    body = "\n".join(lines[index:]).strip()
    if body.startswith(f"# {title}"):
        body = body[len(title) + 2 :].lstrip("\n")
    return title, meta, body


def first_paragraph(body: str) -> str:
    chunks: list[str] = []
    for block in re.split(r"\n\s*\n", body):
        text = block.strip()
        if not text or text.startswith("#") or text.startswith(">") or text.startswith("---"):
            continue
        if text.startswith("- ") or text.startswith("|") or text.startswith(":::"):
            continue
        text = re.sub(r"[*_`]", "", text)
        text = re.sub(r"\[(.*?)\]\(.*?\)", r"\1", text)
        text = re.sub(r"\s+", " ", text).strip()
        if len(text) < 40:
            continue
        chunks.append(text)
        if len(" ".join(chunks)) >= 180:
            break
    summary = " ".join(chunks)
    if len(summary) > 240:
        clipped = summary[:237]
        if " " in clipped:
            clipped = clipped.rsplit(" ", 1)[0]
        summary = clipped.rstrip(".,;:") + "…"
    return summary or "Рабочая заметка по писательскому мастерству."


def extract_exercises(body: str, parent_slug: str, used: set[str]) -> tuple[str, list[dict[str, str]]]:
    lines = body.split("\n")
    output: list[str] = []
    exercises: list[dict[str, str]] = []
    index = 0
    sequence = 1
    while index < len(lines):
        heading = parse_heading(lines[index])
        if heading and is_exercise_heading(heading[1]):
            level, text = heading
            start = index
            index += 1
            while index < len(lines):
                nxt = parse_heading(lines[index])
                if nxt and nxt[0] <= level:
                    break
                index += 1
            block = "\n".join(lines[start:index]).strip()
            title = exercise_title(text)
            slug = unique_slug(f"{parent_slug}-{title}", used)
            output.append(f":::exercise {slug}:::")
            exercises.append(
                {
                    "title": title,
                    "slug": slug,
                    "body": block,
                    "order": str(sequence),
                    "summary": first_paragraph(block),
                }
            )
            sequence += 1
            continue
        output.append(lines[index])
        index += 1
    rebuilt = re.sub(r"\n{3,}", "\n\n", "\n".join(output)).strip()
    return rebuilt, exercises


def dump_frontmatter(data: dict[str, object], body: str) -> str:
    lines = ["---"]
    for key, value in data.items():
        if value is None or value == "" or value == []:
            continue
        if isinstance(value, list):
            lines.append(f"{key}: [{', '.join(str(item) for item in value)}]")
        elif isinstance(value, bool):
            lines.append(f"{key}: {str(value).lower()}")
        else:
            lines.append(f"{key}: {value}")
    lines.append("---")
    lines.append("")
    return "\n".join(lines) + body.rstrip() + "\n"


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"No source folder: {SOURCE}")

    NOTES_DIR.mkdir(parents=True, exist_ok=True)
    EXERCISES_DIR.mkdir(parents=True, exist_ok=True)
    for leftover in list(NOTES_DIR.glob("*.md")) + list(EXERCISES_DIR.glob("*.md")):
        leftover.unlink()

    used_slugs: set[str] = set()
    notes = 0
    exercise_count = 0

    for path in sorted(SOURCE.glob("*.md")):
        raw = path.read_text(encoding="utf-8")
        title, meta, body = parse_notion(raw)
        note_slug = unique_slug(title, used_slugs)
        rebuilt, exercises = extract_exercises(body, note_slug, used_slugs)
        order = meta.get("order", 1000 + notes)
        note_data = {
            "title": title,
            "slug": note_slug,
            "summary": first_paragraph(body),
            "module": meta.get("Модуль"),
            "areas": meta.get("Область", []),
            "tasks": meta.get("Задача", []),
            "genres": meta.get("Жанр", []),
            "stages": meta.get("Этап работы", []),
            "order": order,
        }
        (NOTES_DIR / f"{note_slug}.md").write_text(
            dump_frontmatter(note_data, rebuilt),
            encoding="utf-8",
        )
        notes += 1
        for item in exercises:
            exercise_data = {
                "title": item["title"],
                "slug": item["slug"],
                "summary": item["summary"],
                "module": meta.get("Модуль"),
                "areas": meta.get("Область", []),
                "tasks": meta.get("Задача", []),
                "genres": meta.get("Жанр", []),
                "stages": meta.get("Этап работы", []),
                "parent": f"notes/{note_slug}",
                "order": int(item["order"]),
            }
            (EXERCISES_DIR / f"{item['slug']}.md").write_text(
                dump_frontmatter(exercise_data, item["body"]),
                encoding="utf-8",
            )
            exercise_count += 1

    shutil.rmtree(SOURCE)
    for folder in OLD_DIRS:
        if folder.exists():
            shutil.rmtree(folder)

    print(f"notes: {notes}")
    print(f"exercises: {exercise_count}")


if __name__ == "__main__":
    main()
