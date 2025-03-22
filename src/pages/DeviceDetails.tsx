
import React, { useState } from 'react';
import { EquipmentProvider, useEquipment } from '@/context/EquipmentContext';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, Network, Wifi, Router, Server, Monitor } from 'lucide-react';
import { Equipment, Port } from '@/types/equipment';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import EquipmentForm from '@/components/equipment/EquipmentForm';
import PortConfiguration from '@/components/equipment/PortConfiguration';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

const PortStatusBadge: React.FC<{ status: Port['status'] }> = ({ status }) => {
  switch (status) {
    case 'connected':
      return <Badge className="bg-green-500">Connected</Badge>;
    case 'disconnected':
      return <Badge variant="outline">Disconnected</Badge>;
    case 'disabled':
      return <Badge variant="secondary">Disabled</Badge>;
    case 'error':
      return <Badge variant="destructive">Error</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const DeviceDetailsContent = () => {
  const { id } = useParams<{ id: string }>();
  const { equipment, getEquipmentById, updateEquipment, deleteEquipment } = useEquipment();
  const navigate = useNavigate();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [portSheetOpen, setPortSheetOpen] = useState(false);
  
  const device = getEquipmentById(id || '');
  
  if (!device) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Device Not Found</h2>
        <p className="text-muted-foreground mb-6">The device you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/equipment">Back to Equipment</Link>
        </Button>
      </div>
    );
  }
  
  const getEquipmentIcon = () => {
    const className = "h-6 w-6";
    
    switch (device.type) {
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
    switch (device.type) {
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
    switch (device.type) {
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
  
  const handlePortClick = (port: Port) => {
    setSelectedPort(port);
    setPortSheetOpen(true);
  };
  
  const handlePortUpdate = (updatedPort: Port) => {
    const updatedPorts = device.ports.map(port => 
      port.id === updatedPort.id ? updatedPort : port
    );
    
    updateEquipment({
      ...device,
      ports: updatedPorts,
    });
  };
  
  const handleDeleteDevice = () => {
    deleteEquipment(device.id);
    navigate('/equipment');
  };
  
  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link to="/equipment">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{device.name}</h1>
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {device.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this device and remove all associated connections.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteDevice}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="glass-card glass-card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Device Information</CardTitle>
            <CardDescription>General device details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${getIconBackground()}`}>
                {getEquipmentIcon()}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{device.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{getEquipmentTypeLabel()}</span>
                  <span className="bg-secondary h-1 w-1 rounded-full"></span>
                  <span className="text-sm text-muted-foreground">{device.model}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-1 py-2 border-b border-gray-100 dark:border-gray-800">
                <div className="text-sm font-medium">Location</div>
                <div className="text-sm col-span-2">{device.location}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-1 py-2 border-b border-gray-100 dark:border-gray-800">
                <div className="text-sm font-medium">IP Address</div>
                <div className="text-sm col-span-2">{device.ipAddress || 'Not set'}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-1 py-2 border-b border-gray-100 dark:border-gray-800">
                <div className="text-sm font-medium">MAC Address</div>
                <div className="text-sm col-span-2">{device.macAddress || 'Not set'}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-1 py-2 border-b border-gray-100 dark:border-gray-800">
                <div className="text-sm font-medium">Total Ports</div>
                <div className="text-sm col-span-2">{device.ports.length}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-1 py-2 border-b border-gray-100 dark:border-gray-800">
                <div className="text-sm font-medium">Connected Ports</div>
                <div className="text-sm col-span-2">
                  {device.ports.filter(port => port.status === 'connected').length}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-1 py-2">
                <div className="text-sm font-medium">Added</div>
                <div className="text-sm col-span-2">
                  {device.addedAt.toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card glass-card-hover lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Ports</CardTitle>
            <CardDescription>Click on a port to configure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {device.ports.map(port => (
                <Button
                  key={port.id}
                  variant="outline"
                  className={`h-auto flex flex-col items-center justify-center py-3 px-2 border-2 ${
                    port.status === 'connected' ? 'border-primary' : 
                    port.status === 'disabled' ? 'border-gray-300 dark:border-gray-700 opacity-50' : 
                    port.status === 'error' ? 'border-destructive' : 
                    'border-gray-200 dark:border-gray-800'
                  }`}
                  onClick={() => handlePortClick(port)}
                >
                  <span className="text-sm font-medium mb-1">{port.number}</span>
                  <PortStatusBadge status={port.status} />
                  {port.vlans.length > 0 && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {port.vlans.length} VLANs
                    </div>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {device.notes && (
        <Card className="glass-card glass-card-hover mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{device.notes}</p>
          </CardContent>
        </Card>
      )}
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <EquipmentForm 
            equipment={device}
            onClose={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Sheet open={portSheetOpen} onOpenChange={setPortSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Configure Port {selectedPort?.number}</SheetTitle>
            <SheetDescription>
              Adjust port status and VLAN configuration
            </SheetDescription>
          </SheetHeader>
          
          {selectedPort && (
            <div className="py-6">
              <PortConfiguration 
                port={selectedPort}
                onUpdate={handlePortUpdate}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

const DeviceDetails = () => {
  return (
    <EquipmentProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        <PageContainer title="Device Details">
          <DeviceDetailsContent />
        </PageContainer>
      </div>
    </EquipmentProvider>
  );
};

export default DeviceDetails;
