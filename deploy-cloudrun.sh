#!/usr/bin/env bash
set -e

# ==============================================================================
# Aetheris AI — Google Cloud Run Automated Deployment Script
# Challenge: Cloud Run AI Challenge (#AccelerateAIwithCloudRun)
# Verification Tag: dev-tutorial=cloud-run-ai-challenge
# ==============================================================================

PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
REGION=${REGION:-"us-central1"}
SERVICE_NAME=${SERVICE_NAME:-"aetheris-ai"}

if [ -z "$PROJECT_ID" ]; then
  echo "❌ Error: No Google Cloud project selected. Run 'gcloud config set project YOUR_PROJECT_ID'"
  exit 1
fi

echo "🚀 Deploying Aetheris AI to Google Cloud Run..."
echo "📍 Project: $PROJECT_ID | Region: $REGION | Service: $SERVICE_NAME"

# 1. Enable necessary GCP APIs
echo "🔧 Enabling Google Cloud APIs (Cloud Run, Secret Manager, Cloud Build, Firestore)..."
gcloud services enable \
  run.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com \
  firestore.googleapis.com \
  aiplatform.googleapis.com

# 2. Check or Create GEMINI_API_KEY Secret
if ! gcloud secrets describe GEMINI_API_KEY &>/dev/null; then
  echo "🔑 Creating Secret Manager entry for GEMINI_API_KEY..."
  gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"
  echo "⚠️ Note: Please add your Gemini API key via:"
  echo "   echo -n 'YOUR_API_KEY' | gcloud secrets versions add GEMINI_API_KEY --data-file=-"
fi

# 3. Grant Service Account Secret Accessor IAM Role
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

echo "🛡️ Granting Secret Accessor role to runtime service account: $SERVICE_ACCOUNT"
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor" \
  --quiet || true

# 4. Deploy containerized service to Cloud Run with mandatory Challenge verification label
echo "📦 Building container and deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --source . \
  --region "$REGION" \
  --allow-unauthenticated \
  --set-env-vars="GOOGLE_CLOUD_PROJECT=$PROJECT_ID,CLOUD_RUN_REGION=$REGION" \
  --update-labels="dev-tutorial=cloud-run-ai-challenge"

# 5. Output Public Service URL
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --format="value(status.url)")

echo "=============================================================================="
echo "🎉 DEPLOYMENT COMPLETE!"
echo "🌐 Public Cloud Run URL: $SERVICE_URL"
echo "🏷️ Verification Tag Applied: dev-tutorial=cloud-run-ai-challenge"
echo "=============================================================================="
