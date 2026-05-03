'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LangSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = locale === 'th' ? 'en' : 'th';
  const targetPath =
    locale === 'th'
      ? `/en${pathname}`
      : pathname.replace(/^\/en/, '') || '/';

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => router.replace(targetPath)}
      className="gap-2"
    >
      <Globe className="h-4 w-4" />
      {switchTo.toUpperCase()}
    </Button>
  );
}
