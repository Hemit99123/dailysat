<div align="center">
  <img src="/public/logo/dailysat.png" width="20%" alt="DailySAT" />
</div>
<hr>
<div align="center" style="line-height: 1;">
  <a href="https://dailysat.org/"><img alt="Demo"
    src="https://img.shields.io/badge/🚀%20Live%20Demo-DailySAT-2F80ED?color=2F80ED&logoColor=white"/></a>
  <a href="LICENSE-CODE"><img alt="Code License"
    src="https://img.shields.io/badge/Code%20License-MIT%202.0-00BFFF?color=00BFFF"/></a>
  <br>
</div>

<br>
📚 To access the API documentation, <a href="https://www.dailysat.org/api-docs">click here!</a>
<br>

## 🧑‍🤝‍🧑 Open Source Contributions

Our mission is to build a platform that’s free and accessible to everyone — and that means we value input from the DailySAT community! If you have suggestions or feedback about the web app, you can submit a “ticket” for our team to review by creating an **Issue** in the GitHub **Issues** tab.

### 💻 Want to contribute through code?

We welcome open-source contributions! To contribute:

1. Create a new branch from main.
2. Submit a pull request (PR) that links to a relevant issue.
3. Our team will review your PR and provide updates via comments on the linked issue.

✅ **You will receive full credit** for any work we use from your contribution.  

❌ **Please note** that open-source contributions are volunteer-based and **not subject to payment**, but you are encouraged to list your contributions on your resume or portfolio. If you need a reference for the work you complete, contact Hemit Patel on our Discord server. 

### 📛 Ticket Naming Convention

When naming your GitHub PRs, please use the following prefixes:

- `feat:` for new features  
- `fix:` for bug fixes or incorrect behavior  
- `chore:` for routine tasks like updating documentation or refactoring

When issuing Github issues, this convention is not needed but please be descriptive in your titles. 

## 🔐 Authentication Overview

Unlike the admin dashboard, the main DailySAT platform uses [Auth.js](https://authjs.dev/) for authentication, with Google SSO support. User data is stored in a MongoDB collection called `users`, which powers the dashboard.

To reduce load on our MongoDB server, we’ve implemented a rate limiter and use Redis as a caching layer when the API is restricted.

## 🧪 Setting Up a Mock Database (Local Dev)

To maintain security, community developers do not have access to our production MongoDB database. However, you can easily set up a local development environment:

1. **Install Docker** and **MongoDB Compass**.
2. In your terminal, run:

   ```bash
   docker pull mongo
   ```
3. Your local MongoDB URI will likely be:

   ```
   mongodb://localhost:27017/
   ```

4. Open **MongoDB Compass** and connect using the URI above. Create a new database named `DailySAT`.

5. Start Redis locally:

   ```bash
   redis-server
   ```

   > *Note: If Redis is not installed, install it first.*

This setup mirrors our production environment and allows you to continue developing without access to the live database.

## Get Openrouter API Key 

1. Make an account with [Openrouter](https://openrouter.ai/)
2. Hover over your profile picture (in the top right), and go to "Keys"
3. On the "Keys" page click "Create API Key"
4. Put in the name "deepseek-key" and leave Credit Limit blank
5. Paste this key into your .env file using the template in .env.example

## 🧰 Tech Stack

* **Next.js** – Frontend + backend framework (SEO-friendly)
* **TailwindCSS** – Utility-first CSS framework for styling
* **MongoDB** – Database management
* **Upstash Redis** – Session storage, rate limiting, and caching
* **Husky** – Pre-commit hook management
* **ESLint** – Code linting enforcement
* **Groq** – AI-powered study planner engine
* **Better Auth** – Simplifies authentication logic
* **CodeRabbit** – Automated PR reviews with summaries

<br>
<br>
