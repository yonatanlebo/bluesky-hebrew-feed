import { minutesToMilliseconds } from 'date-fns';
import { z } from 'zod';

const envSchema = z.object({
  // HTTP Server
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('localhost'),

  // DB
  POSTGRES_CONNECTION_STRING: z.string(),
  POSTGRES_CA_CERT_FILEPATH: z.string().optional(),
  CACHE_TTL_MS: z.coerce.number().default(minutesToMilliseconds(30)),

  // API Client
  BLUESKY_API_ENDPOINT: z.string().default('https://bsky.social'),
  BLUESKY_CLIENT_LOGIN_IDENTIFIER: z.string(),
  BLUESKY_CLIENT_LOGIN_PASSWORD: z.string(),

  // Indexer
  FEEDGEN_SUBSCRIPTION_ENDPOINT: z.string().default('wss://bsky.network'),
  FEEDGEN_HOSTNAME: z.string().default('example.com'),
  FEEDGEN_PUBLISHER_DID: z.string(),
  SUBSCRIPTION_RECONNECT_DELAY: z.number().default(3000),
  EXPERIMENT_FEED_SOURCE_FILEPATH: z.string().optional(),
});

export function parseEnvironment() {
  return envSchema.parse(process.env);
}

export type Config = z.infer<typeof envSchema>;
