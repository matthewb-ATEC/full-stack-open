# Part 12

In this part, we will learn how to package code into standard units of software called containers. These containers can help us develop software faster and easier than before. Along the way, we will also explore a completely new viewpoint for web development, outside of the now-familiar Node.js backend and React frontend.

We will utilize containers to create immutable execution environments for our Node.js and React projects. Containers also make it easy to include multiple services with our projects. With their flexibility, we will explore and experiment with many different and popular tools by utilizing containers.

## Containers

Containers provide a consistent environmetn to execute code in. This reduces "works on my machine" issues. Containers are running instances of an image, and an image is an immutable package of code and dependencies. Containers use the system's OS so they are more lightweight than using a Virtual Machine to achieve the same goal.

Run a container with the following command:

```bash
docker contianer run <container_name>
```

Some flags include:

```bash
-it         makes the container interactable and opens a terminal interface
--rm        removes the container after exiting
--name      provide a name for the container
```

Start previously ran containers that are currently inactive with:

```bash
docker start <container_name>
```

Stop running containers with:

```bash
docker kill <container_name>
```

Remove containers with:

```bash
docker rm <container_name>
```

## Docker

Docker provides many tools to work with containers including the Docker Client where we can interface with containers through the terminal, the Docker Daemon which manages running containers in the background, and Docker Compose which can be used to manage the initilizaiton of many containers.

View the state of all containers on this machine by executing:

```bash
docker ps -a
```

## Scripts

We can bundle a sequence of bash commands into scripts using the _script_ command before we start executing, and an _exit_ command when we are done. This will create a script containing the entire history of commands executed between the starting and ending events.

## Images

You can save an existing container as an image with:

```bash
docker commit <container_name> <new_image_name>
```

Before committing a container to an image you can view the changes with the diff command:

```bash
docker diff <container_name>
```

You can view all images with:

```bash
docker image ls
```

## Dockerfile

Dockerfile is a file used to define the initialization steps of a container.

```Dockerfile
FROM node:20

WORKDIR /usr/src/app

COPY ./index.js ./index.js

CMD node index.js
```

FROM defines the image, in this case node version 20.
WORKDIR defines the directory to execute commands from, if it doesnt exist it will be created.
COPY copies the index.js file from the directory that the Dockerfile exists in into the container at the location of the working directory.
CMD overrides the default command that is executed by _docker run_. This can be overwritten again during execution by specifying another command after the name of the container:

```bash
docker run -it <image_name> <command>
```

Once the Dockerfile is complete we can build an image based on the Dockerfile:

```bash
docker build -t <image_name> .
```

The period at the end is used to specify the location to look for the Dockerfile

## Docker Compose

Docker compose allows developers to manage container initlization for mutliple services within the same docker network.
Start services in detached mode (background):

```bash
docker compose up -d
```

Run a specific file:

```bash
docker compose -f docker-compose.dev.yml up
```

Stop and remove all containers, networks, and volumes defined in the Compose file:

```bash
docker compose down
```

Display logs from all running containers:

```bash
docker compose logs
```

A docker-compose.yml file may look like this:

```yml
version: '3'
services:
  web:
    build: ./web
    ports:
      - '5000:5000'
  db:
    image: postgres:alpine
    volumes:
      - db-data:/var/lib/postgresql/data
volumes:
  db-data:
```

## Volumes

Volumes are locations that docker can store data on the host machine that mirrors the contents of the container.

```bash
docker volume ls
docker volume inspect
docker volume rm
```

In the docker-compose.yml:

```yml
volumes:
  - ./local-directory:/container-directory
```

## Exec

The exec command can be used to enter a container that is already running.

```bash
docker exec -it <container_name> bash
```

## Reverse Proxy

A type of proxy server that retrieves resources on behalf of a client from one or more servers. These resources are then returned to the client, appearing as if they originated from the reverse proxy server itself.

Options include: Traefik, Caddy, Nginx, and Apache (ordered by initial release from newer to older).

Using Nginx we create a nginx.dev.conf file with the following contents:

```conf
# events is required, but defaults are ok
events { }

# A http server, listening at port 80
http {
  server {
    listen 80;

    # Requests starting with root (/) are handled
    location / {
      # The following 3 lines are required for the hot loading to work (websocket).
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';

      # Requests are directed to url below
      proxy_pass http://app:5173;
    }

    # Requests starting with root (/api/) are handled
    location /api/ {
      # The trailing slash removes the (/api/) when passing the url to the backend, so http://localhost:8080/api/ routes to http://backend:3000/
      proxy_pass http://backend:3000/;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
    }
  }
}
```

Additionally we add a new container to our docker compose file:

```yml
services:
  app: // ...

  nginx:
    image: nginx:1.20.1
    volumes:
      - ./nginx.dev.conf:/etc/nginx/nginx.conf:ro
    ports:
      - 8080:80
    container_name: reverse-proxy
    depends_on:
      - app # wait for the frontend container to be started
```

## Docker Networks

By defualt all services created in the same docker-compose.yml file exist on the same network and can interact through their host names and exposed ports. Alternatively you can explicitly define the network in the compose file:

```yml
networks:
  my_network:
    driver: bridge
```

## Orchestration

Docker compose can be used to initialize many services each in their own container. By executing one docker-compose file at the root of a project, you can initilize services for both the front and back ends assuming they are lcoated in subdirectories. Additionally, we can initialize any other required services including databases, redis, reverse proxies, debugging tools and more. By combining all of these services into a single docker-compose, they can accesss eachother through the shared docker network, however they are not on the same local host. Each container runs on its own local host, but the host name in the url can be substituted with the name of the container to make requests within the same network across different containers. Some services may require an initialization build phase. The steps for the build phase can be stored within the directory associated with the service, and referenced in the build attribute of the service in the root docker-compose. Optionally, we can provide docker-compose files within each service to run them individually, which can be useful when testing. It is recomended to have separate files for development and production.

Recomended file structure:

```bash
app
├── frontend
|   ├── .dockerignore
|   ├── dev.Dockerfile
|   └── Dockerfile
├── backend
|   ├── .dockerignore
|   ├── dev.Dockerfile
|   └── Dockerfile
├── nginx.dev.conf
├── docker-compose.dev.yml
├── nginx.conf
└── docker-compose.yml
```

Root docker-compose.yml

```yml
services:
  frontend:
    image: app-frontend
    build:
      context: ./frontend
      dockerfile: Dockerfile
    volumes:
      - ./frontend/:/usr/src/app
    environment:
      - VITE_BACKEND_URL=http://localhost:8080/api/
    container_name: app-frontend

  backend:
    image: app-backend
    build:
      context: ./backend
      dockerfile: Dockerfile
    volumes:
      - ./backend:/usr/src/app
    container_name: app-backend

  // Other services...

  nginx:
    image: nginx:1.20.1
    volumes:
      - ./nginx.dev.conf:/etc/nginx/nginx.conf:ro
    ports:
      - 8080:80
    container_name: reverse-proxy
    depends_on:
      - app
      - backend
```

Build and run from root directory:

```bash
docker compose -f docker-compose.yml up --build
```
