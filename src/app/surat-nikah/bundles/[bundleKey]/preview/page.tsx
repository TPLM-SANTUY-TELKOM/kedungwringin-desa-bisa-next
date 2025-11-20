import { notFound } from "next/navigation";

import { BundlePreviewClient } from "./BundlePreviewClient";

type BundlePreviewPageProps = {
  params: Promise<{ bundleKey: string }>;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function BundlePreviewPage({ params }: BundlePreviewPageProps) {
  const { bundleKey } = await params;
  if (!bundleKey) {
    notFound();
  }

  return <BundlePreviewClient bundleKey={bundleKey} />;
}
