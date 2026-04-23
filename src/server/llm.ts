import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createMistral } from '@ai-sdk/mistral';
import { z } from 'zod';
import dotenv from 'dotenv';
import { appConfig, getEffectiveModel, type LLMProvider } from './config.js';
import type { AcceptedImageMimeType } from './parser.js';
dotenv.config();

// ---------------------------------------------------------------------------
// Provider factory — vision-capable models used as defaults
// ---------------------------------------------------------------------------
const VISION_DEFAULT_MODELS: Record<LLMProvider, string> = {
  openai:     'gpt-4o',
  anthropic:  'claude-3-5-sonnet-latest',
  gemini:     'gemini-2.5-pro-preview-05-06',
  mistral:    'pixtral-large-latest', // Mistral's vision model
  openrouter: 'openai/gpt-4o',
};

function getLLMModel() {
  const provider: LLMProvider = appConfig.provider;
  // Use LLM_MODEL override, else vision-specific default, else config default
  const model = appConfig.modelOverride || VISION_DEFAULT_MODELS[provider];

  console.log(`[llm] Provider="${provider}" Model="${model}" (vision mode)`);

  switch (provider) {
    case 'anthropic': {
      const key = process.env.ANTHROPIC_API_KEY;
      if (!key) throw new Error('ANTHROPIC_API_KEY is not set in environment variables.');
      return createAnthropic({ apiKey: key })(model);
    }
    case 'gemini': {
      const key = process.env.GEMINI_API_KEY;
      if (!key) throw new Error('GEMINI_API_KEY is not set in environment variables.');
      return createGoogleGenerativeAI({ apiKey: key })(model);
    }
    case 'mistral': {
      const key = process.env.MISTRAL_API_KEY;
      if (!key) throw new Error('MISTRAL_API_KEY is not set in environment variables.');
      return createMistral({ apiKey: key })(model);
    }
    case 'openrouter': {
      const key = process.env.OPENROUTER_API_KEY;
      if (!key) throw new Error('OPENROUTER_API_KEY is not set in environment variables.');
      return createOpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: key,
      })(model);
    }
    case 'openai':
    default: {
      const key = process.env.OPENAI_API_KEY;
      if (!key) throw new Error('OPENAI_API_KEY is not set in environment variables.');
      return createOpenAI({ apiKey: key })(model);
    }
  }
}

// ---------------------------------------------------------------------------
// Vision Analysis Pipeline
// Accepts an image buffer directly — no OCR step required.
// The AI model reads the document image and performs full legal analysis.
// ---------------------------------------------------------------------------
export async function runAnalysisPipeline(
  imageBuffer: Buffer,
  mimeType: AcceptedImageMimeType
) {
  const model = getLLMModel();

  console.log('[llm] Step 1 — Vision: Clause Extraction, Classification & Risk Assessment');
  const extractedClauses = await generateObject({
    model,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            image: imageBuffer,
            mediaType: mimeType,
          },
          {
            type: 'text',
            text:
              'You are an expert corporate lawyer. Analyze this legal document image. ' +
              'Identify all critical clauses visible in the document. ' +
              'For each clause: extract the core text, classify its type, rate its importance, ' +
              'explain it in plain English, and perform a strict risk assessment. ' +
              'If a risk exists, classify it as High Risk or Medium Risk, state the reason, ' +
              'and provide a negotiation suggestion.',
          },
        ],
      },
    ],
    schema: z.object({
      clauses: z.array(
        z.object({
          type: z.string().describe('e.g., Definitions, Confidentiality, Non-Compete, Governing Law'),
          original_text: z.string().describe('A very brief snippet or title of the original clause text'),
          importance: z.enum(['Critical', 'Important', 'Standard']),
          explanation: z.string().describe('A plain English explanation of what this clause means.'),
          risk_level: z.enum(['High Risk', 'Medium Risk', 'Standard']),
          risk_reason: z.string().nullable().describe('Reason for the risk. Leave null if standard'),
          risk_suggestion: z.string().nullable().describe('Actionable advice to renegotiate. Leave null if standard'),
        })
      ),
    }),
  });

  const clauses = extractedClauses.object.clauses;
  const risksOnly = clauses.filter(
    (c) => c.risk_level === 'High Risk' || c.risk_level === 'Medium Risk'
  );

  console.log('[llm] Step 2 — Vision: Final Report Generation & Risk Score');
  const finalReport = await generateObject({
    model,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            image: imageBuffer,
            mediaType: mimeType,
          },
          {
            type: 'text',
            text:
              'You are a senior risk assessment AI. Based on the legal document image and the ' +
              'following extracted clauses and risks, produce a final overall risk score (0-100) ' +
              'and a comprehensive Executive Summary in plain English.\n\n' +
              `Extracted clauses:\n${JSON.stringify(clauses, null, 2)}\n\n` +
              'A higher score means higher risk to the user signing this document.',
          },
        ],
      },
    ],
    schema: z.object({
      risk_score: z
        .number()
        .min(0)
        .max(100)
        .describe('0 = Perfectly safe, 100 = Extremely one-sided/dangerous'),
      summary: z
        .string()
        .describe("A comprehensive 2-3 paragraph plain-English summary of the contract's impact on the user."),
    }),
  });

  return {
    risk_score: finalReport.object.risk_score,
    summary: finalReport.object.summary,
    risks: risksOnly.map((r) => ({
      clause: r.type,
      risk_level: r.risk_level.toLowerCase().replace(' risk', ''),
      reason: r.risk_reason || '',
      suggestion: r.risk_suggestion || '',
    })),
    clauses: clauses.map((c) => ({
      type: c.type,
      importance: c.importance,
      explanation: c.explanation,
    })),
  };
}
