import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { RerankResponse, RerankOptions, SummarizeOptions } from '../types/llm';
import { Resume } from '../types/resume';

interface RankedCandidate {
    resumeId: string;
    score: number;
    tier: string;
    rationale: string;
    keyMatches: string[];
    gaps: string[];
    recommendations: string;
}

export class LLMService {
    private apiUrl: string;
    private apiKey: string;
    private model: string;
    private rerankPrompt: string;
    private summarizePrompt: string;
    private extractMetadataPrompt: string;

    constructor() {
        this.apiUrl = process.env.LLM_API_URL || 'https://api.groq.com/openai/v1';
        this.apiKey = process.env.LLM_API_KEY || process.env.GROQ_API_KEY || '';
        this.model = process.env.GROQ_LLM_MODEL || process.env.LLM_MODEL || 'openai/gpt-oss-120b';

        // Load prompts from files
        const promptsDir = path.join(__dirname, '../../prompts');
        this.rerankPrompt = fs.readFileSync(path.join(promptsDir, 'rerank.prompt.txt'), 'utf-8');
        this.summarizePrompt = fs.readFileSync(path.join(promptsDir, 'summarize.prompt.txt'), 'utf-8');
        this.extractMetadataPrompt = fs.readFileSync(path.join(promptsDir, 'metadata-extraction.prompt.txt'), 'utf-8');
    }

    public async rerankCandidates(
        query: string,
        candidates: Array<{ resumeId?: string; _id?: string; text?: string; snippet?: string }>,
        topK: number
    ): Promise<{ rankedCandidates: RankedCandidate[] }> {
        try {
            // Format candidates for LLM consumption
            const candidateSnippets = candidates.map((c, idx) => {
                const resumeId = c.resumeId || c._id || `candidate_${idx}`;
                const text = c.text || c.snippet || '';
                return {
                    resumeId,
                    snippet: text.substring(0, 500) // Limit snippet size
                };
            });

            const systemPrompt = this.rerankPrompt;
            const userMessage = `
JOB DESCRIPTION:
${query}

CANDIDATES TO RANK:
${JSON.stringify(candidateSnippets, null, 2)}

Please rank these candidates based on technical fit with the job requirements. Return ONLY valid JSON array.`;

            const response = await axios.post(
                `${this.apiUrl}/chat/completions`,
                {
                    model: this.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userMessage }
                    ],
                    temperature: 0.3,
                    max_tokens: 2000,
                    top_p: 0.9
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 30000
                }
            );

            const content = response.data.choices[0]?.message?.content || '[]';

            // Parse JSON response, handling potential markdown code blocks
            let jsonStr = content.trim();
            if (jsonStr.startsWith('```json')) {
                jsonStr = jsonStr.replace(/^```json\n/, '').replace(/\n```$/, '');
            } else if (jsonStr.startsWith('```')) {
                jsonStr = jsonStr.replace(/^```\n/, '').replace(/\n```$/, '');
            }

            const rankedCandidates: RankedCandidate[] = JSON.parse(jsonStr);

            // Ensure compatibility with both resumeId and _id naming
            const normalizedCandidates = rankedCandidates.map(c => ({
                ...c,
                resumeId: c.resumeId || (c as any)._id || ''
            }));

            return {
                rankedCandidates: normalizedCandidates.slice(0, topK)
            };
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error('LLM rerank error:', message);

            // Log detailed error for debugging
            if (error instanceof Error && error.message.includes('Authorization')) {
                console.error('Authentication failed - check API key');
            } else if (error instanceof Error && error.message.includes('model')) {
                console.error('Model not found - check model configuration');
                console.error(`Current model: ${this.model}`);
            }

            // Fallback: Return candidates with intelligent scoring based on keyword matching
            const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);

            const fallbackCandidates = candidates.slice(0, topK).map((c, idx) => {
                const text = (c.text || c.snippet || '').toLowerCase();
                const matches = keywords.filter(kw => text.includes(kw)).length;
                const score = Math.max(30, 100 - idx * 8 - (5 - matches) * 5);

                return {
                    resumeId: c.resumeId || c._id || `candidate_${idx}`,
                    score: Math.min(99, Math.max(30, score)),
                    tier: score >= 70 ? 'GOOD' : score >= 50 ? 'FAIR' : 'POOR',
                    rationale: `Fallback scoring: ${matches} keyword matches found`,
                    keyMatches: keywords.filter(kw => text.includes(kw)),
                    gaps: keywords.filter(kw => !text.includes(kw)),
                    recommendations: score >= 70 ? 'Worth considering' : 'May need review'
                };
            });

            return { rankedCandidates: fallbackCandidates };
        }
    }

    public async summarizeCandidateFit(
        query: string,
        candidate: { resumeId?: string; _id?: string; snippet?: string; text?: string },
        options?: SummarizeOptions
    ): Promise<{ summary: string; score: number }> {
        try {
            const style = options?.style || 'short';
            const maxTokens = options?.maxTokens || (style === 'short' ? 150 : 350);

            const systemPrompt = this.summarizePrompt
                .replace('{style}', style)
                .replace('{maxTokens}', String(maxTokens));

            const userMessage = `
JOB DESCRIPTION/QUERY:
${query}

CANDIDATE_RESUME_SNIPPET:
${candidate.snippet || candidate.text || 'No resume data provided'}

STYLE: ${style}
MAX_TOKENS: ${maxTokens}

Generate a summary of how this candidate fits the role.`;

            const response = await axios.post(
                `${this.apiUrl}/chat/completions`,
                {
                    model: this.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userMessage }
                    ],
                    temperature: 0.5,
                    max_tokens: maxTokens + 100,
                    top_p: 0.9
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 30000
                }
            );

            const summary = response.data.choices[0]?.message?.content || 'Unable to generate summary';

            // Calculate relevance score based on keyword matching
            const candidateText = (candidate.snippet || candidate.text || '').toLowerCase();
            const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
            const matchedKeywords = keywords.filter(kw => candidateText.includes(kw)).length;
            const score = Math.max(30, Math.min(95, 40 + (matchedKeywords * 10)));

            return { summary, score };
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error('LLM summarize error:', message);

            // Fallback: Return basic summary from resume with fallback score
            const snippet = candidate.snippet || candidate.text || '';
            const candidateText = snippet.toLowerCase();
            const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
            const matchedKeywords = keywords.filter(kw => candidateText.includes(kw)).length;
            const score = Math.max(30, Math.min(95, 40 + (matchedKeywords * 10)));

            return {
                summary: `[Summary unavailable - LLM service error: ${message}]\n\nResume excerpt: ${snippet.substring(0, 200)}...`,
                score
            };
        }
    }

    public async extractMetadata(rawText: string): Promise<{ skills: string[]; jobTitles: string[]; experienceSummary: string }> {
        try {
            const systemPrompt = this.extractMetadataPrompt;
            const userMessage = `
Extract the following information from this resume text:
- Skills (list of technologies, tools, frameworks)
- Job Titles (all job titles/roles mentioned)
- Experience Summary (1-2 sentence summary of key experience)

Resume Text:
${rawText}

Return ONLY valid JSON with keys: skills (array), jobTitles (array), experienceSummary (string)`;

            const response = await axios.post(
                `${this.apiUrl}/chat/completions`,
                {
                    model: this.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userMessage }
                    ],
                    temperature: 0.2,
                    max_tokens: 500,
                    top_p: 0.9
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 30000
                }
            );

            const content = response.data.choices[0]?.message?.content || '{}';

            // Parse JSON response
            let jsonStr = content.trim();
            if (jsonStr.startsWith('```json')) {
                jsonStr = jsonStr.replace(/^```json\n/, '').replace(/\n```$/, '');
            } else if (jsonStr.startsWith('```')) {
                jsonStr = jsonStr.replace(/^```\n/, '').replace(/\n```$/, '');
            }

            const metadata = JSON.parse(jsonStr);
            return {
                skills: Array.isArray(metadata.skills) ? metadata.skills : [],
                jobTitles: Array.isArray(metadata.jobTitles) ? metadata.jobTitles : [],
                experienceSummary: typeof metadata.experienceSummary === 'string' ? metadata.experienceSummary : ''
            };
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error('LLM metadata extraction error:', message);

            // Fallback: Return empty metadata
            return {
                skills: [],
                jobTitles: [],
                experienceSummary: 'Could not extract metadata from resume'
            };
        }
    }
}