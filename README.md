# Users-api demo app
Demo project for users, create/retrieve/update/delete operations. Also, list users with pagination. 
Unit and integration tests included.

**1. Problem to solve:**

Web Development API Task
Your task is to create an API to manage a user persistence layer.

We would expect this task to take a few hours, however there is no strict time limit and you won't be judged on how long it took you to complete. Please find a few pointers below:

Your solution must expose a user model and it's reasonable to expect that an individual user would have the following attributes:

id - A unique user id
email - A users email address
forename - A users first name
surname - A users last name
created - The date and time the user was added

It must have the ability to persist user information for at least the lifetime of the test.

You API must expose functionality to create, read, update and delete (CRUD) models.

Although the main outcomes of the task are listed above, if you feel like you want to go that extra mile and show us what you're capable of, here is a list of potential enhancements that we have come up with:

How your API is to be consumed (a custom interface or something like Google Chrome's "Postman" or Swagger).
Use of an industry standard data exchange format.
Sanitization checks of inputs.
Implementation of test coverage.

Alternatively if you can think of any other features that you feel would further enhance your API, then we'd love to see what you can come up with!

**2. Solving the problem:**

I have build a web app (REST API).  
It can be reached by following the URL: http://localhost:8001  
The app was built in node.js, using express web framework.  

The app has no relational/non-relational database. The storage consists of a file.  
The solution comes with corresponding unit and integration (api) tests.  

**3. App structure**

The app was structured (organized):  
/  
/app_api (represents the API)  
/app_client (client application - angular/react/vue)  
/app_server (server application - currently it just serves the index page)  
/test (folder containing unit and integration tests)  
/public (folder for static content and assets.).  
/bin/www.js (entry-point)  
app.js (express application)  
package.json (specifies app meta-data and dependencies)  

app_api, app_cliet, app_server are all organized to contain separate folders for different components  
of the application: controllers, routes, views, models, etc  

**4. Endpoints**

GET host:8001 / (index page)
GET host:8001 /api/users (retrieve users list)  
GET host:8001 /api/users?offset=0&limit=5 (retrieve users. Supports pagination params)  
POST host:8001 /api/users (add new user). Required body fields: 'email', 'forename'. Optional fields: 'surname'.  
GET host:8001 /api/users/:userId (retrieve user)  
PUT host:8001 /api/users/:userId (modify user)  
DELETE host:8001 /api/users/:userId (delete user)  

**5.Deployment instructions**

Clone github repository or download zip file.  
"cd" into the folder and run "npm install" to install the app's dependencies.

After the dependencies are installed:  
"npm start" for running the app.  
"npm test" for running the tests.  

While the app is running, you can hit the endpoints with a client (e.g. Postman)  