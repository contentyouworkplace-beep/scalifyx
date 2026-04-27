import { notFound } from 'next/navigation';
import { IndustryLandingPage } from '@/components/IndustryLandingPage';
import { getNicheConfigBySlug, NICHE_SLUGS } from '@/lib/nicheLandingData';

export function generateStaticParams() {
  return NICHE_SLUGS.map((serviceName) => ({ serviceName }));
}

export default async function NicheLandingPage({
  params,
}: {
  params: Promise<{ serviceName: string }>;
}) {
  const { serviceName } = await params;
  const config = getNicheConfigBySlug(serviceName);

  if (!config) {
    notFound();
  }

  return <IndustryLandingPage config={config} />;
}
