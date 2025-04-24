<!-- markdownlint-disable first-line-h1 -->
<!-- markdownlint-disable html -->
<!-- markdownlint-disable no-duplicate-header -->

<div align="center">
  <img src="/public/logo/dailysat.png" width="20%" alt="DailySAT" />
</div>
<hr>
<div align="center" style="line-height: 1;">
  <a href="https://dailysat.org/"><img alt="Demo"
    src="https://img.shields.io/badge/🚀%20Live%20Demo-DailySAT-2F80ED?color=2F80ED&logoColor=white"/></a>
  <a href="https://twitter.com/dailysat"><img alt="Twitter"
    src="https://img.shields.io/badge/X@dailysat-1DA1F2?logo=x&logoColor=white"/></a>
  <br>
  <a href="LICENSE-CODE"><img alt="Code License"
    src="https://img.shields.io/badge/Code%20License-MIT%202.0-00BFFF?color=00BFFF"/></a>
  <br>
</div>

📚 To access the API documentation, [click here!](https://www.dailysat.org/api-docs)

## 🧑‍🤝‍🧑 For open-source contributions:
Our mission is to build an app that is free and accessible! This means we love input from the DailySAT community :) If you have any suggestions or feedback on our webapp, you can issue a "ticket" for our team to review. Kindly create an Issue within the issues tabs provided by the Github web app.

- ##### What if I want to help through coding?
  We do allow for open-source coding contributions! Simply create a new branch from the main and then creating a PR with an issue,     
  linking the PR with it. Our team will swiftly review it and will keep you posted on the review progess through **comments** on the 
  issue that has been assigned

  You will given given **credit** for any work that we use from you. Do remember that all work done through open-source is purely volunteer and **NOT SUBJECT TO PAYMENT** You can add   
  your contributions as experience however.

##### 📛 When naming your ticket, please use the following prefixes...
- feat: (for a feature)
- fix: (for a fix in wrongful behaviour and bugs)
- chore: (for mudane tasks such as updating documentation + refactors of code)

## 🔐 How our authentication works

Unlike the admin platform, the regular DailySAT platform's auth is handled by the AuthJS lib. It features simple Google SSO and its contents are saved onto a MongoDB collection called "users." This is then used to populate the dashboard with user information. We also employed a rate limiter to regulate the amount of DB calls. This way there is less burden on our MongoDB server. During the times when the API is restircted, we use a caching layer to populate the information

## 📊 How to create a mock database
Unfortunately, we don't let community developers get access to our official MongoDB database. However, you can easily create a mock MongoDB server on your local machine. First, install Docker and MongoDB Compass. Then, run "docker pull mongo" in your terminal (the directory doesn't matter). Next, find out your mongo url, which would likely be "mongodb://localhost:27017/". After, navigate to Google Cloud and make a project. Once you have done that, go to MongoDB Compass and make a database called SATDaily. Finally, once you have ran the docker image (from "docker pull mongo") and connected to it via Compass, run "redis-server" in the terminal (pathname is irrelevant) to start Redis (install it if not already). You should be all good to go after this.

## 💻 Technology Stack:
- **NextJS** (frontend and backend, good for SEO)
- **TailwindCSS** (styling)
- **MongoDB** (db management solution)
- **Upstash Redis** (storage solution for sessions, rate limiting and caching layer)
- **Husky** (pre-commit solution to run commands prior to a commit)
- **ESLint** (used for linting enforcement)
- **Groq** (used to power the AI study planner)
