# Install pymongo if not already installed
# pip install pymongo

# This script uploads question data to a MongoDB database.
# It assumes that the question data is in a dictionary format or a list of dictionaries.

from pymongo import MongoClient
import os

# Change to URL of desired server "mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority" or get URL from the .env.local file 
# Currently set to my personal MongoDB Atlas cluster

MONGO_URL = os.environ.get("MONGO_URL")
if not MONGO_URL:
    raise ValueError("MONGO_URL not set. Check your .env file.")
client = MongoClient(MONGO_URL)
db = client["DAILYSAT"]
collection = db["practicetestquestions"]

def upload_to_mongo(question_data):
    if isinstance(question_data, list):
        collection.insert_many(question_data)
    else:
        collection.insert_one(question_data)
