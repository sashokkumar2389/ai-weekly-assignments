import { z } from "zod";

export const chatMessageSchema = z.object({
    id: z.string(),
    role: z.enum(["user", "assistant"]),
    content: z.string(),
    timestamp: z.number(),
    searchResults: z.optional(
        z.array(
            z.object({
                id: z.string(),
                name: z.string(),
                email: z.string(),
                phoneNumber: z.string(),
                score: z.number(),
                matchType: z.enum(["keyword", "vector", "hybrid"]),
            })
        )
    ),
    isError: z.optional(z.boolean()),
});

export const searchTypeSchema = z.enum(["keyword", "vector", "hybrid"]);

export const topKSchema = z.number().min(1).max(10);
