# Owen Milliner Games API!

## Website URL.

https://owen-games-api.herokuapp.com/

## Overview

This project has been completed in accordance to the challenge [Northcoders](https://northcoders.com/) constructed. Primarily, the role of the project is to provide an application programming interface (API) for a database related to games.

The database is in PSQL, and interactions with it utilise [node-postgres](https://node-postgres.com/).

## Instructions

### 1. Clone the github repository.

To create your own version of this project, enter the following command into your terminal.

`git clone https://git.heroku.com/nc-games-mg2.git`

### 2. Install the required project dependencies.

This project uses a number of different dependencies in order to function correctly. The 'standard' dependency list is essential, and the 'testing' dependency list is optional.

Standard dependencies to for install:

- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](https://www.npmjs.com/package/express)
- [pg](https://www.npmjs.com/package/pg)
- [pg-format](https://www.npmjs.com/search?q=pg-format)

`npm install dotenv express pg pg-format`

Dependencies for testing purposes:

- [jest](https://www.npmjs.com/package/jest)
- [jest-sorted](https://www.npmjs.com/package/jest-sorted)
- [supertest](https://www.npmjs.com/package/supertest)

`npm install jest jest-sorted supertest -D`

### 3. Seed the database.

To setup the databases, an initial setup script should be run. Within your terminal, run the command:

`npm run setup-dbs`

### 4. Creation of .env files.

You will need to create _two_ `.env` files for your project: `.env.test` and `.env.development`. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names). Double check that these `.env` files are .gitignored.

### 5. (Optional) Testing.

If you would like to make use of the pre-built tests within the project, ensure the correct dependencies are installed, and run the command:

`npm test`

### Additional Information.

- Note that Node.js needs to be at least version 16.11.1
- Note that Postgres needs to be at least version 14.0
