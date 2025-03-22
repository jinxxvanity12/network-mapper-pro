
import React from 'react';
import { Bell, Settings, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="w-full h-16 px-6 flex items-center justify-between gap-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
        {title}
      </h1>
      
      <div className="flex items-center gap-4 ml-auto">
        <div className="relative w-64 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search..." 
            className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>
        
        <Button size="icon" variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-ping-slow"></span>
        </Button>
        
        <Button size="icon" variant="ghost">
          <Settings className="h-5 w-5" />
        </Button>
        
        <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
          <span className="font-medium text-sm">NT</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
