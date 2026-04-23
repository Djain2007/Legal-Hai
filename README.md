# Legal Hai!

**Understand Any Contract in Seconds**

Legal Hai! is an AI-powered legal assistant that enables users to analyze contracts, detect risks, and understand complex legal clauses in plain language before signing.

---

## Overview

Many individuals sign contracts without fully understanding their implications. Legal Hai! addresses this problem by leveraging large language models to provide structured, actionable insights from legal documents.

The application allows users to upload a contract and receive:

* Identified risks
* Clause-level analysis
* Plain-language explanations
* An overall risk assessment

---

## Key Features

### Contract Analysis

Supports JPG< PNG and then extract text from it and process legal content.

### Risk Detection

Identifies potentially harmful or one-sided clauses such as:

* Lack of termination rights
* Unfair liability terms
* Non-refundable payment conditions
* Ownership transfer clauses

### Plain Language Explanation

Transforms complex legal terminology into clear, understandable explanations for non-experts.

### Risk Scoring

Generates an overall contract risk score categorized as Low, Medium, or High.

### Multi-Step AI Pipeline

Implements a structured workflow:

1. Clause extraction
2. Clause classification
3. Risk identification
4. Simplification
5. Final report generation

---

## Why Not Use a General Chatbot?

General-purpose tools require users to:

* Formulate effective prompts
* Interpret unstructured outputs

Legal Hai! provides:

* A guided workflow
* Structured JSON-based outputs
* Domain-specific analysis
* Consistent and repeatable results

---

## Tech Stack

### Frontend

* Next.js
* Tailwind CSS
* Stitch (UI design)

### Backend

* AI Studio (LLM orchestration)
* Serverless API routes

### AI Providers

* OpenAI (GPT models)
* Anthropic (Claude)
* OpenRouter (multi-model access)

### Database and Storage

* Supabase (PostgreSQL and file storage)

### Deployment

* Vercel

---

## Application Workflow

1. User uploads a contract
2. Text is extracted from the document
3. AI pipeline processes the content:

   * Clause extraction
   * Risk analysis
   * Simplification
   * Report generation
4. Results are rendered in a structured UI

---

## Use Cases

* Freelance agreements
* Brand collaborations
* Rental contracts
* Employment offers
* Non-disclosure agreements (NDAs)

---

## Example Scenario

A content creator reviews a contract from a social media agency. Legal Hai! identifies:

* No termination rights for the client
* Full content ownership assigned to the agency
* Zero liability clause
* Non-refundable payment terms

The system classifies the contract as High Risk and provides clear explanations for each issue.

---

## Future Improvements

* Clause highlighting within documents
* Interactive Q&A with contracts
* Exportable reports (PDF)
* Multi-language support
* Contract comparison tools

---

## Conclusion

Legal Hai! is designed to make legal understanding accessible, structured, and efficient, enabling users to make informed decisions before signing any agreement.
