## 🤖 AI Study Planner

Using Groq, we built an AI study planner that helps students organize their prep for the SATs.

### How it works:

We used prompt engineering to acheive this with the Groq REST API recieving the prompts we designed. The speific pattern that was employed is called structured data generation prompt. This pattern is designed to force an AI to generate well-organized and predictiable data. In our case, we made it output a JSON list. 

### Storing in user:

The plan can be saved within the user documnet in MongoDB as a nested JSON list. It will then be retrieved by `/dashboard/study-plan` for user viewing. 