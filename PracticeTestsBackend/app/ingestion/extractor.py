# Install PyMuPDF if not already installed
# pip install PyMuPDF

# This script extracts text and images from PDF files using PyMuPDF (fitz).

import fitz
import os

def extract_text_and_images(pdf_path, output_text_path, image_folder):
    #print(f"\n[DEBUG] PDF: {pdf_path}")
    #print(f"[DEBUG] Saving images to: {image_folder!r}")
    os.makedirs(image_folder, exist_ok=True)

    doc = fitz.open(pdf_path)
    full_text = ""

    for page_num, page in enumerate(doc, start=1):
        text = page.get_text()
        full_text += f"\n--- Page {page_num} ---\n{text}"

    with open(output_text_path, "w", encoding="utf-8") as f:
        f.write(full_text)

    print(f"[DEBUG] Text written to: {output_text_path}")
    print(f"[DEBUG] Done extracting from {pdf_path}\n")
