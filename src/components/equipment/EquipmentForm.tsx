
import React, { useState, useEffect } from 'react';
import { useEquipment } from '@/context/EquipmentContext';
import { Equipment, EquipmentType } from '@/types/equipment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import PortConfiguration from './PortConfiguration';

interface EquipmentFormProps {
  equipment?: Equipment | null;
  onClose: () => void;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({ equipment, onClose }) => {
  const { addEquipment, updateEquipment, generatePorts } = useEquipment();

  const [formData, setFormData] = useState<Partial<Equipment>>({
    name: '',
    type: 'switch',
    model: '',
    location: '',
    ipAddress: '',
    macAddress: '',
    ports: [],
    notes: '',
  });
  
  const [portCount, setPortCount] = useState(24);
  
  // Initialize form with equipment data if editing
  useEffect(() => {
    if (equipment) {
      setFormData({
        ...equipment,
      });
      setPortCount(equipment.ports.length);
    } else {
      // Default values for new equipment
      setFormData({
        name: '',
        type: 'switch',
        model: '',
        location: '',
        ipAddress: '',
        macAddress: '',
        ports: generatePorts(portCount),
        notes: '',
      });
    }
  }, [equipment, generatePorts, portCount]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      type: value as EquipmentType,
    }));
  };
  
  const handlePortCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    if (count > 0 && count <= 96) {
      setPortCount(count);
      
      // Only regenerate ports if this is a new device or if the new count is higher
      if (!equipment || count > formData.ports?.length) {
        setFormData(prev => ({
          ...prev,
          ports: generatePorts(count),
        }));
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (equipment) {
      // Update existing equipment
      updateEquipment({
        ...equipment,
        ...formData,
      } as Equipment);
    } else {
      // Add new equipment
      addEquipment(formData as Omit<Equipment, 'id' | 'addedAt' | 'lastUpdated'>);
    }
    
    onClose();
  };
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>{equipment ? 'Edit' : 'Add'} Network Equipment</DialogTitle>
          <DialogDescription>
            {equipment 
              ? 'Update the details of your network device.' 
              : 'Add a new device to your network inventory.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Device Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Core Switch 01"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Device Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={handleTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="switch">Switch</SelectItem>
                  <SelectItem value="router">Router</SelectItem>
                  <SelectItem value="accessPoint">Access Point</SelectItem>
                  <SelectItem value="server">Server</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Cisco Catalyst 9300"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Main Server Room"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ipAddress">IP Address</Label>
              <Input
                id="ipAddress"
                name="ipAddress"
                value={formData.ipAddress}
                onChange={handleChange}
                placeholder="192.168.1.1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="macAddress">MAC Address</Label>
              <Input
                id="macAddress"
                name="macAddress"
                value={formData.macAddress}
                onChange={handleChange}
                placeholder="00:1A:2B:3C:4D:5E"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="portCount">Number of Ports</Label>
            <Input
              id="portCount"
              type="number"
              min="1"
              max="96"
              value={portCount}
              onChange={handlePortCountChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional information about this device"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit">{equipment ? 'Update' : 'Add'} Device</Button>
        </DialogFooter>
      </form>
    </>
  );
};

export default EquipmentForm;
