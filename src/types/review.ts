import type { z as zod } from 'zod';

import type { reviewFormSchema } from '@/lib/zod-schemas';

export interface Review {
  id?: number;
  author?: number;
  authorName?: string;
  authorInitials?: string;
  rating?: number;
  comment?: string;
  datePosted?: Date;
  title?: number;
}

export type ReviewFormValues = zod.infer<typeof reviewFormSchema>;
