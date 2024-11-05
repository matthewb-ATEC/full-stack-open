# Part 11

So you have a fresh feature ready to be shipped. What happens next? Do you upload files to a server manually? How do you manage the version of your product running in the wild? How do you make sure it works, and roll back to a safe version if it doesn’t?

Doing all the above manually is a pain and doesn’t scale well for a larger team. That’s why we have Continuous Integration / Continuous Delivery systems, in short CI/CD systems. In this part, you will gain an understanding of why you should use a CI/CD system, what can one do for you, and how to get started with GitHub Actions which is available to all GitHub users by default.

## GitHub Actions

GitHub Actions provide a cloud server to run CI/CD workflows.

## Workflows

Workflows are composed of Jobs which are composed of Steps. Jobs execute in parallel but Steps execute in order. For GitHub to recognize workflows they must be specified in _.github/workflows_ and each workflow must be its own _.yaml_ file. Example:

```yaml
name: Hello World!

on:
  push:
    branches:
      - main

jobs:
  hello_world_job:
    runs-on: ubuntu-20.04
    steps:
      - name: Say hello
        run: |
          echo "Hello World!"
```
