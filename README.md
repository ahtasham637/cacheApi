## Description
Cache api is a test created using Nestjs (Expressjs in the backbone). The api also implments swagger documentation to see the api endpoints.


## Run app
## `Clone the repo`
### `cd cacheApi`
### `npm install`

### Prerequisite
Rename the `.env.example` to `.env` and add mongodb uri.

### Description of replacing keys where there is a limit:
The limit and ttl life can be configured in `config.js` file. When there is no space for more entries, the oldest entry will be replaced with given key and data.


### `npm run start:dev`
Runs the app in development environment.

### `npm run start`
Runs the app in production environment.


Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Swagger documentation of the apis
The project also includes a swagger api documentation of all the apis and schemas
Open [http://localhost:3001/api](http://localhost:3001/api) to read documentation of the apis and to test the `endpoints`.

