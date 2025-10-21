# Link Vault: A Full Stack MERN Application

Link Vault is a secure and structured web application designed to help users save, organize, and manage important web links. Instead of losing valuable URLs in messy chat histories or notes, Link Vault provides a clean, database-driven solution.

This project demonstrates the development of a complete, containerized, multi-tier application using the MERN stack and modern DevOps practices.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Local Development](#local-development)

## Features

- **User Authentication:** Secure user registration and login functionality.
- **CRUD for Links:** Full Create, Read, Update, and Delete capabilities for managing personal links.
- **Structured Data:** Each link is saved with a title and a descriptive note for easy organization.
- **Containerized Environment:** The entire application is containerized with Docker, ensuring a consistent and portable development environment.

## Technology Stack

### Application
- **Frontend:** React
- **Backend:** Node.js, Express.js
- **Database:** MongoDB

### DevOps
- **Containerization:** Docker, Docker Compose
- **Orchestration (Planned):** Kubernetes manifests for future cloud-native deployment are included.

## Project Structure

The project is organized into a microservice-style architecture with three main components:

- **`/frontend`**: Contains the React-based single-page application that serves as the user interface.
- **`/backend`**: Contains the Node.js/Express REST API that handles all business logic and data processing.
- **`/database`**: Configuration for the MongoDB database service.

A `docker-compose.yml` file is located at the root of the project to orchestrate these services for local development.

## Local Development

To run this application on a local machine for development:

1.  Clone this repository.
2.  Ensure you have Docker and Docker Compose installed.
3.  Create a `.env` file in the root directory with your `MONGODB_URI`.
4.  Run the command `docker-compose up --build` from the project root.

The application will be accessible at `http://localhost:3000`.
