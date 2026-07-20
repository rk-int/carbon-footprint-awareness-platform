# Carbon Footprint Awareness Platform

A professional, minimal, and emotionally resonant web application designed to help individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights powered by Google Cloud and Gemini AI.

---

## 📄 Problem Statement
Climate change awareness is high, but individual action remains low due to a lack of clear, relatable, and localized data. Existing carbon calculators are often overly technical, numbers-heavy, and dry, leading to user detachment rather than behavior change. Individuals struggle to understand how minor daily actions—such as dietary shifts, commute changes, or digital habits—translate into concrete carbon metrics and actionable reduction pathways.

## 💡 The Solution
Our platform bridges the gap between raw data and emotional engagement. It provides a minimal, distraction-free dashboard where users log basic daily habits. Instead of cold statistics, the platform transforms data into an intuitive visual story. 

Key features include:
* **Micro-Logging Tracker:** Quickly record daily transit, diet, and energy metrics.
* **Reflective UI Engine:** A front-end presentation styled with warm palettes and soft transitions to promote calm, focused reflection rather than climate anxiety.
* **Dynamic Action Roadmap:** A tailor-made reduction pathway that surfaces high-impact, low-friction habits to adopt immediately.

## 🤖 How Gen AI is Used
Gemini AI functions as a hyper-personalized behavioral scientist within the platform. Rather than using rigid static rules, the application pipes user logging data into Gemini using structured schema prompts. 
* **Insight Generation:** Gemini parses the user's weekly carbon anomalies and generates tailored behavioral nudges.
* **Semantic Analysis:** The AI detects emotional resistance or trends in user entries and frames reduction metrics through positive reinforcement rather than guilt.

## 🛠️ Google AI Tech Stack Used
The application is built completely within the Google Cloud ecosystem for maximum synergy and zero-latency inference:
* **Frontend/Backend:** Python FastAPI containerized via Docker.
* **Compute Engine:** **Google Cloud Run** for fully managed, serverless, and autoscaling deployment.
* **CI/CD Pipeline:** **Google Cloud Build** managing containerization transitions.
* **GenAI Engine:** **Vertex AI SDK** leveraging the `gemini-1.5-flash` model with strict JSON schema outputs.

## 🚀 Deployment Journey
The implementation and deployment followed a continuous integration pattern:
1. **Local Scaffolding & Virtualization:** Developed the application core and verified container builds via local Docker configurations.
2. **Google Cloud Project Setup:** Initialized an isolated Google Cloud project via the `gcloud` CLI and initialized billing parameters.
3. **IAM & API Activation:** Programmatically activated `run.googleapis.com`, `cloudbuild.googleapis.com`, and `aiplatform.googleapis.com`.
4. **Cloud Run Deployment:** Shipped the production container to Cloud Run using automated infrastructure configurations, providing a highly scalable HTTPS endpoint.

## 🌟 Benefits
* **Behavioral Transformation:** Shifts consumer focus from overwhelming macro-problems to highly actionable micro-habits.
* **High Accessibility:** Minimalist design ensures frictionless onboarding with zero data bloat.
* **Scalable Infrastructure:** Built on Google Cloud Run to handle traffic surges smoothly with near-zero idle compute cost.

## 🎯 Conclusion
By coupling Google's state-of-the-art Vertex AI suite with a human-centric, emotionally warm design, this platform successfully changes how individuals perceive their environmental footprint. It transforms carbon tracking from a tedious accounting chore into a deeply personal, empowering journey towards sustainability.

## 🌐 Deployment URL
👉 **[https://carbon-footprint-platform-999172966430.us-central1.run.app](https://carbon-footprint-platform-999172966430.us-central1.run.app)**
