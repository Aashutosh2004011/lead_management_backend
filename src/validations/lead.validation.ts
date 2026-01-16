import { z } from 'zod';

export const LeadStageEnum = z.enum([
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'PROPOSAL',
  'NEGOTIATION',
  'CLOSED_WON',
  'CLOSED_LOST',
]);

export const LeadStatusEnum = z.enum([
  'ACTIVE',
  'INACTIVE',
  'CONVERTED',
  'REJECTED',
]);

export const leadQuerySchema = z.object({
  search: z.string().optional(),
  stage: LeadStageEnum.optional(),
  status: LeadStatusEnum.optional(),
  source: z.string().optional(),
  country: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.string().transform(Number).pipe(z.number().int().positive()).optional().default('1'),
  limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).optional().default('10'),
});

export const leadIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid MongoDB ObjectId'),
});

export type LeadQueryInput = z.infer<typeof leadQuerySchema>;
export type LeadIdInput = z.infer<typeof leadIdSchema>;
