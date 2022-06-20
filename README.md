# REST API

REST API created to receive [Web App](https://github.com/drclr/WebApp) client requests, access to data stored in MySQL database and send back responses to the Web App.

The REST API enables to:
- store users account into the database
- update users information  and delete users account
- store articles and comments on articles into the database
- update, delete articles and comments
- get articles and comments back from the database 

## Technologies

-  Express framework
- Sequelize ORM 
- Typescript

## Installation and usage

 
Node 14 required

Install MySQL SGBD locally, create a database with MySQL SGBD then create a .env file and fill it with database parameters as follows : port, host, user name, user password, database name and KEY_Token needed to create user token :

```bash
PORT = ...
DB_host = ... 
DB_user = ...
DB_user_pw = ...
DB_name = ... 
KEY_token = ...
```


to run the project, install it locally and launch it:
```bash
npm install
npm run start
```
## Files tree
```bash
REST API/
├─ src/
│  ├─ controllers/ -> user, article and comment middlewares called by router handlers
│  ├─ middleware/
│     ├─ auth.ts -> authentication middleware to check token validity
│     ├─ multer-config.ts -> middleware to handle user avatar
│  ├─ models/ -> definition of user, article and comment SQL tables as Sequelize models
│  ├─ routes/ -> user, article and comment router handlers
│  ├─ types/ -> custom types used accross the app
│  ├─ app.ts -> connection to the database and middlewares
│  ├─ config.ts
│  ├─ connection.ts -> Sequelize instance to connect to the MySQL database
│  ├─ server.ts -> entry point that starts the API server

```
