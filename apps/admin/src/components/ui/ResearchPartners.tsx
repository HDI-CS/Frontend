import clsx from 'clsx';
import Image from 'next/image';

import { KEITLogo, MOTIELogo } from '@hdi/ui';

export function ResearchPartners({ className }: { className?: string }) {
  return (
    <footer className={clsx('flex items-center gap-12', className)}>
      <Image
        src={MOTIELogo}
        alt="MOTIE 로고"
        width={160}
        className="h-auto object-contain"
        priority
      />
      <Image
        src={KEITLogo}
        alt="KEIT 로고"
        width={200}
        className="h-auto object-contain"
        priority
      />
    </footer>
  );
}
