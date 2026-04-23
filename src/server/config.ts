import dotenv from 'dotenv';
dotenv.config();

/**
 * All AI provider and model configuration is driven exclusively from environment variables.
 * No admin panel or runtime mutation. Set these in your .env file.
 *
 * LLM_PROVIDER: openai | anthropic | gemini | mistral | openrouter  (default: openai)
 * LLM_MODEL:    override the default model for the selected provider   (optional)
 *
 * Provider-specific API keys:
 *   OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY, MISTRAL_API_KEY, OPENROUTER_API_KEY
 */

export type LLMProvider = 'openai' | 'anthropic' | 'gemini' | 'mistral' | 'openrouter';

const SUPPORTED_PROVIDERS: LLMProvider[] = ['openai', 'anthropic', 'gemini', 'mistral', 'openrouter'];

function resolveProvider(): LLMProvider {
  const raw = (process.env.LLM_PROVIDER || 'openai').toLowerCase().trim();
  if (SUPPORTED_PROVIDERS.includes(raw as LLMProvider)) {
    return raw as LLMProvider;
  }
  console.warn(`[config] Unknown LLM_PROVIDER="${raw}", falling back to "openai".`);
  return 'openai';
}

/** Default models per provider — overrideable via LLM_MODEL env var */
export const DEFAULT_MODELS: Record<LLMProvider, string> = {
  openai:      'gpt-4o',
  anthropic:   'claude-3-5-sonnet-latest',
  gemini:      'gemini-2.5-pro-preview-05-06',
  mistral:     'mistral-large-latest',
  openrouter:  'openai/gpt-4o',
};

export const appConfig = {
  /** Active LLM provider, read once from env at startup. */
  provider:    resolveProvider(),
  /** Active model override — falls back to the provider default if not set. */
  modelOverride: process.env.LLM_MODEL?.trim() || '',
} as const;

/** Returns the effective model id for the current provider. */
export function getEffectiveModel(): string {
  return appConfig.modelOverride || DEFAULT_MODELS[appConfig.provider];
}
