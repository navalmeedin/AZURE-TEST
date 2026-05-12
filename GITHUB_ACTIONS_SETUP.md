# GitHub Actions setup for Azure Container Apps

This repository includes a workflow at `.github/workflows/main_azure-tes.yml` that builds the Docker image and deploys it to Azure Container Apps on every push to `main`.

## 1. Deploy the app once from your machine

Create the Container App at least once before using the workflow:

```bash
az login
az extension add --name containerapp --upgrade --allow-preview true

cd "/Users/navalmeedin/Documents/New project/azure-test"

export RESOURCE_GROUP="azure-test-rg"
export LOCATION="canadacentral"
export ENVIRONMENT="azure-test-env"
export CONTAINER_APP_NAME="azure-test-app"

./deploy-azure-containerapp.sh
```

## 2. Create an Azure Container Registry if you do not already have one

```bash
export ACR_NAME="azuretestacr$RANDOM"
az acr create --name "$ACR_NAME" --resource-group "$RESOURCE_GROUP" --sku Basic
```

## 3. Grant the Container App permission to pull from ACR

This uses managed identity, which is the Microsoft-recommended approach.

```bash
az containerapp identity assign \
  --name "$CONTAINER_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --system-assigned

PRINCIPAL_ID=$(az containerapp show \
  --name "$CONTAINER_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query identity.principalId \
  --output tsv)

ACR_ID=$(az acr show \
  --name "$ACR_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query id \
  --output tsv)

az role assignment create \
  --assignee-object-id "$PRINCIPAL_ID" \
  --assignee-principal-type ServicePrincipal \
  --role AcrPull \
  --scope "$ACR_ID"

az containerapp registry set \
  --name "$CONTAINER_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --server "${ACR_NAME}.azurecr.io" \
  --identity system
```

## 4. Create a GitHub OIDC service principal

Replace `YOUR_GITHUB_REPO` with `navalmeedin/AZURE-TEST`.

```bash
SUBSCRIPTION_ID=$(az account show --query id --output tsv)
TENANT_ID=$(az account show --query tenantId --output tsv)

az ad app create --display-name "github-azure-test"
APP_ID=$(az ad app list --display-name "github-azure-test" --query "[0].appId" --output tsv)

az ad sp create --id "$APP_ID"

az role assignment create \
  --assignee "$APP_ID" \
  --role Contributor \
  --scope "/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}"

az ad app federated-credential create \
  --id "$APP_ID" \
  --parameters '{
    "name": "github-main",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:navalmeedin/AZURE-TEST:ref:refs/heads/main",
    "description": "GitHub Actions access for main branch",
    "audiences": ["api://AzureADTokenExchange"]
  }'
```

## 5. Add GitHub repository secrets

Add these GitHub Actions secrets in your repository settings:

- `AZURE_CLIENT_ID`: the `APP_ID` value from the commands above
- `AZURE_TENANT_ID`: your Azure tenant ID
- `AZURE_SUBSCRIPTION_ID`: your Azure subscription ID

## 6. Add GitHub repository variables

Add these GitHub Actions variables in your repository settings:

- `AZURE_CONTAINER_APP_NAME`: your Container App name
- `AZURE_RESOURCE_GROUP`: your resource group name
- `AZURE_ACR_NAME`: your Azure Container Registry name without `.azurecr.io`

## 7. Push to main

When you push to `main`, GitHub Actions will:

- build the Docker image from `Dockerfile`
- push the image to Azure Container Registry
- deploy a new revision to Azure Container Apps
