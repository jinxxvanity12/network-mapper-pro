
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEquipment } from '@/context/EquipmentContext';
import { formatDistanceToNow } from 'date-fns';
import { Network, Wifi, Router, Server, Monitor, Plus, RefreshCw } from 'lucide-react';
import { Equipment } from '@/types/equipment';

const RecentActivity: React.FC = () => {
  const { equipment } = useEquipment();
  
  // Get all equipment and sort by lastUpdated, most recent first
  const sortedEquipment = [...equipment].sort((a, b) => 
    b.lastUpdated.getTime() - a.lastUpdated.getTime()
  ).slice(0, 5); // Take only the 5 most recent

  const getEquipmentIcon = (type: Equipment['type'], className: string = 'h-4 w-4') => {
    switch (type) {
      case 'switch':
        return <Network className={className} />;
      case 'accessPoint':
        return <Wifi className={className} />;
      case 'router':
        return <Router className={className} />;
      case 'server':
        return <Server className={className} />;
      default:
        return <Monitor className={className} />;
    }
  };

  const getActivityType = (eq: Equipment): { label: string; icon: JSX.Element } => {
    // Simple logic to determine if this was an add or update
    const isNewDevice = formatDistanceToNow(eq.addedAt, { addSuffix: true }) === 
                       formatDistanceToNow(eq.lastUpdated, { addSuffix: true });
    
    if (isNewDevice) {
      return { 
        label: 'Added new device', 
        icon: <Plus className="h-3 w-3" />
      };
    } else {
      return { 
        label: 'Updated device', 
        icon: <RefreshCw className="h-3 w-3" />
      };
    }
  };

  return (
    <Card className="glass-card glass-card-hover">
      <CardHeader>
        <CardTitle className="text-md">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedEquipment.map(eq => {
            const activity = getActivityType(eq);
            
            return (
              <div key={eq.id} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                  {getEquipmentIcon(eq.type, 'h-4 w-4')}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{eq.name}</p>
                    <div className="flex items-center justify-center h-5 px-2 bg-primary/10 dark:bg-primary/20 rounded-full">
                      <span className="text-xs font-medium text-primary flex items-center gap-1">
                        {activity.icon}
                        {activity.label}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(eq.lastUpdated, { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })}
          
          {sortedEquipment.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
