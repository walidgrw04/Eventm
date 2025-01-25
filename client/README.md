# Event Management System

## How to Run the Project

### Prerequisites
- **Node.js** (v20.10.0 LTS or higher)
- **npm** (or **Yarn**)

### Steps to Run the Project

Install Express and Sqlite using npm
npm install express
npm install sqlite3

Install API Dependencies: Navigate to the API folder and install dependencies:

cd API
npm install

Start the API Server: Run the API server:

node server.js

Install Client Dependencies: Navigate to the client folder and install dependencies:

cd ../client
npm install

Start the Client Application: Launch the client application:

npm start

Access the Application: Open your browser and go to http://localhost:3000 to interact with the application.

API Endpoints
GET /events: Retrieve all events.
POST /events: Create a new event.
PUT /events/:id: Update an existing event.
DELETE /events/:id: Delete an event by ID.

Ensure apidoc is installed: 

npm install --save-dev apidoc

To generate the documentation using apidoc, run the command

npm run docs

Documentation will be published to cet252/API/apidoc/index.html 

Run the testcafe by :

testcafe chromium api-tests.js for API
testcafe chromium client-tests.js for client



