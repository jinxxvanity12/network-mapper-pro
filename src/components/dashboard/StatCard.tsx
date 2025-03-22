
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  change,
  className,
}) => {
  return (
    <Card className={cn("glass-card glass-card-hover overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-8 w-8 rounded-md bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || change) && (
          <div className="flex items-center justify-between mt-1">
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
            {change && (
              <div className={cn(
                "text-xs font-medium flex items-center gap-1",
                change.trend === 'up' ? 'text-green-600 dark:text-green-500' : 
                change.trend === 'down' ? 'text-red-600 dark:text-red-500' : 
                'text-gray-500'
              )}>
                {change.trend === 'up' && <span>↑</span>}
                {change.trend === 'down' && <span>↓</span>}
                {change.value}%
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
