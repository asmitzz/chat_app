# Project Setup

This project consists of a **Node.js** backend, a **React** frontend, and a **PostgreSQL** database, all managed using **Docker Compose**.

## Prerequisites

Ensure you have the following installed:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Project Structure
```
/project-root
│── client/         # Node.js application
│── server/        # React application
│── docker-compose.yml
│── .env             # Environment variables
```

## Environment Variables

Create a `.env` file in the root directory and define the required environment variables:

```env
POSTGRES_USER=chat_app
POSTGRES_PASSWORD=c8f7e6d4b9a21c3f88e1f4a6d7b5c2e0
POSTGRES_DB=chat_app
```

Create a `.env` file in the client directory and define the required environment variables:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Create a `.env` file in the server directory and define the required environment variables:

```env
PORT=8000
JWT_SECRET=your_secret_key
```

Update `config/config.json` file in the server directory and define the required variables for connecting with postgres using sequelize:

```config/config.json
{
  "development": {
    "username": "chat_app",
    "password": "c8f7e6d4b9a21c3f88e1f4a6d7b5c2e0",
    "database": "chat_app",
    "host": "postgres",
    "dialect": "postgres",
    "port": "5432"
  },
  "test": {
    "username": "chat_app",
    "password": "c8f7e6d4b9a21c3f88e1f4a6d7b5c2e0",
    "database": "chat_app_test",
    "host": "postgres",
    "dialect": "postgres",
    "port": "5432"
  }
}
```

## Running the Application

1. Clone the repository:
   ```sh
   git clone https://github.com/asmitzz/chat_app.git
   cd chat_app
   ```

2. Ensure the `.env` file is correctly set up.

3. Build and start the services:
   ```sh
   docker-compose up --build
   ```

4. Access the services:
   - Backend: http://localhost:8000
   - Frontend: http://localhost:3000
   - PostgreSQL is running internally on port 5432

5. To stop the containers:
   ```sh
   docker-compose down
   ```

6. To remove all containers, volumes, and networks:
   ```sh
   docker-compose down -v
   ```

## Notes
- Modify the `Dockerfile` in the `server/` and `client/` directories if you need custom build steps.
- Use `docker-compose logs -f` to check logs.
- If you need to access the database, use:
  ```sh
  docker exec -it postgres_db psql -U your_username -d your_database
  ```

## Running Test Cases

Follow these steps to run the test cases in your project.

### Step 1: Set Environment Variable

Ensure that the environment variable `NODE_ENV` is set to `test` in the `server/` directory.

```.env
NODE_ENV=test
```

### Step 2: Start Test Containers

Run the Docker Compose file for the test environment:

```sh
docker-compose -f docker-compose.test.yml up -d
```

This will spin up the necessary test containers.

### Step 3: Update host from postgres to localhost in `config/config.json` file in the server directory and define the required variables for connecting with postgres using sequelize:

```config/config.json
{
  "development": {
    "username": "chat_app",
    "password": "c8f7e6d4b9a21c3f88e1f4a6d7b5c2e0",
    "database": "chat_app",
    "host": "postgres",
    "dialect": "postgres",
    "port": "5432"
  },
  "test": {
    "username": "chat_app",
    "password": "c8f7e6d4b9a21c3f88e1f4a6d7b5c2e0",
    "database": "chat_app_test",
    "host": "localhost", // NOTE: Update host to localhost from postgres after #Step 2
    "dialect": "postgres",
    "port": "5432"
  }
}
```

### Step 4: Run Tests

Execute the test cases using Yarn:

```sh
yarn run test
```

### Additional Notes
- Make sure Docker is installed and running before executing the commands.
- Update `host` to `localhost` from `postgres` in the `server/` directory only after `STEP-2` is completed 
- If you need to stop the test containers after running tests, use:
  
  ```sh
  docker-compose -f docker-compose.test.yml down
  ```

- If you encounter any issues, check the logs using:
  
  ```sh
  docker-compose -f docker-compose.test.yml logs
  ```

# System Design Document

## 1. Overview

This document describes the high-level architecture, design considerations, and technologies used in this project. The application consists of:

- A **Node.js** backend (Express.js)
- A **React** frontend (Vite + React)
- A **PostgreSQL** database
- **Docker Compose** for containerized deployment

## 2. Architecture Diagram

<img width="682" alt="Screenshot 2025-04-03 at 6 11 53 PM" src="https://github.com/user-attachments/assets/8b7a9073-dd84-42e6-b510-475f6f8b1e07" />

## 3. Technologies and Frameworks  

### Backend:  
- **Node.js & Express.js** – Provides REST API endpoints.  
- **Sequelize ORM** – Manages database interactions.  
- **PostgreSQL** – Relational database for structured data storage.  
- **JWT Authentication** – Handles secure user authentication.  

### Frontend:  
- **React (Vite)** – Fast and optimized frontend framework.  

## 4. Assumptions  
- Users will interact with the system via a web browser.  
- The application will support real-time messaging between users.  
- The application requires secure authentication and authorization.  
- A relational database (PostgreSQL, MS SQL Server, or MySQL) will store user and message data.  
- Passwords will be securely hashed before storage.  
- The backend will expose RESTful APIs for user management and messaging.  
- The frontend will be developed using React.js
- The application will include basic test cases to verify functionality.
- The system will be designed with scalability, security, and maintainability in mind.  

## 5. Scalability Considerations  
### Database Scaling  
- PostgreSQL can be optimized using indexing and partitioning.  

### Backend Scaling  
- The Node.js server can be containerized and horizontally scaled with a load balancer.  

### Frontend Scaling  
- The React app can be served using a CDN for faster delivery.  

### Caching  
- Implement Redis for frequently accessed data to improve response times.  
