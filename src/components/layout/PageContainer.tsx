
import React from 'react';
import Header from './Header';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  title, 
  children,
  className
}) => {
  return (
    <div className="min-h-screen pl-64 w-full">
      <Header title={title} />
      <main className={cn("p-6 animate-fade-in", className)}>
        {children}
      </main>
    </div>
  );
};

export default PageContainer;
