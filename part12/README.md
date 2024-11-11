# Part 12

In this part, we will learn how to package code into standard units of software called containers. These containers can help us develop software faster and easier than before. Along the way, we will also explore a completely new viewpoint for web development, outside of the now-familiar Node.js backend and React frontend.

We will utilize containers to create immutable execution environments for our Node.js and React projects. Containers also make it easy to include multiple services with our projects. With their flexibility, we will explore and experiment with many different and popular tools by utilizing containers.

## Containers

Containers provide a consistent environmetn to execute code in. This reduces "works on my machine" issues. Containers are running instances of an image, and an image is an immutable package of code and dependencies. Containers use the system's OS so they are more lightweight than using a Virtual Machine to achieve the same goal.

## Docker

Docker provides many tools to work with containers including the Docker Client where we can interface with containers through the terminal, the Docker Daemon which manages running containers in the background, and Docker Compose which can be used to manage the initilizaiton of many containers.

## Scripts

We can bundle a sequence of bash commands into scripts using the _script_ command before we start executing, and an _exit_ command when we are done. This will create a script containing the entire history of commands executed between the starting and ending events.
