### End-to-End CI/CD Pipeline

This repository demonstrates a complete CI/CD pipeline using **Docker, Jenkins, Kubernetes (kind/minikube + AWS EKS), and Terraform**.  
The pipeline automates build, test, push, and deployment of containerized applications with zero-downtime rolling updates.

---

## Prerequisites

Before starting, ensure the following are installed and configured:

- **Docker** (latest CE version) → [Install Guide](https://docs.docker.com/get-docker/)  
- **Kubernetes Cluster**  
  - Local: [kind](https://kind.sigs.k8s.io/docs/user/quick-start/) or [minikube](https://minikube.sigs.k8s.io/docs/start/)  
  - Cloud: AWS EKS cluster (provisioned via Terraform)  
- **Jenkins** (installed on your device or VM) → [Install Guide](https://www.jenkins.io/doc/book/installing/)  
- **Terraform** (for IaC automation) → [Install Guide](https://developer.hashicorp.com/terraform/downloads)  
- **AWS CLI** (configured with IAM credentials) → [Install Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)  

---

## 🛠️ Steps to Complete the Project

### 1. Create Dockerfile
Write a multi-stage Dockerfile for your application (frontend + backend):
   ref- /client/Dockerfile
       /server/Dockerfile

### 2. Create docker-compose.yaml
    ref- /server/docker-compose.yaml
        /client/docker-compose.yaml

### 3. Add Jenkinsfile
     ref- /client/Jenkinsfile
          /server/jenkinsfile


### 4. Add Kubernetes manifest files
     ref- /client/k8s
         /server/k8s-server

### 5. Add Terraform (Iac)
     ref- /client/terraform



### 6. Configure Jenkins with Kubernetes
     Install Jenkins plugins: Git, Docker, Kubernetes.

     Add DockerHub + AWS credentials.

     Configure pipeline job → triggers on GitHub push.


### 7. Deploy Application
     Jenkins pipeline runs automatically:

    Build Docker images.

    Push to DockerHub.

    Apply Kubernetes manifests.

    Deploy to EKS cluster.


    kubectl get pods
    kubectl get svc

COPY --from=build /app/dist ./dist
CMD ["node", "dist/index.js"]
