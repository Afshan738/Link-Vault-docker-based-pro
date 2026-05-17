# Link Vault

A secure, cloud-native MERN application for saving and organizing web links —
built with a DevOps-first architecture. The primary purpose of this project is
demonstrating a complete, production-grade Kubernetes deployment workflow where
every infrastructure component is defined as version-controlled code.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-multi--stage-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-orchestrated-326CE5?style=flat-square&logo=kubernetes)](https://kubernetes.io/)
[![Prometheus](https://img.shields.io/badge/Prometheus-metrics-E6522C?style=flat-square&logo=prometheus)](https://prometheus.io/)
[![Grafana](https://img.shields.io/badge/Grafana-dashboards-F46800?style=flat-square&logo=grafana)](https://grafana.com/)



## What is Link Vault?

Most MERN tutorials stop at `npm run dev`. Link Vault goes further — every
service runs as a Kubernetes workload, every credential lives in a Secret,
and every configuration value is decoupled from the container image.

Key engineering decisions:

- **StatefulSet for MongoDB** — stable network identity and persistent storage
  that survives pod restarts, unlike a standard Deployment
- **Secrets + ConfigMaps** — credentials never hardcoded or passed as plain
  environment variables. Kubernetes manages injection at runtime
- **Multi-stage Dockerfiles** — build tools stripped from production images,
  producing lean, minimal containers
- **Live monitoring** — Prometheus + cAdvisor expose per-container CPU, memory,
  and network metrics visualized in Grafana dashboards



## Architecture

<img width="1280" height="698" alt="image" src="https://github.com/user-attachments/assets/b789edc0-e3d6-4665-acd7-0ee9a6f6c1de" />



## Key Engineering Decisions

### Stateful vs Stateless Workload Management

The application correctly separates stateful and stateless concerns:

| Service | Controller | Why |
|---|---|---|
| React frontend | Deployment | Stateless — any pod can serve any request |
| Node.js backend | Deployment | Stateless — scales horizontally without coordination |
| MongoDB | StatefulSet | Stateful — needs stable network identity and persistent disk |

A StatefulSet gives MongoDB a predictable pod name (`mongo-0`) and a stable
DNS entry, so the backend always knows where to connect even after a pod restart.



### Secrets Management — Credential Isolation

Sensitive values are stored as Kubernetes Secrets and injected into pods as
environment variables at runtime. The application image contains no credentials.

```yaml
# kubernetes/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: link-vault-secrets
type: Opaque
stringData:
  MONGODB_URI: "mongodb://mongo-0.mongo-service:27017/linkvault"
  JWT_SECRET: "your-secret-here"
```

```yaml
# Referenced in backend deployment
env:
  - name: MONGODB_URI
    valueFrom:
      secretKeyRef:
        name: link-vault-secrets
        key: MONGODB_URI
```



### Persistent Storage — PersistentVolumeClaim

MongoDB data survives pod restarts because it is written to a PersistentVolume,
not the container's ephemeral filesystem.

```yaml
# kubernetes/mongo-pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mongo-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```



### Multi-Stage Dockerfiles — Lean Production Images

Build tools and source files are stripped from the final image. Only the
compiled output and runtime dependencies are included.

```dockerfile
# Stage 1 — build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2 — production (no build tools, no source)
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 5000
CMD ["node", "dist/index.js"]
```



## Kubernetes Manifests

All infrastructure is defined as code in the `/kubernetes` directory:

```
kubernetes/
├── secret.yaml                  # MONGODB_URI, JWT_SECRET
├── configmap.yaml               # API_URL, NODE_ENV
├── frontend-deployment.yaml     # React — Deployment, replicas: 2
├── frontend-service.yaml        # ClusterIP service
├── backend-deployment.yaml      # Node.js — Deployment, replicas: 2
├── backend-service.yaml         # ClusterIP service
├── mongo-statefulset.yaml       # MongoDB — StatefulSet
├── mongo-service.yaml           # Headless service for stable DNS
└── mongo-pvc.yaml               # PersistentVolumeClaim — 1Gi
```



## Quick Start — Kubernetes

### Prerequisites

- `kubectl` configured against a running cluster or minikube
- Docker

### 1. Clone

```bash
git clone https://github.com/Afshan738/link-vault
cd link-vault
```

### 2. Apply manifests

```bash
kubectl apply -f kubernetes/secret.yaml
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/
```

### 3. Verify pods

```bash
kubectl get pods
kubectl get pvc
```

### 4. Access the app

```bash
kubectl port-forward svc/frontend-service 3000:80
```



## Quick Start — Local Development (Docker Compose)

```bash
git clone https://github.com/Afshan738/link-vault
cd link-vault
cp .env.example .env      # add your MONGODB_URI
docker-compose up --build
```

App runs at `http://localhost:3000`



## Environment Variables

| Variable | Source | Description |
|---|---|---|
| `MONGODB_URI` | Kubernetes Secret | MongoDB connection string |
| `JWT_SECRET` | Kubernetes Secret | Token signing key |
| `API_URL` | ConfigMap | Backend API base URL |
| `NODE_ENV` | ConfigMap | `production` or `development` |



## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite |
| Backend | Node.js 20, Express.js, Mongoose |
| Database | MongoDB (StatefulSet) |
| Auth | JWT |
| Containerization | Docker, multi-stage builds |
| Orchestration | Kubernetes |
| Config management | Kubernetes Secrets + ConfigMaps |
| Storage | PersistentVolumeClaim |
| Monitoring | cAdvisor, Prometheus, Grafana |
| Local dev | Docker Compose |



## Author

**Afshan Qasim** · [GitHub](https://github.com/Afshan738) · [LinkedIn](https://www.linkedin.com/in/afshan-qasim-998917300)
