#!/usr/bin/env python3
"""Export participant workbook Markdown → styled HTML → PDF (Chrome headless).

Logo is stamped into the bottom-right *margin* of every PDF page after export
(so it never overlays tables/content — Chrome fixed-position logos do).

Usage:
  python3 scripts/export_workbook_pdf.py
"""

from __future__ import annotations

import re
import subprocess
import sys
from io import BytesIO
from pathlib import Path

try:
    import markdown
except ImportError:
    print("Install markdown: pip3 install markdown", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
MD = ROOT / "docs" / "BECOME_A_MANAGER_OF_AI_AGENTS_PARTICIPANT_WORKBOOK.md"
CSS = ROOT / "docs" / "workbook-print.css"
HTML = ROOT / "docs" / "BECOME_A_MANAGER_OF_AI_AGENTS_PARTICIPANT_WORKBOOK.html"
PDF = ROOT / "docs" / "BECOME_A_MANAGER_OF_AI_AGENTS_PARTICIPANT_WORKBOOK.pdf"
LOGO = ROOT / "docs" / "assets" / "mind-mapper-ai-academy-logo-print.png"
LOGO_FALLBACK = ROOT / "docs" / "assets" / "mind-mapper-ai-academy-logo.png"

CHROME_CANDIDATES = [
    Path("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"),
    Path("/Applications/Chromium.app/Contents/MacOS/Chromium"),
]


def stamp_logo_on_pdf(pdf_path: Path, logo_path: Path) -> None:
    """Draw logo in the bottom-right margin of every page (no content overlap)."""
    try:
        from pypdf import PdfReader, PdfWriter
        from reportlab.lib.pagesizes import A4
        from reportlab.pdfgen import canvas
        from PIL import Image
    except ImportError as e:
        print(
            "Logo stamp needs: pip3 install pypdf reportlab pillow\n"
            f"Missing: {e}",
            file=sys.stderr,
        )
        raise

    page_w, page_h = A4  # points
    # Keep logo inside the bottom margin band (~below content)
    logo_w = 78  # ~28mm — readable Academy mark in footer
    with Image.open(logo_path) as im:
        aspect = im.height / max(im.width, 1)
    logo_h = logo_w * aspect
    margin_right = 12
    margin_bottom = 8
    x = page_w - logo_w - margin_right
    y = margin_bottom

    # Logo overlay once (reused) — keeps PDF small
    logo_packet = BytesIO()
    lc = canvas.Canvas(logo_packet, pagesize=A4)
    lc.drawImage(
        str(logo_path),
        x,
        y,
        width=logo_w,
        height=logo_h,
        mask="auto",
        preserveAspectRatio=True,
        anchor="c",
    )
    lc.save()
    logo_packet.seek(0)
    logo_overlay = PdfReader(logo_packet).pages[0]

    reader = PdfReader(str(pdf_path))
    writer = PdfWriter()
    for i, page in enumerate(reader.pages):
        page.merge_page(logo_overlay)
        # Page number overlay (matches PDF viewer)
        num_packet = BytesIO()
        nc = canvas.Canvas(num_packet, pagesize=A4)
        nc.setFont("Helvetica", 9)
        nc.setFillColorRGB(0.2, 0.2, 0.2)
        nc.drawCentredString(page_w / 2, 12, f"Page {i + 1}")
        nc.save()
        num_packet.seek(0)
        page.merge_page(PdfReader(num_packet).pages[0])
        writer.add_page(page)

    tmp = pdf_path.with_suffix(".stamped.pdf")
    with tmp.open("wb") as f:
        writer.write(f)
    tmp.replace(pdf_path)


def main() -> int:
    raw = MD.read_text(encoding="utf-8")
    css = CSS.read_text(encoding="utf-8")
    embedded = ""
    m = re.search(r"<style>(.*?)</style>", raw, re.S)
    if m:
        embedded = m.group(1)

    body = markdown.markdown(
        raw,
        extensions=["tables", "fenced_code", "nl2br", "sane_lists", "attr_list"],
    )

    logo_path = LOGO if LOGO.exists() else LOGO_FALLBACK
    if not logo_path.exists():
        print(f"Missing logo: {logo_path}", file=sys.stderr)
        return 1

    # No fixed HTML logo — that overlays tables in Chrome print.
    HTML.write_text(
        f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Become a Manager of AI Agents — Participant Workbook</title>
<style>
{css}
{embedded}
</style>
</head>
<body class="workbook">
{body}
</body>
</html>
""",
        encoding="utf-8",
    )

    chrome = next((p for p in CHROME_CANDIDATES if p.exists()), None)
    if not chrome:
        print("Google Chrome not found. Open the HTML and Print → Save as PDF:", HTML)
        print("(Enable Background graphics in the print dialog.)")
        return 1

    cmd = [
        str(chrome),
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={PDF}",
        str(HTML),
    ]
    subprocess.run(cmd, check=False, capture_output=True)
    if not PDF.exists():
        print("PDF was not created.", file=sys.stderr)
        return 1

    stamp_logo_on_pdf(PDF, logo_path)
    print(f"Wrote {PDF} ({PDF.stat().st_size} bytes) with corner logo stamped")
    print(f"Also wrote {HTML}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
