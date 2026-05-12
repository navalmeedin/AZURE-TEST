#!/usr/bin/env bash

set -euo pipefail

RESOURCE_GROUP="${RESOURCE_GROUP:-azure-test-rg}"
LOCATION="${LOCATION:-canadacentral}"
ENVIRONMENT="${ENVIRONMENT:-azure-test-env}"
CONTAINER_APP_NAME="${CONTAINER_APP_NAME:-azure-test-app}"

echo "Deploying ${CONTAINER_APP_NAME} to Azure Container Apps..."
echo "Resource group: ${RESOURCE_GROUP}"
echo "Location: ${LOCATION}"
echo "Environment: ${ENVIRONMENT}"

az containerapp up \
  --name "${CONTAINER_APP_NAME}" \
  --resource-group "${RESOURCE_GROUP}" \
  --location "${LOCATION}" \
  --environment "${ENVIRONMENT}" \
  --source .
