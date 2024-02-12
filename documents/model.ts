import { z } from 'zod';

export const ZodDocument = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    relativePath: z.string().optional(),
    root: z.string().optional(),
    studyId: z.number().optional(),
    formId: z.number().optional(),
    subjectId: z.number().optional(),
    documentId: z.string().optional(),
    formVisitId: z.string().optional(),
    contentType: z.string().optional(),
});

export type IDocument = z.infer<typeof ZodDocument>;
