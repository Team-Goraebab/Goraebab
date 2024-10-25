# Goraebab

## Table of Contents
[Introduce](#-Introduce)

[How to run Goraebab](#-How-to-run-Goraebab)

[How to use Goraebab](#-How-to-use-Goraebab)

[API documentation](#-API-documentation)

[Architecture](#-Architecture)

[How to contribute](#-How-to-contribute)

[Upcoming features](#-Upcoming-features)


# Introduce

## Problem


## Solution

Goraebab is an open source that visualizes the entire docker structure and builds it without docker CLI commands using a simple UI.



# How to run Goraebab

**Note**: The `develop` or `master` branch  may be in an *unstable or even broken state* during development. Please use `release-*`  in order to get a stable versions.

## 1. Requirements

1. Install Docker and Docker-compose.

2. Run docker daemon for external access. This tool uses HTTP communication between Dockers, so please note that **it does not guarantee security.**

    - Windows

      ![dfdf.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/05b0d37a-666a-49e3-962a-9dcee8904ca3/b13c1fa4-63eb-48b2-9f8f-cb300899ffd4/acea4c2d-5ba6-4f14-a2ab-6367cdba41ae.png)

    - Linux

      https://docs.docker.com/engine/daemon/remote-access/


    ```bash
    sudo systemctl edit docker.service
    
    [Service]
    ExecStart=
    ExecStart=/usr/bin/dockerd -H fd:// -H tcp://0.0.0.0:2375
    ```


## 2. Setup

```bash
// Check if port 2387, DBMS DEAFULT port is available

git clone 고래밥링크

chmod +x start.sh
./start.sh {DBMS name}  # Mac or Linux

or

./start.bat {DBMS name} # Windows

```

# How to use Goraebab

## Create network

## Create volume

## Pull image

## Run container

## Connect Remote Docker

## Draw blueprint

## Load & Save blueprint

# API documentation

You can check the API specification through `localhost:2387/swagger`.

# Architecture

## Tech

# How to contribute

# Upcoming features

- More intuitive, beginner-friendly UI
- Flexible option settings (ex. port)
-
