## LLTS Time Series Assignment
First working version of the LucidLink Time Series assignment

### 1. Build and run
    1.1 Build using `docker-compose build`
    1.2 Start using `docker-compose up`
    1.3 Run Database Init Script: `cd scripts`, `npm i`, `npm run create_db`
### 2. Known Issues:
    P0 Not ready at all

    P0 Configuration is incomplete:
        Client:
            Uses .env in development
            Uses client/Dockerfile defined variables otherwise

        Server env config:
            Uses .env in development
            Uses docker-compose.yml defined variables otherwise

        Scripts:
            Still hardcoded

    P0 Basic sanity checks of the code are incomplete
        Experimental code everywhere needs to be refactored

    P0 Express error handling is missing
  
    P0 Types are defined in both client and server and are defined extremely messily

    P0 README is incomplete

    P0 No tests

    P1: OpenAPI / Swagger?

    P1 BUG: Periods with equal delta but shorter and later in time should be selected - add getTimeDelta() to MeasuredTimePeriod

    P2: Automatic DB load.
        Database init script can be automatically executed on docker compose up, provided the correct bundling is used.
        https://github.com/docker-library/docs/blob/master/influxdb/README.md#custom-initialization-scripts
### 3. Description
    The project consists of:
    - React client app running on port 80
    - Express server running on port 8080
    - InfluxDB database running on port 8086
### 4. Local dev env with hot reload of server and client
    5.1 Client
        `cd client`, `npm i`, `npm run dev`

    5.2 Server
        `cd server`, `npm i`, `npm run dev`

    5.3 InfluxDB
        `docker-compose up ts_influxdb`

    5.3 Create Database Script
        `cd scripts`, `npm i`, `npm run create_db`
### 6. Client
### 7. Server
### 8. Create Database Script    
    The script populates the static data from 2022-10-13 to 2023-02-09 (120 days).
    The data is generated as what we imagine real-word market data would look with some hardcoded soft-cap limits. Namely a soft_min at 80$ per share and soft_max at 140$. The LLNK price generated will very rarely fluctuate outside those values to make analysis easier. The market works to keep the price in reasonable limits.
    Expected running time to generate the data is approx. 30 seconds.

    The influxDB client can be used to browse the generated data at http://localhost:8086/
### 9. Implementation Assumptions
    It is possible to run over the full period 120 days, however it takes quite a bit of time currently:
    - approx. 60 seconds to fetch all turning points from InfluxDB into memory. These would typically be around 400 000.
    - approx. 3-4 minutes to find the best buy period.

    We assume we cannot buy fractions of a stock.
    Best-buy period is currently calculated "in vacuum". We don't take into account how much money the user has to spend and we don't currently pass the amount to the back end at all. 
### 10. Toolchain
    This is the 5th pipeline iteration
    - Decided against using yarn although it has advantages over npm. There are multiple concepts in yarn I don't fully understand yet like Zero-Installs & Plug'n'Play as well as yarn's caching mechanism and how they all relate to docker builds.
    - Uses webpack for packaging and hot-reload (With html-webpack-plugin for the FE and webpack-node-externals)
    - Uses TypeScript in both front-end and back-end (FE uses babel-loader, while BE uses ts-loader)
    - Uses React in the front-end and Express in the back-end
    - Uses nginx to serve the client content
    // TODO and FIXME's
    //FIXME: Check for build & webpack warnings
    //FIXME: Typescript - check options in both tsconfig.json's
    //FIXME: ESLINT and PRETTIER in FE - WHAT TO USE IN BE?
    //FIXME: Double-check .dockerignore in both client and server
    //FIXME: Double-check all docker paths and COPY wildcards etc.
    //FIXME: Check how to package and serve CSS & static resources "for prod"
    //TODO: Docker image names
    //TODO: Add docker image vulnerability checks
    //FIXME: Check influxdb:latest being used