# Carbon Footprint Awareness Platform — Aetheria

A professional, minimal, and emotionally reflective web application designed to help individuals track, understand, and reduce their daily carbon footprint using Gemini-powered personalized insights.

## Problem Statement

Climate change is one of the most pressing challenges of our era, yet individuals often find it difficult to connect their personal daily actions (commuting, home energy use, dietary choices) with concrete ecological outcomes. Many existing carbon footprint calculators are overly complex, clinical, or guilt-inducing, which often leads to disengagement rather than positive behavior change.

## The Solution

**Aetheria** is a reflective web platform that offers an empathetic approach to tracking environmental impact. It allows users to input their daily activities in a simple, inviting format. The application visualizes their carbon footprint in real-time using a custom-designed SVG gauge and shifts the ambient lighting of the interface (from soothing green to alert terracotta) to match their carbon intensity. Rather than using rigid judgment, Aetheria guides users to reflect on their connection to the global ecosystem.

## How Gen AI is Used

Aetheria integrates **Google's Gemini model** via Vertex AI to process user activities. When a user submits their daily actions, the application calculates their raw carbon footprint across five categories. This profile is sent to `gemini-1.5-flash` with a tailored prompt. 

Gemini generates a response structured into three components:
1. **A Moment of Reflection**: An empathetic validation of where they currently stand, reminding them of their place in the broader ecosystem.
2. **Actionable Changes**: Exactly three highly specific, practical recommendations customized to their highest emission categories, containing realistic carbon savings.
3. **A Shared Journey**: An encouraging conclusion that reframes their personal efforts as part of a collective global movement.

## Google AI Tech Stack Used

- **Vertex AI (`gemini-1.5-flash`)**: Leveraged to generate highly contextualized, warm, and actionable carbon reduction insights.
- **Google Cloud Run**: Hosts the containerized FastAPI python application serverlessly, allowing for fast, auto-scaling deployment.
- **Google Cloud Build**: Orchestrates the building of the Docker container directly from the application source.
- **Google Cloud SDK**: Used for command-line orchestration of services, billing setup, and deployment.

## Deployment Journey

1. **Project Initialization**: Created a dedicated Google Cloud project `carbon-footprint-5739` and linked it to billing account `01F7F1-236A36-DBC8C0`.
2. **API Enablement**: Activated the required Google API services:
   - `run.googleapis.com` (Cloud Run)
   - `cloudbuild.googleapis.com` (Cloud Build)
   - `aiplatform.googleapis.com` (Vertex AI)
3. **Application Scaffolding**: Built a FastAPI server in Python, integrated the Vertex AI SDK, and designed a responsive, warm single-page HTML/CSS/JS frontend using HSL color dynamics.
4. **Containerization**: Packaged the application with a multi-stage-ready `Dockerfile` running on a Python 3.11 slim base.
5. **Deployment**: Deployed the build container directly to Cloud Run in the `us-central1` region using local-source Cloud Build trigger:
   ```bash
   gcloud run deploy carbon-footprint-platform --source . --region us-central1 --allow-unauthenticated
   ```
6. **Verification**: Checked the public service endpoint, validated API connectivity, and confirmed response rendering.

## Benefits

- **Empathy-First Interaction**: Uses positive validation rather than guilt to motivate user behavior.
- **Hyper-Personalized Guidance**: Bypasses generic advice in favor of customized suggestions targeting the user's specific high-impact habits.
- **Organic Design Language**: Built with custom CSS featuring soft gradients, glassmorphism, and ambient glows that dynamically respond to user results, creating a reflective, premium experience.
- **High Performance**: Deployed on serverless Google Cloud infrastructure, scaling down to zero when idle to conserve compute resources.

## Conclusion

Empowering individuals to live in ecological harmony requires starting from awareness, not criticism. By combining simple daily tracking, sensory-responsive design, and the generative power of Gemini, Aetheria translates cold data into a warm, shared journey toward global sustainability.

## Deployment URL

Live Application Link: [https://carbon-footprint-platform-999172966430.us-central1.run.app](https://carbon-footprint-platform-999172966430.us-central1.run.app)
