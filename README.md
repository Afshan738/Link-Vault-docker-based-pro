# Link Vault: A Cloud-Native MERN Application

Link Vault is a secure web application for saving and organizing important web links. While it functions as a full-stack MERN application, its primary purpose is to serve as a real-world project for implementing and demonstrating a complete, professional, cloud-native deployment workflow using Docker and Kubernetes.

This project is designed from the ground up with modern DevOps principles, treating infrastructure and configuration as version-controlled code.

## Table of Contents

- [Features](#features)
- [Technical Architecture & DevOps](#technical-architecture--devops)
- [Technology Stack](#technology-stack)
- [Kubernetes Manifests](#kubernetes-manifests)
- [Local Development](#local-development)

## Features

- **Full Stack Functionality:** A complete MERN (MongoDB, Express.js, React, Node.js) application with CRUD operations for managing links.
- **Containerized:** The entire application stack (frontend, backend, database) is fully containerized using Docker for portability and consistency.
- **Declarative Deployments:** All infrastructure components are defined as code using declarative Kubernetes YAML manifests.

## Technical Architecture & DevOps

The application is architected as a set of decoupled microservices designed to be orchestrated by Kubernetes.

### Core Principles
- **Infrastructure as Code (IaC):** All Kubernetes objects (`Deployments`, `StatefulSets`, `Services`, etc.) are defined in YAML files and stored in this repository, providing a single source of truth for the application's desired state.
- **Separation of Concerns:** Each microservice has its own dedicated Kubernetes controllers and services, allowing for independent scaling and updates.
- **Stateful vs. Stateless Management:** The application correctly distinguishes between stateless and stateful workloads:
    - **Stateless Services (Frontend/Backend):** Managed by **Kubernetes Deployments**, allowing for easy replication and rolling updates.
    - **Stateful Service (Database):** Managed by a **Kubernetes StatefulSet**, providing the stable network identity and persistent, durable storage required for a database.
- **Configuration Management:** Application configuration is decoupled from the container images.
    - **`Secrets`** are used to securely inject sensitive data like database connection strings.
    - **`ConfigMaps`** are designed to manage non-sensitive configuration like API endpoints.

## Technology Stack

### Application
- **Frontend:** React
- **Backend:** Node.js, Express.js
- [Add any other major libraries like Mongoose, etc.]

### DevOps & Infrastructure
- **Containerization:** Docker, Docker Compose
- **Orchestration:** Kubernetes
- **Key Kubernetes Objects Used:**
    - `Deployment`
    - `StatefulSet`
    - `Service` (including Headless Services)
    - `Secret` & `ConfigMap`
    - `PersistentVolumeClaim`

## Kubernetes Manifests

The `/kubernetes` directory contains a complete set of manifests for deploying the entire application stack. This includes separate, professionally structured files for each component:

- `frontend-deployment.yaml` & `frontend-service.yaml`
- `backend-deployment.yaml` & `backend-service.yaml`
- `mongo-statefulset.yaml` & `mongo-service.yaml`
- `secret.yaml`

These manifests are production-ready and can be applied to any Kubernetes cluster.

## Local Development

For quick, local development and testing, a `docker-compose.yml` file is provided.

1.  Clone this repository.
2.  Create a `.env` file with your `MONGODB_URI`.
3.  Run `docker-compose up --build`.

The application will be accessible at `http://localhost:3000`.
