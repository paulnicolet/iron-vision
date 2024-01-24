'use client';
import './global.css';

import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import CHARTS from '@/app/charts/activities/charts';

export default function ChartExplorer() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: any) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const items = Object.keys(CHARTS).map((slug) => {
    return (
      <Command.Item
        key={slug}
        onSelect={(_) => {
          setIsOpen(false);
          router.push(`/charts/activities/${slug}`);
        }}
      >
        {slug}
      </Command.Item>
    );
  });

  return (
    <Command.Dialog ref={ref} open={isOpen} onOpenChange={setIsOpen}>
      <Command.Input autoFocus placeholder="Go to chart" />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        <Command.Item
          key="home"
          onSelect={(_) => {
            setIsOpen(false);
            router.replace('/');
          }}
        >
          Home
        </Command.Item>
        {items}
      </Command.List>
    </Command.Dialog>
  );
}
