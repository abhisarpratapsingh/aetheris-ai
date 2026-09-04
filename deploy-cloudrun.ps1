<#
 ==============================================================================
 Aetheris AI — Google Cloud Run Automated Deployment Script (PowerShell)
 Challenge: Cloud Run AI Challenge (#AccelerateAIwithCloudRun)
 Verification Tag: dev-tutorial=cloud-run-ai-challenge
 ==============================================================================
#>

$ProjectId = (gcloud config get-value project 2>$null)
$Region = if ($env:REGION) { $env:REGION } else { "us-central1" }
$ServiceName = if ($env:SERVICE_NAME) { $env:SERVICE_NAME } else { "aetheris-ai" }

if (-not $ProjectId) {
    Write-Error "❌ Error: No Google Cloud project selected. Run 'gcloud config set project YOUR_PROJECT_ID'"
    exit 1
}

Write-Host "🚀 Deploying Aetheris AI to Google Cloud Run..." -ForegroundColor Cyan
Write-Host "📍 Project: $ProjectId | Region: $Region | Service: $ServiceName" -ForegroundColor Gray

# 1. Enable APIs
Write-Host "🔧 Enabling Google Cloud APIs..." -ForegroundColor Yellow
gcloud services enable `
  run.googleapis.com `
  secretmanager.googleapis.com `
  cloudbuild.googleapis.com `
  firestore.googleapis.com `
  aiplatform.googleapis.com

# 2. Check or Create GEMINI_API_KEY Secret
$SecretExists = (gcloud secrets describe GEMINI_API_KEY 2>$null)
if (-not $SecretExists) {
    Write-Host "🔑 Creating Secret Manager entry for GEMINI_API_KEY..." -ForegroundColor Yellow
    gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"
    Write-Host "⚠️ Remember to populate secret: 'YOUR_KEY' | gcloud secrets versions add GEMINI_API_KEY --data-file=-" -ForegroundColor Gray
}

# 3. Grant Service Account Secret Accessor IAM Role
$ProjectNumber = (gcloud projects describe $ProjectId --format='value(projectNumber)').Trim()
$ServiceAccount = "${ProjectNumber}-compute@developer.gserviceaccount.com"

Write-Host "🛡️ Granting Secret Accessor to: $ServiceAccount" -ForegroundColor Yellow
gcloud secrets add-iam-policy-binding GEMINI_API_KEY `
  --member="serviceAccount:${ServiceAccount}" `
  --role="roles/secretmanager.secretAccessor" `
  --quiet

# 4. Deploy to Cloud Run
Write-Host "📦 Building and deploying container to Cloud Run..." -ForegroundColor Cyan
gcloud run deploy $ServiceName `
  --source . `
  --region $Region `
  --allow-unauthenticated `
  --set-env-vars="GOOGLE_CLOUD_PROJECT=$ProjectId,CLOUD_RUN_REGION=$Region" `
  --update-labels="dev-tutorial=cloud-run-ai-challenge"

# 5. Output Public Service URL
$ServiceUrl = (gcloud run services describe $ServiceName --region $Region --format="value(status.url)").Trim()

Write-Host "==============================================================================" -ForegroundColor Green
Write-Host "🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "🌐 Public Cloud Run URL: $ServiceUrl" -ForegroundColor Green
Write-Host "🏷️ Verification Tag Applied: dev-tutorial=cloud-run-ai-challenge" -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Green
