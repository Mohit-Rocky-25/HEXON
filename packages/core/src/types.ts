import { z } from "zod";
import * as schemas from "./schemas";

export type RepositoryReference = z.infer<typeof schemas.RepositoryReferenceSchema>;
export type RepositoryRevision = z.infer<typeof schemas.RepositoryRevisionSchema>;
export type RepositoryFile = z.infer<typeof schemas.RepositoryFileSchema>;
export type IndexedSymbol = z.infer<typeof schemas.IndexedSymbolSchema>;
export type SourceReference = z.infer<typeof schemas.SourceReferenceSchema>;
export type SearchQuery = z.infer<typeof schemas.SearchQuerySchema>;
export type SearchResult = z.infer<typeof schemas.SearchResultSchema>;
export type AnalysisStatus = z.infer<typeof schemas.AnalysisStatusSchema>;
export type AnalysisJob = z.infer<typeof schemas.AnalysisJobSchema>;
export type CodeQuestion = z.infer<typeof schemas.CodeQuestionSchema>;
export type Evidence = z.infer<typeof schemas.EvidenceSchema>;
export type BugReport = z.infer<typeof schemas.BugReportSchema>;
export type BugHypothesis = z.infer<typeof schemas.BugHypothesisSchema>;
export type PatchProposal = z.infer<typeof schemas.PatchProposalSchema>;
export type AIProviderConfiguration = z.infer<typeof schemas.AIProviderConfigurationSchema>;

export interface ArchitectureSummary {
  primaryLanguage: string;
  detectedFrameworks: string[];
  entryPoints: string[];
  manifestFiles: string[];
  keyModules: {
    directory: string;
    description: string;
    fileCount: number;
  }[];
  dependencies: {
    name: string;
    version?: string;
    isDev?: boolean;
  }[];
}

export interface AnswerResponse {
  answer: string;
  citations: SourceReference[];
  confidence: "high" | "medium" | "low" | "uncertain";
  modelUsed?: string;
  limitations?: string[];
}

export interface RateLimitStatus {
  limit: number;
  remaining: number;
  resetAt: string;
}
