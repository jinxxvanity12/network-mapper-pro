
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Network, 
  Wifi, 
  Router, 
  Server, 
  Monitor, 
  Info, 
  Edit, 
  Trash2 
} from 'lucide-react';
import { Equipment } from '@/types/equipment';
import { cn } from '@/lib/utils';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEquipment } from '@/context/EquipmentContext';

interface EquipmentCardProps {
  equipment: Equipment;
  onEdit: () => void;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, onEdit }) => {
  const { deleteEquipment } = useEquipment();
  
  const getEquipmentIcon = () => {
    const className = "h-5 w-5";
    
    switch (equipment.type) {
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
  
  const getEquipmentTypeLabel = () => {
    switch (equipment.type) {
      case 'switch':
        return 'Switch';
      case 'accessPoint':
        return 'Access Point';
      case 'router':
        return 'Router';
      case 'server':
        return 'Server';
      default:
        return 'Other';
    }
  };
  
  const getIconBackground = () => {
    switch (equipment.type) {
      case 'switch':
        return 'bg-network-switch/10 text-network-switch';
      case 'router':
        return 'bg-network-router/10 text-network-router';
      case 'accessPoint':
        return 'bg-network-ap/10 text-network-ap';
      case 'server':
        return 'bg-network-server/10 text-network-server';
      default:
        return 'bg-network-client/10 text-network-client';
    }
  };

  const totalPorts = equipment.ports.length;
  const connectedPorts = equipment.ports.filter(port => port.status === 'connected').length;
  
  return (
    <Card className="glass-card glass-card-hover overflow-hidden">
      <div className="flex justify-between items-start p-4 pb-0">
        <div className={cn(
          "h-10 w-10 rounded-lg flex items-center justify-center", 
          getIconBackground()
        )}>
          {getEquipmentIcon()}
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {equipment.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this device and remove all associated connections.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => deleteEquipment(equipment.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <CardContent className="pt-3">
        <h3 className="font-semibold text-lg">{equipment.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">{getEquipmentTypeLabel()}</span>
          <span className="bg-secondary h-1 w-1 rounded-full"></span>
          <span className="text-xs text-muted-foreground">{equipment.model}</span>
        </div>
        
        {equipment.ipAddress && (
          <div className="mt-3 px-3 py-2 bg-secondary/50 rounded-md">
            <p className="text-xs font-medium">IP Address: {equipment.ipAddress}</p>
            {equipment.macAddress && (
              <p className="text-xs text-muted-foreground mt-1">MAC: {equipment.macAddress}</p>
            )}
          </div>
        )}
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Ports</span>
            <span className="font-medium">{connectedPorts}/{totalPorts}</span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary animate-pulse-gentle rounded-full"
              style={{ width: `${(connectedPorts / totalPorts) * 100}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="justify-between border-t border-gray-100 dark:border-gray-800 py-3">
        <span className="text-xs text-muted-foreground">
          Location: {equipment.location}
        </span>
        <Link to={`/equipment/${equipment.id}`}>
          <Button variant="ghost" size="sm" className="h-7 px-2">
            <Info className="h-3.5 w-3.5 mr-1" />
            Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EquipmentCard;
