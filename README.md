# Goraebab

## Table of Contents
[Introduce](#-introduce)

[Architecture](#-architecture)

[How to run Goraebab](#-how-to-run-goraebab)

[How to use Goraebab](#-how-to-use-goraebab)

[API documentation](#-api-documentation)

[How to contribute](#-how-to-contribute)

[Upcoming features](#-upcoming-features)

[Contributors](#-contributors)


# Introduce

## Problem
With the advancement of AI, the barriers to software development have significantly lowered. As a result, beginner developers can save considerable time in the implementation phase, and most projects now reach the deployment stage. In the deployment process, Docker has become an almost essential tool. However, for novice developers, managing containers, networks, and volumes through the Docker CLI can be quite challenging. In a survey conducted among developers, ??% of respondents expressed difficulties and frustrations related to the complexity of managing containers, networks, and volumes.

[차트 이미지]

## Solution

Goraebab addresses this issue by enabling users to design Docker configurations visually in a GUI environment. Instead of manually managing containers, networks, and volumes through the CLI, developers can create, modify, and deploy entire Docker architectures through an intuitive, drag-and-drop interface. In addition, Goraebab provides educational tips and explanations about Docker, allowing beginners to learn while they develop. This approach simplifies complex configurations, reduces errors, speeds up the deployment process, and helps novice developers gain confidence with Docker concepts.


# Architecture

## Tech



# How to run Goraebab

**Note**: The `develop` or `main` branch  may be in an *unstable or even broken state* during development. Please use `release-*`  in order to get a stable versions.



## 1. Requirements

### Hardware

OS
- Window 10 or higher
- macOS 14(Sonoma) or higher
- Linux ubnutu 20.04 or higher

Recommended Resources
- CPU - ? cores, ? threads
- RAM - 16 GB
- Monitor resolution - ? x ?


### Software

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


## 3. Execution

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

# How to contribute

# Upcoming features

- More intuitive, beginner-friendly UI
- Flexible option settings (ex. port)
-

# Contributors
