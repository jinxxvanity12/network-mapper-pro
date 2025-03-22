
import React, { useState } from 'react';
import { Equipment } from '@/types/equipment';
import EquipmentCard from './EquipmentCard';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import EquipmentForm from './EquipmentForm';

interface EquipmentGridProps {
  equipment: Equipment[];
}

const EquipmentGrid: React.FC<EquipmentGridProps> = ({ equipment }) => {
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleEdit = (eq: Equipment) => {
    setEditingEquipment(eq);
    setDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingEquipment(null);
  };

  if (equipment.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No equipment found. Add your first device to get started.</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {equipment.map(eq => (
          <EquipmentCard 
            key={eq.id} 
            equipment={eq} 
            onEdit={() => handleEdit(eq)} 
          />
        ))}
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <EquipmentForm 
            equipment={editingEquipment}
            onClose={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EquipmentGrid;
