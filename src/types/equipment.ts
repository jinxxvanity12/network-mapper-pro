
export type EquipmentType = 'switch' | 'router' | 'accessPoint' | 'server' | 'other';

export type PortStatus = 'connected' | 'disconnected' | 'disabled' | 'error';

export interface VlanConfig {
  id: number;
  name: string;
  tagged: boolean;
}

export interface Port {
  id: string;
  number: number;
  status: PortStatus;
  connectedToId?: string;
  connectedToPort?: number;
  vlans: VlanConfig[];
}

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  model: string;
  location: string;
  ipAddress?: string;
  macAddress?: string;
  ports: Port[];
  notes?: string;
  addedAt: Date;
  lastUpdated: Date;
}

export interface Connection {
  id: string;
  sourceId: string;
  sourcePort: number;
  targetId: string;
  targetPort: number;
  status: 'active' | 'inactive' | 'warning' | 'error';
}
