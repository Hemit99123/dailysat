# DailySAT Platform

Welcome to the codebase of **DailySAT**! Here you will find a quickstart to our application and some information on it ✨

### 📚 To access the API documentation, navigate to: /api-docs
NOTE: You will to have an authorized email. If you do not, kindly email `dailysatorg@gmail.com` or `hemitvpatel@gmail.com` (COO) and we can assist you from there! Afterwards, you will have 7 day (1 week) access to employee privledges


## 🧑‍🤝‍🧑 For open-source contributions:
Our mission is to build an app that is free and accessible! This means we love input from the DailySAT community :) If you have any suggestions or feedback on our webapp, you can issue a "ticket" for our team to review. Kindly create an Issue within the issues tabs provided by the Github web app.

- ##### What if I want to help through coding?
  We do allow for open-source coding contributions! Simply create a new branch from the main and then creating a PR with an issue,     
  linking the PR with it. Our team will swiftly review it and will keep you posted on the review progess through **comments** on the 
  issue that has been assigned

  You will given given **credit** for any work that we use from you. Do remember that all work done through open-source is purely   
  volunteer and **NOT SUBJECT TO PAYMENT** You can add *YOUR* contributions as experience however.

##### 📛 When naming your ticket, please use the following prefixes...
- feat: (for a feature)
- bug: (for a bug/issue with functionality)
- fix: (for a refactor of the code)
- chore: (for mudane tasks such as updating documentation)

## 👷 Maintainers:
- Hemit Patel (President/COO)
- Laksyha Jain (Chief Technology Officer)
- Aarush Kute (Founder AND Chief Executive)

## How our authentication works ##

We have 2 authentication systems. 

#### - Employees:
This system uses redis for sessions and cookies to store session id. Emails are whitelisted in the MongoDB collection "employees" Once user puts in thier whitelisted email, it is cross referenced to the db server and then an OTP is sent through nodemailer and Google STMP from dailysatorg@gmail.com account. Once user enters the OTP, they are given employee access for 4 hours until they must re-login again. 

#### - Regular users:
The other one is for regular users and is handled by the AuthJS lib. It features Google SSO and its contents are saved onto a MongoDB collection called "users." This is then used to populate the dashboard with user information. We also employed a rate limiter to regulate the amount of DB calls. This way there is less burden on our MongoDB server. During the times when the API is restircted, we use a caching layer to populate the information

## 💻 Technology Stack:
- **NextJS** (frontend and backend, good for SEO)
- **TailwindCSS** (styling)
- **MongoDB** (db management solution)
- **Redis** (storage solution for sessions)
- **Memcached** (a caching layer used to store user-data during rate limits)
