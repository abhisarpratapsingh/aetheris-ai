import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

// In-memory cache to prevent repeated API calls per request
interface CachedSecret {
  value: string;
  expiresAt: number;
}

const secretCache: Map<string, CachedSecret> = new Map();
const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes cache

let client: SecretManagerServiceClient | null = null;

function getClient(): SecretManagerServiceClient {
  if (!client) {
    client = new SecretManagerServiceClient();
  }
  return client;
}

/**
 * Accesses a secret from Google Cloud Secret Manager.
 * Falls back safely to process.env for local development or if running in non-GCP environment.
 */
export async function getSecret(secretName: string, version: string = 'latest'): Promise<{ value: string; source: 'secret_manager' | 'env_var' | 'mock' }> {
  // Check memory cache first
  const cacheKey = `${secretName}:${version}`;
  const cached = secretCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return { value: cached.value, source: 'secret_manager' };
  }

  // 1. Try Google Cloud Secret Manager if GCP project is available
  const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT;
  if (projectId) {
    try {
      const smClient = getClient();
      const name = `projects/${projectId}/secrets/${secretName}/versions/${version}`;
      const [response] = await smClient.accessSecretVersion({ name });
      const payload = response.payload?.data?.toString();

      if (payload) {
        secretCache.set(cacheKey, {
          value: payload,
          expiresAt: Date.now() + CACHE_TTL_MS,
        });
        return { value: payload, source: 'secret_manager' };
      }
    } catch (err: any) {
      console.warn(`[SecretManager] Failed to fetch secret '${secretName}' from GCP Secret Manager: ${err.message}. Checking environment variables...`);
    }
  }

  // 2. Check process.env fallback
  const envVal = process.env[secretName] || (secretName === 'GEMINI_API_KEY' ? process.env.GOOGLE_API_KEY : undefined);
  if (envVal) {
    return { value: envVal, source: 'env_var' };
  }

  // 3. Fallback dummy placeholder to prevent server crashes in pure mock preview
  return { value: 'MOCK_GEMINI_KEY_DEVELOPMENT_MODE', source: 'mock' };
}
