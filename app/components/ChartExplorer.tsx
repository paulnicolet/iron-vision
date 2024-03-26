'use client';
import './global.css';

import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import ACTIVITIES_CHARTS from '@/app/charts/activities/charts';
import PERFORMANCE_CHARTS from '@/app/charts/performance/charts';

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

  const activityItems = Object.keys(ACTIVITIES_CHARTS).map((slug) => {
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

  const performanceItems = Object.keys(PERFORMANCE_CHARTS).map((slug) => {
    return (
      <Command.Item
        key={slug}
        onSelect={(_) => {
          setIsOpen(false);
          router.push(`/charts/performance/${slug}`);
        }}
      >
        {slug}
      </Command.Item>
    );
  });

  return (
    <div>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        Menu
      </button>
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
          {activityItems}
          {performanceItems}
        </Command.List>
      </Command.Dialog>
    </div>
  );
}
