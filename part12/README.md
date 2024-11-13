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

Docker compose allows developers to manage container initlization with more detailed instructions than Dockerfiles.

```bash
docker compose up -d
```

Or to run a specific file

```bash
docker compose -f docker-compose.dev.yml up -d
```

## Volumes

Volumes are locations that docker can store data on the host machine that mirrors the contents of the container.

```bash
docker volume ls
docker volume inspect
docker volume rm
```
