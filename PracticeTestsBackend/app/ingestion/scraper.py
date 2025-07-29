# Install selenium and webdriver-manager if not already installed
# pip install selenium webdriver-manager

# This script scrapes PDF links from the College Board SAT practice tests page
# and saves them to a JSON file.

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import time
import json

options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

driver.get("https://satsuite.collegeboard.org/sat/practice-preparation/practice-tests")

time.sleep(5)

links = driver.find_elements(By.TAG_NAME, "a")
pdf_links = [link.get_attribute("href") for link in links if link.get_attribute("href") and "pdf" in link.get_attribute("href")]


with open("pdf_links.json", "w") as f:
    json.dump(pdf_links, f, indent=2)

driver.quit()
