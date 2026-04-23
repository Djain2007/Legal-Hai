# AI Models and Prompts Info

This document outlines the specific AI models and prompts used by the Legal-Hai application during the document analysis process. This information is implemented in `src/server/llm.ts`.

## 1. The Prompts Used

The application runs a two-step analysis pipeline. Here are the exact system/user prompts being sent to the AI when a document is analyzed:

### Step 1 Prompt: Clause Extraction & Risk Assessment
> *"You are an expert corporate lawyer. Analyze this legal document image. Identify all critical clauses visible in the document. For each clause: extract the core text, classify its type, rate its importance, explain it in plain English, and perform a strict risk assessment. If a risk exists, classify it as High Risk or Medium Risk, state the reason, and provide a negotiation suggestion."*

### Step 2 Prompt: Final Report Generation & Risk Score
> *"You are a senior risk assessment AI. Based on the legal document image and the following extracted clauses and risks, produce a final overall risk score (0-100) and a comprehensive Executive Summary in plain English.*
> 
> *Extracted clauses:*
> *[JSON data from Step 1]*
> 
> *A higher score means higher risk to the user signing this document."*

## 2. The Models Used

The AI model used depends on which AI provider is currently configured (`appConfig.provider`). The default vision-capable models mapped for each provider in your codebase are:

*   **OpenAI:** `gpt-4o`
*   **Anthropic:** `claude-3-5-sonnet-latest`
*   **Gemini:** `gemini-2.5-pro-preview-05-06`
*   **Mistral:** `pixtral-large-latest`
*   **OpenRouter:** `openai/gpt-4o`

*(Note: These can be overridden if an `LLM_MODEL` environment variable is explicitly set in the deployment environment).*
