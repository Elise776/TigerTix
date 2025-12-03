### Project Overview
Using TigerTix, students and faculty can book event tickets to Clemson University
Events through either manually buying the tickets or using our LLM agent to find and purchase tickets for them!

### Tech Stack
- **Frontend:** React.js  
- **Backend:** Express.js  
- **Database:** SQLite  
- **LLM API:** Grok LLM for chatbot functionality  
- **Testing:** Jest for unit tests, Playwright for end-to-end tests 

### Architecture Summary (microservices + data flow)
- **Client Microservice:** Handles frontend React app interactions with users.  
- **Admin Microservice:** Manages event creation, ticket inventory, and administrative controls.  
- **LLM Microservice:** Interfaces with the Grok API to handle natural language queries and automate ticket purchasing.  
- **User Authentication Microservice:** Handles registration, login, logout, and JWT-based session management.  


### Installation & Setup Instructions
git clone https://github.com/your-username/TigerTix.git

cd TigerTix

cd frontend -> npm install -> npm start

cd backend -> npm install-> npm start

cd backend -> client-service -> npm start

cd backend -> admin-service -> npm start

cd backend -> llm-driven-booking -> npm start




### Environment Variables Setup
Create a `.env` file in the `backend/user-authentication` folder with the following variables:
JWT_SECRET=your_secret_key_here
PORT=5000
This is done so that we can use the JWT web tokens for user authentication.

### How to run regression tests
npx jest tests/register.spec.js
npx playwright test tests/bookTooMany.spec.js


### Team Members, instructor, TAs, and roles
Elise James - SCRUM Master
Tristin Franklin - Product Owner
Julian Brinkley - Instructor
Colt Doster - TA
Atik Enam - TA

### License 
MIT License
