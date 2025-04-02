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
  }
}
```

## Docker Compose Configuration

### `docker-compose.yml`
```yaml
version: '3.8'

services:
  database:
    image: postgres:latest
    container_name: postgres_db
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    container_name: node_backend
    restart: always
    depends_on:
      - database
    ports:
      - "5000:5000"
    environment:
      DB_HOST: database
      DB_PORT: 5432
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - ./backend:/app
    command: ["npm", "start"]

  frontend:
    build: ./frontend
    container_name: react_frontend
    restart: always
    depends_on:
      - backend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
    command: ["npm", "start"]

volumes:
  postgres_data:
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