# OneData DevOps Assessment — Task 1: GitHub Actions CI/CD

![CI/CD Pipeline](https://github.com/Venkat-6512/onedata-devops-assessment/actions/workflows/ci-cd.yml/badge.svg)

A production-grade Node.js REST API with a fully automated GitHub Actions CI/CD pipeline that builds, tests, and deploys to a Kubernetes cluster.

---

## 📋 Task Requirements Checklist

- [x] Node.js REST API with 5+ unit tests
- [x] GitHub Actions workflow: Lint → Unit Test → Docker Build → Push to GHCR → Deploy
- [x] Deploy uses `kubectl apply` with Deployment + Service manifests
- [x] Image tag uses Git commit SHA (never `latest`)
- [x] GitHub Environment (`staging`) with manual approval gate
- [x] Workflow badge in README
- [x] **Bonus:** Integration/smoke tests via curl
- [x] **Bonus:** Automatic rollback on deploy failure (`kubectl rollout undo`)

---

## 🏗️ Architecture

```
GitHub Push → Lint → Unit Tests → Docker Build → Push GHCR
                                                       ↓
                                          Manual Approval (staging env)
                                                       ↓
                                          kubectl apply → Minikube
                                                       ↓
                                          Integration Tests (smoke)
```

---

## 🚀 API Endpoints

| Method | Endpoint      | Description         |
|--------|--------------|---------------------|
| GET    | `/health`    | Health check        |
| GET    | `/items`     | List all items      |
| GET    | `/items/:id` | Get single item     |
| POST   | `/items`     | Create new item     |
| DELETE | `/items/:id` | Delete item         |

### Example Usage

```bash
# Health check
curl http://localhost:3000/health

# Create item
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name": "my-item"}'

# List items
curl http://localhost:3000/items
```

---

## 🐳 Docker

```bash
# Build image
docker build -t onedata-devops-api:local .

# Run container
docker run -p 3000:3000 onedata-devops-api:local

# Test health
curl http://localhost:3000/health
```

---

## ☸️ Kubernetes Deployment (Minikube/kind)

```bash
# Start Minikube
minikube start

# Apply manifests
kubectl apply -f k8s/service.yaml     # creates namespace + Service
kubectl apply -f k8s/deployment.yaml  # creates Deployment

# Check status
kubectl get pods -n staging
kubectl get services -n staging

# Access service via Minikube
minikube service onedata-api-svc -n staging --url
```

---

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Run tests
npm test

# Start server
npm start
```

---

## 🔐 GitHub Secrets Required

| Secret Name  | Description                                      |
|-------------|--------------------------------------------------|
| `KUBE_CONFIG` | Base64-encoded kubeconfig for Minikube/kind      |

To generate:
```bash
cat ~/.kube/config | base64 -w 0
```

---

## 🔄 Pipeline Jobs

| Job               | Trigger         | Description                              |
|-------------------|----------------|------------------------------------------|
| `lint`            | Every push/PR  | ESLint code quality checks               |
| `unit-test`       | After lint     | Jest tests + coverage report             |
| `docker-build`    | After tests    | Build & push to GHCR with commit SHA tag |
| `deploy`          | main branch    | Deploy to Minikube (manual approval)     |
| `integration-test`| After deploy   | Live smoke tests via curl                |

### Manual Approval Gate

The `deploy` job is gated by the **staging** GitHub Environment.  
Configure it under: `Settings → Environments → staging → Required reviewers`

---

## 📁 Repository Structure

```
.
├── .github/
│   └── workflows/
│       └── ci-cd.yml        # Main CI/CD pipeline
├── k8s/
│   ├── deployment.yaml      # Kubernetes Deployment
│   └── service.yaml         # Kubernetes Service + Namespace
├── src/
│   ├── app.js               # Express app (routes)
│   └── server.js            # Server entry point
├── tests/
│   └── app.test.js          # Jest unit tests
├── .eslintrc.json           # ESLint configuration
├── Dockerfile               # Multi-stage Docker build
├── package.json
└── README.md
```
