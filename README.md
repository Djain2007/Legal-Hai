# Legal-Hai

Legal-Hai is an AI-powered legal document review and management platform. It allows users to upload legal contracts, analyze them for risks, manage a clause library, and review historical data through a comprehensive dashboard.

## Features

- **Document Upload:** Upload contract images for AI-powered analysis.
- **Contract Review:** Deep dive into specific clauses and legal terminology using an integrated AI assistant.
- **Risk Reports:** Automatically generate risk assessments for uploaded documents to highlight potential legal pitfalls.
- **Clause Library:** Manage and store frequently used legal clauses.
- **Dashboard & History:** View past uploads, analyses, and platform usage metrics.
- **Settings & Preferences:** Configure AI providers (OpenAI, Anthropic, Google, Mistral, OpenRouter) and manage user preferences.

## Tech Stack

- **Frontend:** React, React Router DOM, Tailwind CSS (Vite)
- **Backend:** Node.js, Express
- **Database & Authentication:** Supabase
- **AI Integration:** Vercel AI SDK (`ai`), supporting multiple models.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Supabase account and project
- API keys for your preferred AI providers (OpenAI, Anthropic, Google, Mistral, etc.)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Djain2007/Legal-Hai.git
   cd Legal-Hai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your environment variables. Example variables include:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Server Environment Variables
   OPENAI_API_KEY=your_openai_key
   ANTHROPIC_API_KEY=your_anthropic_key
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_key
   # Add others as needed based on the platform's configuration
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application should start up locally.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm start`: Runs the production server.

## Deployment

The platform is configured for deployment on Vercel. Ensure you add your environment variables to the Vercel project settings before deploying.

## License

SPDX-License-Identifier: Apache-2.0
