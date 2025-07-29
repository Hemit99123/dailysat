# SAT Practice Tests Backend

This backend processes SAT PDFs into structured JSON for ingestion into MongoDB.

## Features
- Text & diagram extraction from PDFs
- PDF link scraping from CollegeBoard
- JSON formatting and DB upload

## Setup

1. Clone the repo.
2. Create a `.env` file (based on `.env.example`)
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
