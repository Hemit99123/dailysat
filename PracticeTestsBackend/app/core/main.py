# Install pymongo, PyMuPDF, and selenium if you haven't already:
# pip install pymongo PyMuPDF selenium webdriver-manager

# This script processes PDF files in a specified directory, extracts text and images,
# and uploads the extracted data to a MongoDB database. It also handles the creation of
# necessary directories for storing text files and images.
# It assumes the existence of `extractor`, `jsonparse`, and `upload` scripts for extracting text and images, parsing questions, and uploading to MongoDB.

import os
import json
from extractor import extract_text_and_images
from jsonparse import parse_questions
from upload import upload_to_mongo

# Settings (replace with your paths)
from dotenv import load_dotenv
load_dotenv()

PDF_DIR = os.environ.get("PDF_DIR", "data/input_pdfs")
TEXT_DIR = os.environ.get("TEXT_DIR", "data/extracted_text")
DIAGRAMS_ROOT = os.environ.get("DIAGRAMS_ROOT", "data/diagrams")


def process_pdf(pdf_path):
    print(f"[DEBUG] → extracting from: {pdf_path}", flush=True)
    base       = os.path.splitext(os.path.basename(pdf_path))[0]
    txt_path   = os.path.join(TEXT_DIR, f"{base}.txt")
    json_path  = os.path.join(TEXT_DIR, f"{base}.json")
    img_folder = os.path.join(DIAGRAMS_ROOT, base)

    extract_text_and_images(pdf_path, txt_path, img_folder)

def main():
    print(f"[DEBUG] main() start; PDF_DIR={PDF_DIR}", flush=True)
    try:
        entries = os.listdir(PDF_DIR)
    except Exception as e:
        print(f"[ERROR] cannot list PDF_DIR: {e}", flush=True)
        return

    #print no. of entries to make sure im not going insane
    print(f"[DEBUG] Found {len(entries)} entries in PDF_DIR:", entries, flush=True)
    for fname in entries:
        print(f"[DEBUG] Inspecting: {fname}", flush=True)
        if fname.lower().endswith(".pdf"):
            full_path = os.path.join(PDF_DIR, fname)
            print(f"[DEBUG] Will process PDF: {full_path}", flush=True)
            process_pdf(full_path)
        else:
            print(f"[DEBUG] Skipping non-PDF: {fname}", flush=True)

if __name__ == "__main__":
    main()
