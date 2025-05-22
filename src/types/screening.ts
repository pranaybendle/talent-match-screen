
export interface JobDescription {
  id: string;
  title: string;
  company: string;
  content: string;
  requiredSkills: string[];
  experience: string;
  location: string;
  uploadedAt: Date;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  fileName: string;
  fileSize: number;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  experience: string;
  summary: string;
  status: "pending" | "shortlisted" | "rejected" | "invited";
  uploadedAt: Date;
}

export interface MatchResult {
  candidateId: string;
  score: number;
  reasoning: string;
  strengths: string[];
  concerns: string[];
}
