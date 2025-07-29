# Security System for Email Reminder CRON service

This system ensures that only authorized clients can request the API which sends out emails to users. This diagram showcases the multiple software components at work.

```mermaid
graph TD
  subgraph CRON_Server["CRON Server - Node.js Script"]
    A1["Generate JWT Token<br>(with shared secret)<br>(short-lived)"]
    A2["Prepare Email Payload"]
    A3["Send POST Request<br>(to Next.js API<br>with Authorization: Bearer <JWT>)"]
  end

  subgraph API_Server["Next.js API Server"]
    B1["Receive API Request"]
    B2["Extract & Verify JWT Token<br>(with shared secret)"]
    B3{"Is JWT Valid?"}
    B4["Validate Email Payload"]
    B5["Send Email via Provider"]
    B6["Return Success Response"]
    B7["Return 401 Unauthorized"]
  end

  subgraph Email_Service["Email Provider (SMTP, SES, etc.)"]
    C1["Process Email Sending"]
    C2["Send Confirmation Response"]
  end

  A1 --> A3
  A2 --> A3

  A3 --> B1
  B1 --> B2
  B2 --> B3
  B3 -- Yes --> B4
  B3 -- No --> B7
  B4 --> B5
  B5 --> C1
  C1 --> C2
  C2 --> B6
  B6 --> A3
