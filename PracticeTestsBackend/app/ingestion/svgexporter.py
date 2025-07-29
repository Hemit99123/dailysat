# Install svgpathtools and PyPDF2 if not already installed
# pip install svgpathtools PyPDF2

# Also install pdftocairo (part of poppler-utils) and Inkscape
# For Windows, you can download poppler from https://github.com/oschwartz10612/poppler-windows/releases/
# For Inkscape, download from https://inkscape.org/release/inkscape-1.3.1/

# This script extracts diagrams from PDF files, converts them to SVG format,
# and crops them to the bounding boxes of the diagrams. 

import os
from pathlib import Path
from svgpathtools import svg2paths2
import subprocess
import shutil
from PyPDF2 import PdfReader

# Settings (replace with your paths)
INPUT_PDF_DIR = Path("PDFs")
TMP_SVG_DIR = Path("tmp_svg_pages")
OUT_DIR = Path("output_diagrams")
MIN_AREA = 1000
GROUP_DIST = 30
CLEAN_TMP = True

INKSCAPE = r"C:\Program Files\Inkscape\bin\inkscape.com"

TMP_SVG_DIR.mkdir(exist_ok=True)
OUT_DIR.mkdir(exist_ok=True)

def pdf_to_svgs(pdf_path, out_folder):
    out_folder.mkdir(exist_ok=True)
    pdf_name = pdf_path.stem
    reader = PdfReader(str(pdf_path))
    num_pages = len(reader.pages)
    print(f"  -> PDF '{pdf_name}' has {num_pages} pages.")
    for page in range(1, num_pages + 1):
        out_svg = out_folder / f"{pdf_name}_page_{page}.svg"
        cmd = [
            'pdftocairo', '-svg', '-f', str(page), '-l', str(page),
            str(pdf_path), str(out_svg)
        ]
        result = subprocess.run(cmd, capture_output=True)
        if result.returncode == 0:
            print(f"    [SVG] Page {page} exported.")
        else:
            print(f"    [ERROR] Could not export page {page} to SVG.")

def detect_bboxes(svg_path):
    paths, _, _ = svg2paths2(str(svg_path))
    bboxes = []
    for path in paths:
        x0, x1, y0, y1 = path.bbox()
        if (x1 - x0) * (y1 - y0) >= MIN_AREA:
            bboxes.append((x0, y0, x1, y1))
    return bboxes

def merge_boxes(boxes):
    merged = []
    used = set()
    for a, b in enumerate(boxes):
        if a in used: continue
        x0, y0, x1, y1 = b
        group = [b]
        used.add(a)
        for j, b2 in enumerate(boxes):
            if j in used: continue
            xx0, yy0, xx1, yy1 = b2
            if (abs(x0 - xx0) < GROUP_DIST or abs(x1 - xx1) < GROUP_DIST or
                abs(y0 - yy0) < GROUP_DIST or abs(y1 - yy1) < GROUP_DIST):
                group.append(b2)
                used.add(j)
        mx0 = min(g[0] for g in group)
        my0 = min(g[1] for g in group)
        mx1 = max(g[2] for g in group)
        my1 = max(g[3] for g in group)
        merged.append((int(mx0), int(my0), int(mx1), int(my1)))
    return merged

if __name__ == "__main__":
    all_pdfs = list(INPUT_PDF_DIR.glob("*.pdf"))
    print(f"Found {len(all_pdfs)} PDF(s) in {INPUT_PDF_DIR}")
    for pdf_idx, pdf_path in enumerate(all_pdfs, 1):
        pdf_name = pdf_path.stem
        print(f"\n=== [{pdf_idx}/{len(all_pdfs)}] Processing {pdf_name}.pdf ===")
        tmp_dir = TMP_SVG_DIR / pdf_name
        out_dir = OUT_DIR / pdf_name
        tmp_dir.mkdir(exist_ok=True)
        out_dir.mkdir(exist_ok=True)

        pdf_to_svgs(pdf_path, tmp_dir)

        all_svgs = list(tmp_dir.glob("*.svg"))
        for svg_idx, svg_file in enumerate(all_svgs, 1):
            page_num = svg_file.stem.split("_")[-1]
            print(f"  -> Page {page_num} ({svg_idx}/{len(all_svgs)})")
            raw_boxes = detect_bboxes(svg_file)
            diagram_boxes = merge_boxes(raw_boxes)

            if not diagram_boxes:
                print(f"     [!] No diagrams found on this page.")
                continue

            for idx, (x0, y0, x1, y1) in enumerate(diagram_boxes, start=1):
                # Clamp coordinates to avoid negatives
                x0 = max(0, int(x0))
                y0 = max(0, int(y0))
                x1 = int(x1)
                y1 = int(y1)
                out_svg = out_dir / f"page{page_num}_diagram{idx}.svg"
                print(f"     - Exporting diagram {idx} (area: {x0},{y0},{x1},{y1}) ...")
                # 1. Export cropped SVG with modern flags
                subprocess.run([
                    INKSCAPE, str(svg_file),
                    f"--export-area={x0}:{y0}:{x1}:{y1}",
                    "--export-type=svg",
                    f"--export-filename={out_svg}"
                ], check=True)
                # 2. Resize SVG canvas to drawing (modern action name)
                subprocess.run([
                    INKSCAPE, str(out_svg),
                    "--batch-process",
                    "--actions=object-fit-canvas-to-drawing;export-do"
                ], check=True)
                print(f"     - Diagram {idx} cropped and autosized.")

            print(f"     {len(diagram_boxes)} diagram(s) extracted from page {page_num}.")

        if CLEAN_TMP and tmp_dir.exists():
            shutil.rmtree(tmp_dir)
            print(f"  [Temp cleaned] {tmp_dir}")

    if CLEAN_TMP:
        print("All temporary SVG files have been cleaned up.")
    else:
        print("Temporary SVG files are kept in tmp_svg_pages/[PDF name]/")
    print("\n✅ Done! All diagrams are in output_diagrams/[PDF name]/")
