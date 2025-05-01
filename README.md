# Web Scaling Demo

This repository is a demo showcasing web scaling techniques, including horizontal scaling with Docker by running multiple containers, load balancing with Nginx, request caching with Redis, and content delivery using CDNs.

## Prerequisites

Before starting, make sure you have the following installed:

- [Docker Engine](https://docs.docker.com/get-started/get-docker/)

## Getting Started

1. **Clone the repository (if you haven't already):**

   ```bash
   git clone https://github.com/abdoh-alkhateeb/web-scaling-demo.git
   cd web-scaling-demo
   ```

2. **Navigate to the root directory of the project:**
   Ensure your terminal is in the same directory as the `docker-compose.yml` file.

3. **Start the application:**
   ```bash
   docker compose up
   ```

This command will spin up all the necessary services defined in the `docker-compose.yml`, including multiple app containers, Nginx as a load balancer, and Redis for caching.

## Additional Notes

- Make sure Docker Desktop is running before executing any Docker commands.
- You can access the application in your browser at `http://localhost` (or the specified port).
- Logs will be output to your terminal. To stop the containers, press `Ctrl+C`.
