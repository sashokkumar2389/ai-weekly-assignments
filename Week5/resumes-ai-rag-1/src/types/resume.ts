export interface Resume {
  _id: string;
  resumeId?: string; // Optional alias for _id for compatibility
  text: string;
  embedding: number[];
  name: string;
  email: string;
  phone: string | null;
  location: string;
  company: string;
  role: string;
  education: string;
  total_Experience: number;
  relevant_Experience: number;
  skills: string[];
  similarityScore?: number; // For vector search results
}