# 🌌 Aetheris AI — The Cognitive Second Brain & Life OS

[![Deploy to Cloud Run](https://deploy.cloud.run/button.svg)](https://deploy.cloud.run)
[![Google Cloud Run Challenge](https://img.shields.io/badge/Challenge-%23AccelerateAIwithCloudRun-4285F4?logo=google-cloud)](https://codelabs.developers.google.com/codelabs/cloud-run/cloud-run-ai-challenge)
[![Gemini 2.0 Flash](https://img.shields.io/badge/Gemini-2.0%20Flash-8E75B2?logo=google)](https://aistudio.google.com)
[![Firebase Auth & Firestore](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?logo=firebase)](https://firebase.google.com)
[![Security Hardened](https://img.shields.io/badge/Security-OWASP%20LLM%20Top%2010-emerald)](https://owasp.org)

> **Built for the Google Cloud Run AI Challenge ("Personal Gemini Journal" & Cloud Run Build & Deploy Track)**  
> *A production-ready, threat-modeled cognitive companion that transforms unfiltered streams of consciousness into executive clarity, prioritized task matrices, emotional telemetry, and interactive thought constellations.*

---

## 🏛️ Architecture & Zero-Trust Security Lifecycle

Aetheris is engineered from the ground up to prevent the common failure modes of AI prototypes (hardcoded keys, prompt injection, and cross-user data leakage).

```mermaid
graph TD
    User([User / Executive]) -->|Google Sign-In Auth Token| Client[Next.js 15 Web App]
    Client -->|1. Bearer Token + Sanitized Input| CloudRun[Google Cloud Run Container]
    
    subgraph "Google Cloud Run Zero-Trust Boundary"
        CloudRun -->|2. Verify Token & UID| FirebaseAuth[Firebase Admin SDK]
        CloudRun -->|3. Threat Defense & OWASP LLM01/02| ThreatSanitizer[Agentic Input Sanitizer]
        CloudRun -->|4. Runtime Dynamic Secret Resolution| SecretManager[Google Cloud Secret Manager]
        CloudRun -->|5. Structured Prompting with Directives| GeminiAPI[Google AI Studio: Gemini 2.0 Flash]
        CloudRun -->|6. Isolated Path Write /users/{uid}/*| Firestore[(Google Cloud Firestore)]
    end

    GeminiAPI -->|Structured JSON Output| Engine[Aetheris Cognitive Engine]
    Engine --> Out1[Executive Takeaway & Stoic Reframing]
    Engine --> Out2[Action Matrix: Eisenhower Quadrants]
    Engine --> Out3[Emotional Cadence & Burnout Telemetry]
    Engine --> Out4[2D Interactive Thought Constellation]
```

---

## ✨ Flagship Capabilities (Beyond Starter Lab)

| Feature | Description | Technical Implementation |
| :--- | :--- | :--- |
| **Stream-of-Consciousness Dictation** | Audio waveform canvas recorder + Web Speech API capture with `Cmd+Enter` trigger. | Web Audio API / Canvas + browser SpeechRecognition pipeline. |
| **Autonomous Cognitive Triaging** | AI breaks chaotic brain dumps into executive takeaways, subconscious blockers, and mental reframings. | Structured JSON schema enforcement with Gemini 3.6/2.0 Flash. |
| **Eisenhower Action Matrix** | Auto-extracts actionable tasks categorized by Urgency & Importance with one-click export to Markdown/Obsidian. | Dynamic quadrant parsing with interactive completion toggles. |
| **Burnout & Emotional Radar** | Biometric and cognitive load scoring (0-100) tracking fatigue and clarity trends over time. | Real-time sentiment & cognitive load index computation. |
| **Interactive 2D Thought Constellation** | Dynamic force-directed canvas visualizing interconnected thoughts and recurring themes across journal history. | Custom HTML5 Canvas physics engine with node clustering. |
| **Geo-Spatial Contextual Awareness** | Location-aware cognitive analysis tagging entries with physical workspaces (Google Campus, Tokyo, Singapore). | Integrated location metadata fed directly into Gemini reasoning prompts. |
| **Live Enterprise Security Inspector HUD** | Slide-over telemetry drawer allowing hackathon judges to verify active OWASP defenses and Secret Manager latency in real time. | Real-time audit API inspecting environment and IAM bindings. |
| **Multi-Turn Executive Sparring** | Interactive side-panel allowing deep-dive brainstorming directly with Gemini over any specific journal memory. | Contextual multi-turn dialogue with resilient model fallback ladder. |

---

## 🔒 Enterprise Security Directives

Aetheris implements the **5 Threat Zones** outlined in the official challenge specification:

1. **Input Surfaces (OWASP LLM01 / A03)**: Pre-execution regex and semantic sanitizer neutralizing prompt injection attempts, system instruction overrides, and delimiters.
2. **Planning & Reasoning**: Strict JSON Schema outputs preventing hallucinated or unauthorized downstream tool invocations.
3. **Secret Management (OWASP A07)**: **Zero hardcoded credentials**. The Gemini API key is dynamically resolved at runtime from **Google Cloud Secret Manager** (`GEMINI_API_KEY`) with in-memory caching.
4. **Memory & State Isolation (OWASP A01)**: Cloud Firestore paths are strictly partitioned under `/users/{userId}/*` enforced by cryptographic JWT verification and database security rules.
5. **GCP Challenge Verification**: Tagged with `--update-labels=dev-tutorial=cloud-run-ai-challenge` for automated verification by Google's evaluation crawler.

---

## 🚀 Quick Deployment Guide

### Option 1: One-Click Deploy in Google Cloud Shell (Recommended)

1. Open [Google Cloud Shell](https://shell.cloud.google.com).
2. Clone your repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/aetheris-ai.git
   cd aetheris-ai
   ```
3. Run the automated deployment script:
   ```bash
   chmod +x deploy-cloudrun.sh
   ./deploy-cloudrun.sh
   ```

### Option 2: Local Docker Container Build

```bash
docker build -t aetheris-ai .
docker run -p 8080:8080 -e GEMINI_API_KEY="your_api_key" aetheris-ai
```

### Option 3: Local Development

```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📜 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🏆 Hackathon Submission Details

- **Challenge**: Google Cloud Run AI Challenge / Ideathon
- **Hashtag**: `#AccelerateAIwithCloudRun`
- **Verification Tag**: `dev-tutorial=cloud-run-ai-challenge`
- **Tech Stack**: Google Cloud Run, Gemini 2.0 Flash (Google AI Studio), Google Cloud Secret Manager, Cloud Firestore, Firebase Auth, Next.js 15, Tailwind CSS, TypeScript.
