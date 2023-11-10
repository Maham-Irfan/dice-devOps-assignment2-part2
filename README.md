#   DevOps - Assignment 2 - Part 2

## Step 1: Displaying Hello World on the web and making a docker file:
* Git hub repository created
* Command "npx create-next-app multicontainer" used to create a next.js app
* Command "npm i" executed to install all the dependencies
* Command "npm run build" executed to build the app
* In the multicontainer folder containing the next.js project, under the /src/app directory, the page.tsx was modified to display the "Hello,World!" message
* Command "npm run dev" was executed to deploy the app on localhost
* Docker file was created in the root directory of the folder containing app
  ### File:
      FROM node  
      RUN mkdir -p /app  
      WORKDIR /app  
      COPY . .  
      RUN npm install  
      RUN npm run build  
      EXPOSE 3000  
      ENTRYPOINT ["npm", "run", "dev"]  
  
* Docker Image was built using the command "docker build -t multicontainer ."
  ### Logs:
      [+] Building 98.5s (11/11) FINISHED
      => [internal] load build definition from Dockerfile                                                               0.0s
      => => transferring dockerfile: 174B                                                                               0.0s
      => [internal] load .dockerignore                                                                                  0.0s
      => => transferring context: 2B                                                                                    0.0s
      => [internal] load metadata for docker.io/library/node:latest                                                     3.0s
      => [internal] load build context                                                                                  8.0s
      => => transferring context: 1.28MB                                                                                8.0s
      => [1/6] FROM docker.io/library/node@sha256:0052410af98158173b17a26e0e2a46a3932095ac9a0ded660439a8ffae65b1e3      0.0s
      => CACHED [2/6] RUN mkdir -p /app                                                                                 0.0s
      => CACHED [3/6] WORKDIR /app                                                                                      0.0s
      => [4/6] COPY . .                                                                                                 2.6s
      => [5/6] RUN npm install                                                                                         42.0s
      => [6/6] RUN npm run build                                                                                       37.0s
      => exporting to image                                                                                             5.6s
      => => exporting layers                                                                                            5.6s
      => => writing image sha256:579e31faf474b695cfac31b7b9751dd2198fbd867ae59411d8c57588af3b426a                       0.0s
      => => naming to docker.io/library/multicontainer

* Using command "docker run --name web multicontainer" to create and run the container
* Using Docker desktop, we can see that the container was run with the name "web"
  ### Logs:
      2023-11-10 04:51:49 > multicontainer@0.1.0 dev
      2023-11-10 04:51:49 > next dev .
      2023-11-10 04:51:49 
      2023-11-10 04:51:50    ▲ Next.js 14.0.2
      2023-11-10 04:51:50    - Local:        http://localhost:3000
      2023-11-10 04:51:50 
      2023-11-10 04:51:55  ✓ Ready in 5.3s
      2023-11-10 04:51:56  ○ Compiling / ...
      2023-11-10 04:52:06  ✓ Compiled / in 11s (472 modules)
      2023-11-10 04:52:10  ○ Compiling /favicon.ico ...

## Step 2: Create a docker file for database:
* Created a new folder named "database"
* Created the docker file with the name "Dockerfile" in this folder
  ### File:
      FROM postgres
  
* Opened the command prompt and entered in the folder "database" and executed the command "docker build -t database ." to build an Image
  ### Logs:
      [+] Building 0.9s (5/5) FINISHED
      => [internal] load build definition from Dockerfile                                                               0.0s
      => => transferring dockerfile: 50B                                                                                0.0s
      => [internal] load .dockerignore                                                                                  0.0s
      => => transferring context: 2B                                                                                    0.0s
      => [internal] load metadata for docker.io/library/postgres:latest                                                 0.0s
      => [1/1] FROM docker.io/library/postgres                                                                          0.5s
      => exporting to image                                                                                             0.1s
      => => exporting layers                                                                                            0.0s
      => => writing image sha256:5a738d7f19ce975f5624b5eb5efc9e61cfaab70ae9ac2b7868b60ab24e05adde                       0.0s
      => => naming to docker.io/library/database

* Used the command "docker run --name test-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d database" to create and run the container with the name "test-postgres"
  ### Logs:
      2023-11-10 05:04:00 The files belonging to this database system will be owned by user "postgres".
      2023-11-10 05:04:00 This user must also own the server process.
      2023-11-10 05:04:00 
      2023-11-10 05:04:00 The database cluster will be initialized with locale "en_US.utf8".
      2023-11-10 05:04:00 The default database encoding has accordingly been set to "UTF8".
      2023-11-10 05:04:00 The default text search configuration will be set to "english".
      2023-11-10 05:04:00 
      ocal/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*
      2023-11-10 05:04:03 
      2023-11-10 05:04:03 
      2023-11-10 05:04:03 PostgreSQL init process complete; ready for start up.

## Step 3: Create a docker compose file:
* Created a docker compose file that contains commands to build images, create the containers and run the images using the containers for the web and database together and linking both the services using a common network
  ### File:
      version: "3.9"  
      services:  
        web:  
          build: .  
          ports:  
            - "3000:3000"  
          depends_on:  
            - database  
          networks:  
            - my_network  
        database:  
          image: postgres  
          environment:  
            - POSTGRES_USER=test_postgres  
            - POSTGRES_PASSWORD=test_postgres  
            - POSTGRES_DB=test_postgres  
          networks:  
            - my_network  
          ports:  
            - "5432:5432"  
      networks:  
        my_network:  
          driver: bridge  
      
* Added a database url variable in the .env file containing the same name, username and password as the one specified in the docker compose file under the database
  ### File:
      DATABASE_URL = postgresql://test_postgres:test_postgres@localhost:5432/test_postgres
  
* Installed prisma in the next.js app using the command "npm i -D prisma" and "npm install @prisma/client"
* Initialized prisma using the command "npx prisma init"
* Added a database model in the schema file under the prisma folder
* Installed the tsx package to seed the database using the command "npm i tsx"
* Added the prisma key in package.json file to be able to run the seed file
* Added the seed.ts file in the prisma folder to load the database table with some initial values

## Step 4: Run docker compose up
* Executed the "docker compose up" command that uses the commands from docker-compose.yml file and the localhost:3000 displays the hello world message and the database server starts running too
  ### Logs:
    #### Web:
      2023-11-10 10:49:24 
      2023-11-10 10:49:24 > multicontainer@0.1.0 dev
      2023-11-10 10:49:24 > next dev
      2023-11-10 10:49:24 
      2023-11-10 10:49:25    ▲ Next.js 14.0.2
      2023-11-10 10:49:25    - Local:        http://localhost:3000
      2023-11-10 10:49:25 
      2023-11-10 10:49:29  ✓ Ready in 4.6s
      2023-11-10 10:49:38  ○ Compiling / ...
      2023-11-10 10:49:46  ✓ Compiled / in 8.9s (472 modules)
      2023-11-10 10:49:49  ○ Compiling /favicon.ico ...
      2023-11-10 10:49:52  ✓ Compiled /favicon.ico in 3.7s (468 modules)
    #### Database:
      2023-11-10 10:49:25 
      2023-11-10 10:49:25 PostgreSQL init process complete; ready for start up.
      2023-11-10 10:49:25 
      2023-11-10 10:49:24 initdb: warning: enabling "trust" authentication for local connections
      2023-11-10 10:49:24 initdb: hint: You can change this by editing pg_hba.conf or using the option -A, or --auth-local and --auth-host, the next time you run initdb.
      2023-11-10 10:49:25 2023-11-10 05:49:25.165 UTC [1] LOG:  starting PostgreSQL 15.2 (Debian 15.2-1.pgdg110+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6)      10.2.1 20210110, 64-bit
      2023-11-10 10:49:25 2023-11-10 05:49:25.165 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
      2023-11-10 10:49:25 2023-11-10 05:49:25.165 UTC [1] LOG:  listening on IPv6 address "::", port 5432
      2023-11-10 10:49:25 2023-11-10 05:49:25.172 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
      2023-11-10 10:49:25 2023-11-10 05:49:25.184 UTC [64] LOG:  database system was shut down at 2023-11-10 05:49:25 UTC
      2023-11-10 10:49:25 2023-11-10 05:49:25.194 UTC [1] LOG:  database system is ready to accept connections
      2023-11-10 10:54:25 2023-11-10 05:54:25.246 UTC [62] LOG:  checkpoint starting: time
      2023-11-10 10:54:29 2023-11-10 05:54:29.385 UTC [62] LOG:  checkpoint complete: wrote 44 buffers (0.3%); 0 WAL file(s) added, 0 removed, 0 recycled; write=4.124 s,         sync=0.006 s, total=4.139 s; sync files=12, longest=0.003 s, average=0.001 s; distance=252 kB, estimate=252 kB

  * Added a new database in pgAdmin and connected it with this new database server
  * Ran command "npx prisma db push" to push the schema to the database
  * Ran command "npx prisma db seed" to fill the table using the seed file

## Step 5: Adding a new feature/page
* Added API endpoint to get data from database
* Added a new page under the src/app directory in the next app that displays the data obtained from the database
* Modified the Dockerfile to add an additional command to generate a new prisma client to be able to access the data in database and added an additional environment variable in the file to display as a message in the new page
  ### File:
    FROM node  
    RUN mkdir -p /app  
    WORKDIR /app  
    COPY . .  
    RUN npm install  
    RUN npx prisma generate  
    ENV store="Stationary Shop"  
    EXPOSE 3000  
    RUN npm run build  
    ENTRYPOINT ["npm", "run", "dev"]  

* Rebilt the container using "docker compose build"
## Logs:
      => [internal] load build definition from Dockerfile                                                               0.0s
      => => transferring dockerfile: 228B                                                                               0.0s
      => [internal] load .dockerignore                                                                                  0.0s
      => => transferring context: 2B                                                                                    0.0s
      => [internal] load metadata for docker.io/library/node:latest                                                     3.2s
      => [internal] load build context                                                                                  9.1s
      => => transferring context: 55.85MB                                                                               9.0s
      => [1/7] FROM docker.io/library/node@sha256:0052410af98158173b17a26e0e2a46a3932095ac9a0ded660439a8ffae65b1e3      0.0s
      => CACHED [2/7] RUN mkdir -p /app                                                                                 0.0s
      => CACHED [3/7] WORKDIR /app                                                                                      0.0s
      => [4/7] COPY . .                                                                                                 4.6s
      => [5/7] RUN npm install                                                                                         57.3s
      => [6/7] RUN npx prisma generate                                                                                 23.2s
      => [7/7] RUN npm run build                                                                                       53.0s
      => exporting to image                                                                                             8.3s
      => => exporting layers                                                                                            8.3s
      => => writing image sha256:790838fee9903c160a8ba22e7eb44a512e79f0dd263877f4ebc15e2a15b82f4d                       0.0s
      => => naming to docker.io/library/multicontainer-web

* Ran the "docker compose up" command again
  ### Logs:
      [+] Running 2/2
      - Container multicontainer-database-1  Created                                                                    0.0s
      - Container multicontainer-web-1       Recreated                                                                  0.3s
        Attaching to multicontainer-database-1, multicontainer-web-1
        multicontainer-database-1  |
        multicontainer-database-1  | PostgreSQL Database directory appears to contain a database; Skipping initialization
        multicontainer-database-1  |
        multicontainer-database-1  | 2023-11-10 07:48:40.057 UTC [1] LOG:  starting PostgreSQL 15.2 (Debian 15.2-1.pgdg110+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian  10.2.1-6) 10.2.1 20210110, 64-bit
        multicontainer-database-1  | 2023-11-10 07:48:40.058 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
        multicontainer-database-1  | 2023-11-10 07:48:40.059 UTC [1] LOG:  listening on IPv6 address "::", port 5432
        multicontainer-database-1  | 2023-11-10 07:48:40.263 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
        multicontainer-database-1  | 2023-11-10 07:48:40.273 UTC [29] LOG:  database system was shut down at 2023-11-10 07:41:05 UTC
        multicontainer-database-1  | 2023-11-10 07:48:40.277 UTC [30] FATAL:  the database system is starting up
        multicontainer-database-1  | 2023-11-10 07:48:40.294 UTC [1] LOG:  database system is ready to accept connections
        multicontainer-web-1       |
        multicontainer-web-1       | > multicontainer@0.1.0 dev
        multicontainer-web-1       | > next dev
        multicontainer-web-1       |
        multicontainer-web-1       |    ▲ Next.js 14.0.2
        multicontainer-web-1       |    - Local:        http://localhost:3000
        multicontainer-web-1       |    - Environments: .env
        multicontainer-web-1       |
        multicontainer-web-1       |  ✓ Ready in 6.9s
        multicontainer-web-1       |  ○ Compiling / ...
        multicontainer-web-1       | (node:34) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
        multicontainer-web-1       | (Use `node --trace-deprecation ...` to show where the warning was created)
        multicontainer-web-1       |  ✓ Compiled / in 13s (472 modules)
        multicontainer-web-1       |  ○ Compiling /favicon.ico ...
        multicontainer-web-1       |  ✓ Compiled /categories in 3.3s (479 modules)
        multicontainer-web-1       |  ✓ Compiled /api/categories in 367ms (287 modules)

## Step 6: Volumes for back up of database
* Modified the Docker compose file to create the volume named "postgres_data" to store backup of database and that volume is then binded to the folder inside the image that contains the database data
  ### File:
    version: "3.9"  
    services:  
      web:  
        build: .  
        ports:  
          - "3000:3000"  
        depends_on:  
          - database  
        networks:  
          - my_network  
      database:  
        image: postgres  
        environment:  
          - POSTGRES_USER=test_postgres  
          - POSTGRES_PASSWORD=test_postgres  
          - POSTGRES_DB=test_postgres  
        networks:  
          - my_network  
        ports:  
          - "5432:5432"  
        volumes:  
          - postgres_data:/var/lib/postgresql/data  
    networks:  
      my_network:  
        driver: bridge  
    volumes:  
      postgres_data:  
        name: "db_backup"  

* Executed the command "docker compose build" to build the new changes
  ### Logs:
      [+] Building 675.7s (12/12) FINISHED
      => [internal] load build definition from Dockerfile                                                               0.0s
      => => transferring dockerfile: 32B                                                                                0.0s
      => [internal] load .dockerignore                                                                                  0.0s
      => => transferring context: 2B                                                                                    0.0s
      => [internal] load metadata for docker.io/library/node:latest                                                     2.7s
      => [internal] load build context                                                                                  6.9s
      => => transferring context: 1.32MB                                                                                6.9s
      => [1/7] FROM docker.io/library/node@sha256:0052410af98158173b17a26e0e2a46a3932095ac9a0ded660439a8ffae65b1e3      0.0s
      => CACHED [2/7] RUN mkdir -p /app                                                                                 0.0s
      => CACHED [3/7] WORKDIR /app                                                                                      0.0s
      => [4/7] COPY . .                                                                                                39.8s
      => [5/7] RUN npm install                                                                                        240.6s
      => [6/7] RUN npx prisma generate                                                                                 61.7s
      => [7/7] RUN npm run build                                                                                      320.5s
      => exporting to image                                                                                             3.4s
      => => exporting layers                                                                                            3.4s
      => => writing image sha256:1a072b0531d6cb63a282252af38074786c03d8108ad6909862efc907c6ef944a                       0.0s
      => => naming to docker.io/library/multicontainer-web

* Executed the command "docker compose up" to build the images that were changed and to run the containers
  ### Logs:
      2023-11-10 13:44:36 PostgreSQL init process complete; ready for start up.
      2023-11-10 13:44:36 
      2023-11-10 13:44:35 initdb: warning: enabling "trust" authentication for local connections
      2023-11-10 13:44:35 initdb: hint: You can change this by editing pg_hba.conf or using the option -A, or --auth-local and --auth-host, the next time you run initdb.
      2023-11-10 13:44:36 2023-11-10 08:44:36.836 UTC [1] LOG:  starting PostgreSQL 15.2 (Debian 15.2-1.pgdg110+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit
      2023-11-10 13:44:36 2023-11-10 08:44:36.836 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
      2023-11-10 13:44:36 2023-11-10 08:44:36.836 UTC [1] LOG:  listening on IPv6 address "::", port 5432
      2023-11-10 13:44:36 2023-11-10 08:44:36.842 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
      2023-11-10 13:44:36 2023-11-10 08:44:36.849 UTC [64] LOG:  database system was shut down at 2023-11-10 08:44:36 UTC
      2023-11-10 13:44:36 2023-11-10 08:44:36.853 UTC [65] FATAL:  the database system is starting up
      2023-11-10 13:44:36 2023-11-10 08:44:36.856 UTC [1] LOG:  database system is ready to accept connections

* Excecuted command "docker volume inspect db_backup" to inspect the volume that was created
  ### Logs:
      [
          {
              "CreatedAt": "2023-11-10T08:44:36Z",
              "Driver": "local",
              "Labels": {
                  "com.docker.compose.project": "multicontainer",
                  "com.docker.compose.version": "2.15.1",
                  "com.docker.compose.volume": "postgres_data"
              },
              "Mountpoint": "/var/lib/docker/volumes/db_backup/_data",
              "Name": "db_backup",
              "Options": null,
              "Scope": "local"
          }
      ]

## Step 7: Scaling
* Modified the docker compose file to include port options for the service that is to be replicated:
  ### File:
      version: "3.9"  
      services:  
        web:  
          build: .  
          ports:  
            - "3000-3004:3000"  
          depends_on:  
            - database  
          networks:  
            - my_network  
        database:  
          image: postgres  
          environment:  
            - POSTGRES_USER=test_postgres  
            - POSTGRES_PASSWORD=test_postgres  
            - POSTGRES_DB=test_postgres  
          networks:  
            - my_network  
          ports:  
            - "5432:5432"  
          volumes:  
            - postgres_data:/var/lib/postgresql/data  
      networks:  
        my_network:  
          driver: bridge  
      volumes:  
        postgres_data:  
          name: "db_backup"  


* Executed "docker compose build" to build the image again
* Executed the "docker compose up --scale web=2", which created two indentical containers to deploy the web service on ports: 3000 and 3001:
  ### Logs:
      multicontainer-database-1  | 2023-11-10 09:25:02.793 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
      multicontainer-database-1  | 2023-11-10 09:25:02.793 UTC [1] LOG:  listening on IPv6 address "::", port 5432
      multicontainer-database-1  | 2023-11-10 09:25:02.798 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
      multicontainer-database-1  | 2023-11-10 09:25:02.806 UTC [29] LOG:  database system was shut down at 2023-11-10 09:18:41 UTC
      multicontainer-database-1  | 2023-11-10 09:25:02.812 UTC [30] FATAL:  the database system is starting up
      multicontainer-database-1  | 2023-11-10 09:25:02.815 UTC [1] LOG:  database system is ready to accept connections
      multicontainer-web-2       |
      multicontainer-web-2       | > multicontainer@0.1.0 dev
      multicontainer-web-2       | > next dev
      multicontainer-web-2       |
      multicontainer-web-2       |    ▲ Next.js 14.0.2
      multicontainer-web-2       |    - Local:        http://localhost:3000
      multicontainer-web-2       |    - Environments: .env
      multicontainer-web-2       |
      multicontainer-web-1       |
      multicontainer-web-1       | > multicontainer@0.1.0 dev
      multicontainer-web-1       | > next dev
      multicontainer-web-1       |
      multicontainer-web-1       |    ▲ Next.js 14.0.2
      multicontainer-web-1       |    - Local:        http://localhost:3000
      multicontainer-web-1       |    - Environments: .env
      multicontainer-web-1       |
      multicontainer-web-2       |  ✓ Ready in 5s
      multicontainer-web-1       |  ✓ Ready in 4.5s
      multicontainer-web-2       |  ○ Compiling / ...
      multicontainer-web-2       | (node:34) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
      multicontainer-web-2       | (Use `node --trace-deprecation ...` to show where the warning was created)
      multicontainer-web-2       |  ✓ Compiled /categories in 15.6s (451 modules)
      multicontainer-web-2       |  ○ Compiling /api/categories ...
      multicontainer-web-2       |  ✓ Compiled /api/categories in 521ms (268 modules)
      multicontainer-web-2       |  ✓ Compiled (287 modules)
      multicontainer-web-1       |  ○ Compiling / ...
      multicontainer-web-1       | (node:34) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
      multicontainer-web-1       | (Use `node --trace-deprecation ...` to show where the warning was created)
      multicontainer-web-1       |  ✓ Compiled / in 9.7s (472 modules)
      multicontainer-web-1       |  ○ Compiling /favicon.ico ...
      multicontainer-web-1       |  ✓ Compiled /favicon.ico in 1538ms (468 modules 

## Step 8: Monitoring by using Prometheus
* Modified the docker Compose file to add prometheus as a service and the dependency of the web service on this to be able to monitor the logs
  ### File:
      version: "3.9"  
      services:  
        web:  
          build: .  
          ports:  
            - "3000:3000"  
          depends_on:  
            - database  
          networks:  
            - my_network  
          labels:  
            - "prometheus.enabled=true"  
          logging:  
            driver: json-file    
            options:  
              max-size: "10m"    
              max-file: "3"  
        prometheus:  
          image: prom/prometheus  
          volumes:  
            - "./prometheus.yml:/etc/prometheus/prometheus.yml"  
          networks:  
            - my_network  
          ports:  
            - 9090:9090  
        database:  
          image: postgres  
          environment:  
            - POSTGRES_USER=test_postgres  
            - POSTGRES_PASSWORD=test_postgres  
            - POSTGRES_DB=test_postgres  
          networks:  
            - my_network  
          ports:  
            - "5432:5432"  
          volumes:  
            - postgres_data:/var/lib/postgresql/data  
      networks:  
        my_network:  
          driver: bridge  
      volumes:  
        postgres_data:  
          name: "db_backup"  


*  Added the yaml file for prometheus that is used in the docker-compose file to build the image
  ### File:
    global:  
    scrape_interval: 10s  
    scrape_configs:  
    - job_name: prometheus  
    static_configs:  
      - targets:  
         - prometheus:9090  
*  Executed the command "docker compose build" to build the changes
*  Executed the command "docker compose up", which open prometheus on the specified port and web service on another port
  ### Logs:
   #### Prometheus:
    2023-11-10 15:45:31 ts=2023-11-10T10:45:31.152Z caller=main.go:1048 level=info msg="TSDB started"
    2023-11-10 15:45:31 ts=2023-11-10T10:45:31.153Z caller=main.go:1229 level=info msg="Loading configuration file" filename=/etc/prometheus/prometheus.yml
    2023-11-10 15:45:31 ts=2023-11-10T10:45:31.166Z caller=main.go:1266 level=info msg="Completed loading of configuration file" filename=/etc/prometheus/prometheus.yml     totalDuration=12.6801ms db_storage=3µs remote_storage=3.6µs web_handler=2µs query_engine=3.1µs scrape=592µs scrape_sd=116.5µs notify=2.8µs notify_sd=6.8µs rules=3.5µs tracing=10.7µs
    2023-11-10 15:45:31 ts=2023-11-10T10:45:31.166Z caller=main.go:1009 level=info msg="Server is ready to receive web requests."
    2023-11-10 15:45:31 ts=2023-11-10T10:45:31.166Z caller=manager.go:1009 level=info component="rule manager" msg="Starting rule manager..."
  #### Web: 
  2023-11-10 15:45:32 > multicontainer@0.1.0 dev
  2023-11-10 15:45:32 > next dev
  2023-11-10 15:45:32 
  2023-11-10 15:45:35    ▲ Next.js 14.0.2
  2023-11-10 15:45:35    - Local:        http://localhost:3000
  2023-11-10 15:45:35    - Environments: .env
  2023-11-10 15:45:35 
  2023-11-10 15:45:42  ✓ Ready in 7.9s
  2023-11-10 15:48:12  ○ Compiling / ...
  2023-11-10 15:48:26  ✓ Compiled / in 14.6s (472 modules)
  2023-11-10 15:48:29  ○ Compiling /favicon.ico ...
  2023-11-10 15:48:32  ✓ Compiled /favicon.ico in 3.6s (468 modules)