
import React from 'react';
import { EquipmentProvider } from '@/context/EquipmentContext';
import PageContainer from '@/components/layout/PageContainer';
import Sidebar from '@/components/layout/Sidebar';
import StatCard from '@/components/dashboard/StatCard';
import EquipmentSummary from '@/components/dashboard/EquipmentSummary';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { Network, Router, Wifi, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import NetworkDiagram from '@/components/network/NetworkDiagram';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useEquipment } from '@/context/EquipmentContext';

const DashboardContent = () => {
  const { equipment, connections } = useEquipment();
  
  // Calculate stats
  const totalDevices = equipment.length;
  const totalPorts = equipment.reduce((sum, eq) => sum + eq.ports.length, 0);
  const activePorts = equipment.reduce((sum, eq) => 
    sum + eq.ports.filter(port => port.status === 'connected').length, 0);
  const activeConnections = connections.filter(conn => conn.status === 'active').length;
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Total Devices" 
          value={totalDevices} 
          icon={<Server className="h-4 w-4" />}
          description="Network devices in inventory"
        />
        <StatCard 
          title="Switches" 
          value={equipment.filter(eq => eq.type === 'switch').length} 
          icon={<Network className="h-4 w-4" />}
          change={{ value: 12, trend: 'up' }}
        />
        <StatCard 
          title="Active Ports" 
          value={`${activePorts}/${totalPorts}`} 
          icon={<Router className="h-4 w-4" />}
          description="Connected ports"
        />
        <StatCard 
          title="Access Points" 
          value={equipment.filter(eq => eq.type === 'accessPoint').length} 
          icon={<Wifi className="h-4 w-4" />}
          change={{ value: 5, trend: 'up' }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="glass-card glass-card-hover lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-md">Network Topology</CardTitle>
                <CardDescription>Visual representation of your network</CardDescription>
              </div>
              <Link to="/network">
                <Button variant="outline" size="sm">View Full Map</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="h-[320px] p-0 rounded-b-lg overflow-hidden">
            <NetworkDiagram />
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <EquipmentSummary />
          <RecentActivity />
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Link to="/equipment">
          <Button size="lg">Manage Equipment</Button>
        </Link>
      </div>
    </>
  );
};

const Dashboard = () => {
  return (
    <EquipmentProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        <PageContainer title="Dashboard">
          <DashboardContent />
        </PageContainer>
      </div>
    </EquipmentProvider>
  );
};

export default Dashboard;
