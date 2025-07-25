## 📝 Handling Submitting of SAT Questions

This flow visually shows the logic that was implemented for submitting a math or English question for checking its correctness + earning DailySAT Coins. The code associated to this workflow is available on `/src/app/api/practice/route.ts`

```mermaid 
flowchart TD
  RequestReceived[Submit Question Answer to API POST]
  ParseRequest[Parse JSON Request Body]
  ValidateTokenProvided{"JWT Token Provided?"}
  TokenMissing["Respond with 400 Error: "JWT token was not specified""]
  ConnectDatabase["Establish MongoDB Connection"]

  VerifyToken[Verify JWT Token]
  TokenValid{"Is JWT Valid?"}
  TokenInvalid["Respond with JWT Error (401/500)"]
  
  ExtractJWTData[Extract id, attempts, type, and answer from JWT]
  ValidateJWTData{"Are All Required JWT Params Present?"}
  MissingJWTData["Throw Error: All params in JWT not found"]
  
  RetrieveUserSession["Retrieve User Session via auth()"]
  ExtractUserEmail[Extract User Email from Session]
  
  ConnectDatabase[Connect to MongoDB]
  SelectDatabase[Select 'DailySAT' Database]
  AccessUserCollection[Access 'users' Collection]
  
  DetermineQuestionSource[Determine Question Collection Based on type]
  SelectQuestionCollection["Select Questions Collection (default: reading)"]
  
  FetchQuestion[Find Question by _id in Questions Collection]
  QuestionExists{"Question Found?"}
  MissingQuestion["Throw Error: No questions found"]
  
  EvaluateUserAnswer[Compare Provided Answer with Correct Answer]
  DetermineCorrectness[Determine if Answer is Correct]
  
  UpdateUserRecord[Update User Record in 'users' Collection:<br>- Increase currency if answer is correct and no attempts<br>- Increment correct or wrong answers]
  
  DisconnectDatabase["Close MongoDB Connection"]
  SendSuccessResponse["Return Success Response { result: 'DONE', isCorrect }"]
  
  %% Flow Connections
  RequestReceived --> ParseRequest
  ParseRequest --> ValidateTokenProvided
  ValidateTokenProvided -- No --> TokenMissing
  ValidateTokenProvided -- Yes --> VerifyToken
  
  VerifyToken --> TokenValid
  TokenValid -- No --> TokenInvalid
  TokenValid -- Yes --> ExtractJWTData
  
  ExtractJWTData --> ValidateJWTData
  ValidateJWTData -- Missing --> MissingJWTData
  ValidateJWTData -- Valid --> RetrieveUserSession
  
  RetrieveUserSession --> ExtractUserEmail
  ExtractUserEmail --> ConnectDatabase
  ConnectDatabase --> SelectDatabase
  SelectDatabase --> AccessUserCollection
  
  AccessUserCollection --> DetermineQuestionSource
  DetermineQuestionSource --> SelectQuestionCollection
  SelectQuestionCollection --> FetchQuestion
  
  FetchQuestion --> QuestionExists
  QuestionExists -- No --> MissingQuestion
  QuestionExists -- Yes --> EvaluateUserAnswer
  
  EvaluateUserAnswer --> DetermineCorrectness
  DetermineCorrectness --> UpdateUserRecord
  UpdateUserRecord --> DisconnectDatabase
  DisconnectDatabase --> SendSuccessResponse
  
  %% Error Catching (All errors funnel to a common handler)
  MissingJWTData ---|Error| DisconnectDatabase
  MissingQuestion ---|Error| DisconnectDatabase
  TokenInvalid ---|Error| DisconnectDatabase


```