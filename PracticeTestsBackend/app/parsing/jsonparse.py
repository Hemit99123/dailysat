# This script parses questions from a raw text format into a structured format.
# It expects the raw text to contain questions formatted with a question number, question text, and multiple-choice answers labeled A, B, C, and D.
# The output is a list of dictionaries, each representing a question with its text, choices, and other metadata.


import re

def parse_questions(raw_text: str):
    pattern = r"""(?x)
        (?P<qnum>\d+)\s+
        (?P<question>.*?)\s+
        A\)\s+(?P<a>.*?)\s+
        B\)\s+(?P<b>.*?)\s+
        C\)\s+(?P<c>.*?)\s+
        D\)\s+(?P<d>.*?)(?=\n\d+|\Z)
    """

    matches = re.finditer(pattern, raw_text, re.DOTALL)
    questions = []

    for match in matches:
        # Watch out for words with "blank" in them (e.g. "blankets"), it'll turn into ____ets
        question_text = match.group("question").replace("blank", "____").strip()
        question = {
            "question": question_text,
            "choices": [
                match.group("a").strip(),
                match.group("b").strip(),
                match.group("c").strip(),
                match.group("d").strip(),
            ],
            "answer": None,
            "topic": "rw"
        }
        questions.append(question)

    return questions
