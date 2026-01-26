
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  children: React.ReactNode;
};

export default function PublicLayout({ children }: Props) {
 
  return <>{children}</>;
}
