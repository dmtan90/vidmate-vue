import { api } from "@/config/api";
import type { PromptSession } from "@/types/prompt";
import { nanoid } from "nanoid";

const apiQuery = "/customer/ads/api/v1/prompt";

export async function createAdsFromPrompt(prompt: string, format: string) {
  const response = await api.post<PromptSession>(apiQuery, { prompt, format });
  return Object.assign({ id: nanoid() }, response.data) as PromptSession;
}
