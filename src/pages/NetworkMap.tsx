
import React from 'react';
import { EquipmentProvider } from '@/context/EquipmentContext';
import PageContainer from '@/components/layout/PageContainer';
import Sidebar from '@/components/layout/Sidebar';
import NetworkDiagram from '@/components/network/NetworkDiagram';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const NetworkMapContent = () => {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Network Topology</h1>
        <p className="text-muted-foreground">
          Interactive visual map of your network's physical and logical connections
        </p>
      </div>
      
      <Card className="glass-card glass-card-hover mb-6">
        <CardHeader>
          <CardTitle className="text-md">Network Diagram</CardTitle>
          <CardDescription>
            Drag nodes to rearrange. Hover over connections to see details.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[700px] p-0 rounded-b-lg overflow-hidden">
          <NetworkDiagram />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="glass-card p-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-blue-500"></div>
            <span className="text-sm">Switches</span>
          </div>
        </Card>
        <Card className="glass-card p-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-red-500"></div>
            <span className="text-sm">Routers</span>
          </div>
        </Card>
        <Card className="glass-card p-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-green-500"></div>
            <span className="text-sm">Access Points</span>
          </div>
        </Card>
      </div>
    </>
  );
};

const NetworkMap = () => {
  return (
    <EquipmentProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        <PageContainer title="Network Map">
          <NetworkMapContent />
        </PageContainer>
      </div>
    </EquipmentProvider>
  );
};

export default NetworkMap;
