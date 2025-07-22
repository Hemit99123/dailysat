## 📝 Handling Submitting of SAT Questions

This flow visually shows the logic that was implemented for submitting a math or English question for checking its correctness + earning DailySAT Coins. The code associated to this workflow is available on `/src/app/api/practice/route.ts`

```mermaid 
flowchart TD
  RequestReceived[Submit Question Answer to API POST]
  ParseRequest[Encrypt JSON body with a Server Action]
  ValidateTokenProvided{"Is encrypted payload provided?"}
  TokenMissing["Respond with 400 Error: \"Body not provided\""]
  ConnectDatabase["Establish MongoDB Connection"]

  DecryptPayload[Decrypt encryption with shared key]
  PayloadValid{"Is it valid?"}
  PayloadInvalid["Respond with Decryption Error (400/500)"]

  ExtractBodyData[Extract id, attempts, type, and answer from decrypted body]
  ValidateBodyData{"Are all required fields present in body?"}
  MissingBodyData["Throw Error: All required fields not found in body"]

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
  ValidateTokenProvided -- Yes --> DecryptPayload

  DecryptPayload --> PayloadValid
  PayloadValid -- No --> PayloadInvalid
  PayloadValid -- Yes --> ExtractBodyData

  ExtractBodyData --> ValidateBodyData
  ValidateBodyData -- Missing --> MissingBodyData
  ValidateBodyData -- Valid --> RetrieveUserSession

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
  MissingBodyData ---|Error| DisconnectDatabase
  MissingQuestion ---|Error| DisconnectDatabase
  PayloadInvalid ---|Error| DisconnectDatabase
```