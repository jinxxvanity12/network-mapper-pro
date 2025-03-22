
import React, { useState } from 'react';
import { Port, VlanConfig } from '@/types/equipment';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from '@/components/ui/checkbox';

interface PortConfigurationProps {
  port: Port;
  onUpdate: (updatedPort: Port) => void;
}

const PortConfiguration: React.FC<PortConfigurationProps> = ({ port, onUpdate }) => {
  const [editingVlan, setEditingVlan] = useState<VlanConfig | null>(null);
  const [newVlan, setNewVlan] = useState<Partial<VlanConfig>>({
    id: 1,
    name: '',
    tagged: true,
  });
  
  const handleStatusChange = (value: string) => {
    onUpdate({
      ...port,
      status: value as Port['status'],
    });
  };
  
  const handleAddVlan = () => {
    if (newVlan.id && newVlan.name) {
      const vlanExists = port.vlans.some(v => v.id === newVlan.id);
      
      if (vlanExists) {
        // Show error notification
        return;
      }
      
      const newVlanConfig: VlanConfig = {
        id: newVlan.id as number,
        name: newVlan.name as string,
        tagged: newVlan.tagged as boolean,
      };
      
      onUpdate({
        ...port,
        vlans: [...port.vlans, newVlanConfig],
      });
      
      // Reset new VLAN form
      setNewVlan({
        id: 1,
        name: '',
        tagged: true,
      });
    }
  };
  
  const handleEditVlan = (vlan: VlanConfig) => {
    setEditingVlan(vlan);
    setNewVlan({
      id: vlan.id,
      name: vlan.name,
      tagged: vlan.tagged,
    });
  };
  
  const handleUpdateVlan = () => {
    if (editingVlan && newVlan.id && newVlan.name) {
      const updatedVlans = port.vlans.map(vlan => 
        vlan.id === editingVlan.id 
          ? { 
              id: newVlan.id as number, 
              name: newVlan.name as string, 
              tagged: newVlan.tagged as boolean 
            } 
          : vlan
      );
      
      onUpdate({
        ...port,
        vlans: updatedVlans,
      });
      
      setEditingVlan(null);
      setNewVlan({
        id: 1,
        name: '',
        tagged: true,
      });
    }
  };
  
  const handleDeleteVlan = (vlanId: number) => {
    const updatedVlans = port.vlans.filter(vlan => vlan.id !== vlanId);
    
    onUpdate({
      ...port,
      vlans: updatedVlans,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">Port {port.number}</h3>
          <p className="text-sm text-muted-foreground">Configure port settings</p>
        </div>
        
        <div className="flex items-center">
          <Label htmlFor={`status-${port.id}`} className="mr-2">Status:</Label>
          <Select value={port.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="connected">Connected</SelectItem>
              <SelectItem value="disconnected">Disconnected</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">VLAN Configuration</h4>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">Add VLAN</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add VLAN to Port {port.number}</DialogTitle>
                <DialogDescription>
                  Configure a new VLAN for this port.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vlan-id">VLAN ID</Label>
                    <Input
                      id="vlan-id"
                      type="number"
                      min="1"
                      max="4094"
                      value={newVlan.id}
                      onChange={(e) => setNewVlan({ ...newVlan, id: parseInt(e.target.value) })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vlan-name">VLAN Name</Label>
                    <Input
                      id="vlan-name"
                      value={newVlan.name}
                      onChange={(e) => setNewVlan({ ...newVlan, name: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tagged"
                    checked={newVlan.tagged}
                    onCheckedChange={(checked) => setNewVlan({ ...newVlan, tagged: !!checked })}
                  />
                  <Label htmlFor="tagged">Tagged</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={editingVlan ? handleUpdateVlan : handleAddVlan}>
                  {editingVlan ? 'Update' : 'Add'} VLAN
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {port.vlans.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>VLAN ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Tagged</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {port.vlans.map((vlan) => (
                <TableRow key={vlan.id}>
                  <TableCell>{vlan.id}</TableCell>
                  <TableCell>{vlan.name}</TableCell>
                  <TableCell>
                    <Badge variant={vlan.tagged ? "default" : "secondary"}>
                      {vlan.tagged ? 'Tagged' : 'Untagged'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditVlan(vlan)}
                          >
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit VLAN</DialogTitle>
                          </DialogHeader>
                          {/* Same content as add dialog but for editing */}
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDeleteVlan(vlan.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            No VLANs configured for this port.
          </div>
        )}
      </div>
    </div>
  );
};

export default PortConfiguration;
