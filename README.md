
# ENTERPRISE DELIVERY INTELLIGENCE PLATFORM

A high-fidelity tool designed for Senior Solutions Architects and Technical Leads to generate realistic, conservative, and professional software project estimations for enterprise clients.

## 🚀 Overview

Estimating enterprise software is notoriously difficult due to integration complexities, compliance requirements, and operational overhead. This tool leverages the **Google Gemini 3.0 Pro** model with a specialized architectural persona and **Deep Thinking mode** to move beyond "best-case scenario" coding and into "realistic enterprise delivery" planning.

## ✨ Key Features

- **Deep Thinking Mode (NEW)**: Utilizes the max reasoning budget (32,768 tokens) of Gemini 3 Pro to analyze hidden risks and technical debt before providing numbers.
- **AI-Driven Architecture Logic**: Uses advanced LLM reasoning to identify hidden complexities in tech stacks and constraints.
- **Project Portfolio Dashboard**: Manage multiple estimations with sorting, filtering, and key performance metrics.
- **Conservative Estimation Engine**: Specifically tuned to include "enterprise overhead" (CI/CD, testing, documentation, and stakeholder reviews).
- **Structured Reports**: Generates professional breakdowns including:
    - Phased Timelines (hours per phase).
    - Confidence Levels (Low/Medium/High).
    - Technical Risk Registries.
    - Core Assumptions.
- **Persistence**: All projects are saved locally in your browser for persistent access.
- **Print-to-PDF**: Clean, report-ready CSS for sharing estimates with stakeholders.

## 🛠 Technical Stack

- **Framework**: React 19 (Functional Components & Hooks)
- **Styling**: Tailwind CSS
- **AI Engine**: Google GenAI SDK (`@google/genai`)
- **Model**: `gemini-3-pro-preview`
- **Type Safety**: TypeScript

## 📂 Project Structure

- `/components`: UI building blocks (Dashboard, Inputs, Estimate View, Buttons).
- `/services`: Gemini API integration logic and system prompting.
- `/types.ts`: Centralized TypeScript interfaces for project data.
- `App.tsx`: Main navigation logic and state management for the portfolio.

## 📝 Usage Guide

1. **Dashboard**: View your current portfolio of estimates.
2. **New Estimate**: Click "+ New Estimate" to open the architect's input form.
3. **Deep Thinking**: Toggle the "Análise Profunda" switch for complex projects requiring high architectural precision.
4. **Project Inputs**: 
    - Provide a detailed description.
    - Select complexity (e.g., "Enterprise-Scale" triggers more conservative logic).
    - List constraints like "GDPR" or "Legacy ERP Integration".
5. **Analysis**: The AI generates a multi-phase timeline.
6. **Reporting**: View the detailed report and use the "Print" button to generate a PDF for client delivery.

---

*Built for Senior Architects who value realism over optimism.*
