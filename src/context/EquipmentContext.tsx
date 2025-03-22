
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Equipment, Connection, EquipmentType, Port, VlanConfig } from '../types/equipment';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

interface EquipmentContextType {
  equipment: Equipment[];
  connections: Connection[];
  addEquipment: (equipment: Omit<Equipment, 'id' | 'addedAt' | 'lastUpdated'>) => void;
  updateEquipment: (equipment: Equipment) => void;
  deleteEquipment: (id: string) => void;
  getEquipmentById: (id: string) => Equipment | undefined;
  addConnection: (connection: Omit<Connection, 'id'>) => void;
  updateConnection: (connection: Connection) => void;
  deleteConnection: (id: string) => void;
  generatePorts: (count: number) => Port[];
}

// Sample VLAN configurations
const sampleVlans: VlanConfig[] = [
  { id: 1, name: 'Default', tagged: false },
  { id: 10, name: 'Management', tagged: true },
  { id: 20, name: 'Voice', tagged: true },
  { id: 30, name: 'Guest', tagged: true },
];

// Initial equipment data
const initialEquipment: Equipment[] = [
  {
    id: '1',
    name: 'Core Switch',
    type: 'switch',
    model: 'Cisco Catalyst 9300',
    location: 'Main Server Room',
    ipAddress: '192.168.1.1',
    macAddress: '00:1A:2B:3C:4D:5E',
    ports: Array.from({ length: 24 }, (_, i) => ({
      id: uuidv4(),
      number: i + 1,
      status: Math.random() > 0.3 ? 'connected' : 'disconnected',
      vlans: [...sampleVlans],
    })),
    notes: 'Main core switch handling all inter-VLAN routing',
    addedAt: new Date('2023-01-15'),
    lastUpdated: new Date('2023-06-20'),
  },
  {
    id: '2',
    name: 'Edge Router',
    type: 'router',
    model: 'Cisco ISR 4351',
    location: 'Main Server Room',
    ipAddress: '192.168.1.254',
    macAddress: '00:2B:3C:4D:5E:6F',
    ports: Array.from({ length: 8 }, (_, i) => ({
      id: uuidv4(),
      number: i + 1,
      status: i < 2 ? 'connected' : 'disconnected',
      vlans: [sampleVlans[0]],
    })),
    notes: 'Edge router connecting to ISP',
    addedAt: new Date('2023-01-10'),
    lastUpdated: new Date('2023-05-15'),
  },
  {
    id: '3',
    name: 'Office AP-1',
    type: 'accessPoint',
    model: 'Cisco Meraki MR46',
    location: 'East Wing',
    ipAddress: '192.168.1.10',
    macAddress: '00:3C:4D:5E:6F:7G',
    ports: Array.from({ length: 1 }, (_, i) => ({
      id: uuidv4(),
      number: i + 1,
      status: 'connected',
      vlans: [sampleVlans[0], sampleVlans[3]],
    })),
    notes: 'Covers the east wing office area',
    addedAt: new Date('2023-02-20'),
    lastUpdated: new Date('2023-06-05'),
  },
  {
    id: '4',
    name: 'Access Switch 1',
    type: 'switch',
    model: 'Cisco Catalyst 2960',
    location: 'First Floor IDF',
    ipAddress: '192.168.1.2',
    macAddress: '00:4D:5E:6F:7G:8H',
    ports: Array.from({ length: 48 }, (_, i) => ({
      id: uuidv4(),
      number: i + 1,
      status: Math.random() > 0.6 ? 'connected' : 'disconnected',
      vlans: i < 4 ? [...sampleVlans] : [sampleVlans[0], sampleVlans[2], sampleVlans[3]],
    })),
    notes: 'Serves first floor client devices',
    addedAt: new Date('2023-01-25'),
    lastUpdated: new Date('2023-04-10'),
  },
];

// Initial connection data
const initialConnections: Connection[] = [
  {
    id: '1',
    sourceId: '1', // Core Switch
    sourcePort: 1,
    targetId: '2', // Edge Router
    targetPort: 1,
    status: 'active',
  },
  {
    id: '2',
    sourceId: '1', // Core Switch
    sourcePort: 2,
    targetId: '4', // Access Switch 1
    targetPort: 1,
    status: 'active',
  },
  {
    id: '3',
    sourceId: '4', // Access Switch 1
    sourcePort: 2,
    targetId: '3', // Office AP-1
    targetPort: 1,
    status: 'active',
  },
];

export const EquipmentContext = createContext<EquipmentContextType>({
  equipment: [],
  connections: [],
  addEquipment: () => {},
  updateEquipment: () => {},
  deleteEquipment: () => {},
  getEquipmentById: () => undefined,
  addConnection: () => {},
  updateConnection: () => {},
  deleteConnection: () => {},
  generatePorts: () => [],
});

export const useEquipment = () => useContext(EquipmentContext);

export const EquipmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [connections, setConnections] = useState<Connection[]>(initialConnections);

  // Load from localStorage on initial render
  useEffect(() => {
    const storedEquipment = localStorage.getItem('networkEquipment');
    const storedConnections = localStorage.getItem('networkConnections');

    if (storedEquipment) {
      try {
        const parsedEquipment = JSON.parse(storedEquipment);
        // Convert string dates back to Date objects
        const processedEquipment = parsedEquipment.map((eq: any) => ({
          ...eq,
          addedAt: new Date(eq.addedAt),
          lastUpdated: new Date(eq.lastUpdated),
        }));
        setEquipment(processedEquipment);
      } catch (error) {
        console.error('Failed to parse stored equipment:', error);
      }
    }

    if (storedConnections) {
      try {
        setConnections(JSON.parse(storedConnections));
      } catch (error) {
        console.error('Failed to parse stored connections:', error);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('networkEquipment', JSON.stringify(equipment));
    localStorage.setItem('networkConnections', JSON.stringify(connections));
  }, [equipment, connections]);

  const getEquipmentById = (id: string) => {
    return equipment.find(eq => eq.id === id);
  };

  const addEquipment = (newEquipment: Omit<Equipment, 'id' | 'addedAt' | 'lastUpdated'>) => {
    const now = new Date();
    const equipmentWithId: Equipment = {
      ...newEquipment,
      id: uuidv4(),
      addedAt: now,
      lastUpdated: now,
    };

    setEquipment(prev => [...prev, equipmentWithId]);
    toast.success(`Added ${newEquipment.name}`);
  };

  const updateEquipment = (updatedEquipment: Equipment) => {
    setEquipment(prev => 
      prev.map(eq => 
        eq.id === updatedEquipment.id 
          ? { ...updatedEquipment, lastUpdated: new Date() } 
          : eq
      )
    );
    toast.success(`Updated ${updatedEquipment.name}`);
  };

  const deleteEquipment = (id: string) => {
    const equipmentToDelete = equipment.find(eq => eq.id === id);
    
    // First, delete any connections involving this equipment
    setConnections(prev => 
      prev.filter(conn => conn.sourceId !== id && conn.targetId !== id)
    );
    
    // Then delete the equipment
    setEquipment(prev => prev.filter(eq => eq.id !== id));
    
    if (equipmentToDelete) {
      toast.success(`Deleted ${equipmentToDelete.name}`);
    }
  };

  const addConnection = (newConnection: Omit<Connection, 'id'>) => {
    const connectionWithId: Connection = {
      ...newConnection,
      id: uuidv4(),
    };

    // Check if connection already exists
    const exists = connections.some(
      conn => 
        (conn.sourceId === newConnection.sourceId && 
         conn.sourcePort === newConnection.sourcePort &&
         conn.targetId === newConnection.targetId &&
         conn.targetPort === newConnection.targetPort) ||
        (conn.sourceId === newConnection.targetId &&
         conn.sourcePort === newConnection.targetPort &&
         conn.targetId === newConnection.sourceId &&
         conn.targetPort === newConnection.sourcePort)
    );

    if (exists) {
      toast.error('Connection already exists');
      return;
    }

    setConnections(prev => [...prev, connectionWithId]);
    
    // Update port status for connected equipment
    setEquipment(prev => 
      prev.map(eq => {
        if (eq.id === newConnection.sourceId || eq.id === newConnection.targetId) {
          const updatedPorts = eq.ports.map(port => {
            if ((eq.id === newConnection.sourceId && port.number === newConnection.sourcePort) ||
                (eq.id === newConnection.targetId && port.number === newConnection.targetPort)) {
              return {
                ...port,
                status: 'connected',
                connectedToId: eq.id === newConnection.sourceId ? newConnection.targetId : newConnection.sourceId,
                connectedToPort: eq.id === newConnection.sourceId ? newConnection.targetPort : newConnection.sourcePort,
              };
            }
            return port;
          });
          
          return {
            ...eq,
            ports: updatedPorts,
            lastUpdated: new Date(),
          };
        }
        return eq;
      })
    );

    toast.success('Connection added');
  };

  const updateConnection = (updatedConnection: Connection) => {
    setConnections(prev => 
      prev.map(conn => 
        conn.id === updatedConnection.id 
          ? updatedConnection 
          : conn
      )
    );
    toast.success('Connection updated');
  };

  const deleteConnection = (id: string) => {
    const connectionToDelete = connections.find(conn => conn.id === id);
    
    if (connectionToDelete) {
      // Update port status for disconnected equipment
      setEquipment(prev => 
        prev.map(eq => {
          if (eq.id === connectionToDelete.sourceId || eq.id === connectionToDelete.targetId) {
            const updatedPorts = eq.ports.map(port => {
              if ((eq.id === connectionToDelete.sourceId && port.number === connectionToDelete.sourcePort) ||
                  (eq.id === connectionToDelete.targetId && port.number === connectionToDelete.targetPort)) {
                return {
                  ...port,
                  status: 'disconnected',
                  connectedToId: undefined,
                  connectedToPort: undefined,
                };
              }
              return port;
            });
            
            return {
              ...eq,
              ports: updatedPorts,
              lastUpdated: new Date(),
            };
          }
          return eq;
        })
      );
    }
    
    setConnections(prev => prev.filter(conn => conn.id !== id));
    toast.success('Connection removed');
  };

  const generatePorts = (count: number): Port[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: uuidv4(),
      number: i + 1,
      status: 'disconnected',
      vlans: [{ id: 1, name: 'Default', tagged: false }],
    }));
  };

  return (
    <EquipmentContext.Provider
      value={{
        equipment,
        connections,
        addEquipment,
        updateEquipment,
        deleteEquipment,
        getEquipmentById,
        addConnection,
        updateConnection,
        deleteConnection,
        generatePorts,
      }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};
