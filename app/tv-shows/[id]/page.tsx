import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import AddReviewForm from '@/components/add-review-form';
import TitleInfo from '@/components/title-info';
import TitleReviews from '@/components/title-reviews';

export const metadata = { title: config.site.name } satisfies Metadata;

export const runtime = 'edge';

export default function Page({ params }: { params: { id: string } }): React.JSX.Element {
  const id = params?.id;
  return (
    <>
      <TitleInfo id={Number(id)} movieOrTv="tv" />
      <TitleReviews id={Number(id)} />
      <AddReviewForm id={Number(id)} />
    </>
  );
}
