
import React, { useState } from 'react';
import { EquipmentProvider, useEquipment } from '@/context/EquipmentContext';
import PageContainer from '@/components/layout/PageContainer';
import Sidebar from '@/components/layout/Sidebar';
import EquipmentGrid from '@/components/equipment/EquipmentGrid';
import EquipmentForm from '@/components/equipment/EquipmentForm';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { EquipmentType } from '@/types/equipment';
import { Input } from '@/components/ui/input';

const EquipmentContent = () => {
  const { equipment } = useEquipment();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  
  const filteredEquipment = equipment.filter(eq => {
    const matchesSearch = 
      searchTerm === '' || 
      eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
      eq.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.ipAddress?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = selectedType === 'all' || eq.type === selectedType;
    
    return matchesSearch && matchesType;
  });
  
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Network Equipment</h1>
          <p className="text-muted-foreground">
            Manage your network devices and their configurations
          </p>
        </div>
        
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Device
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center">
        <div className="relative w-full sm:w-96">
          <Input
            placeholder="Search equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>
        
        <div className="flex items-center w-full sm:w-auto">
          <div className="flex items-center mr-2">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter:</span>
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="switch">Switches</SelectItem>
              <SelectItem value="router">Routers</SelectItem>
              <SelectItem value="accessPoint">Access Points</SelectItem>
              <SelectItem value="server">Servers</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <EquipmentGrid equipment={filteredEquipment} />
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <EquipmentForm onClose={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

const EquipmentPage = () => {
  return (
    <EquipmentProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        <PageContainer title="Equipment">
          <EquipmentContent />
        </PageContainer>
      </div>
    </EquipmentProvider>
  );
};

export default EquipmentPage;
