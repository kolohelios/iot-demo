# IoT Demo Services

## Running

From the root project folder, execute `docker-compose build` and then `docker-compose run`. Add a `-d` switch if you want to run in daemon (background) mode.

## Differences between development and production environments

### Ports

Development will open more ports to the Docker host while production will keep them closed. Both environments should generally expose the same ports to peer services.

### Application builds

Production builds should be minified and uglified; development builds should not and PM2 should also watch for changes and restart accordingly.

## Stack

* Docker/Docker Compose
* MongoDB
* Parse Server
* MQTT
* PM2 with NodeJS microservices
