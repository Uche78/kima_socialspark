import Anthropic from "@anthropic-ai/sdk";

export const MODEL = "claude-opus-5-5";

let client: Anthropic | null = null;
export function anthropic() {
  client ??= new Anthropic();
  return client;
}

export class ClaudeRefusalError extends Error {}
