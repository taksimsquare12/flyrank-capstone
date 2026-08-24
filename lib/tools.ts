import { z } from 'zod';

export const auditScoreSchema = z.object({
  score: z.number().describe('Overall score from 0 to 100'),
  level: z.enum(['Needs Improvement', 'Good', 'Excellent']).describe('Performance level'),
  keyInsights: z.array(z.string()).describe('Top 3 actionable insights or recommendations'),
  timestamp: z.string().optional().describe('ISO timestamp of the audit evaluation'),
});

export type AuditScoreResult = z.infer<typeof auditScoreSchema>;

export const auditScoreTool = {
  description: 'Calculates an audit quality score and provides key recommendations.',
  parameters: auditScoreSchema,
  execute: async ({ score, level, keyInsights }: AuditScoreResult) => {
    return {
      score,
      level,
      keyInsights,
      timestamp: new Date().toISOString(),
    };
  },
};