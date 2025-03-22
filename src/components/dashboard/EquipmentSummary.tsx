
import React from 'react';
import { useEquipment } from '@/context/EquipmentContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Equipment } from '@/types/equipment';
import { Network, Wifi, Router, Server, Monitor } from 'lucide-react';

const EquipmentSummary: React.FC = () => {
  const { equipment } = useEquipment();

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

  const getEquipmentTypeLabel = (type: Equipment['type']) => {
    switch (type) {
      case 'switch':
        return 'Switches';
      case 'accessPoint':
        return 'Access Points';
      case 'router':
        return 'Routers';
      case 'server':
        return 'Servers';
      default:
        return 'Other Devices';
    }
  };

  const equipmentByType = equipment.reduce((acc, eq) => {
    acc[eq.type] = (acc[eq.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const equipmentTypes = Object.keys(equipmentByType).sort();

  return (
    <Card className="glass-card glass-card-hover">
      <CardHeader>
        <CardTitle className="text-md">Equipment Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {equipmentTypes.map(type => (
            <div key={type} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getEquipmentIcon(type as Equipment['type'])}
                <span className="text-sm font-medium">{getEquipmentTypeLabel(type as Equipment['type'])}</span>
              </div>
              <div className="flex items-center justify-center h-6 min-w-[2.5rem] bg-primary/10 dark:bg-primary/20 rounded-full">
                <span className="text-xs font-semibold text-primary">{equipmentByType[type]}</span>
              </div>
            </div>
          ))}
          
          {equipmentTypes.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <p>No equipment added yet</p>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
            <span className="text-sm font-medium">Total Devices</span>
            <div className="flex items-center justify-center h-6 min-w-[2.5rem] bg-primary/10 dark:bg-primary/20 rounded-full">
              <span className="text-xs font-semibold text-primary">{equipment.length}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentSummary;
