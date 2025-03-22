
import React, { useCallback, useEffect, useState } from 'react';
import { useEquipment } from '@/context/EquipmentContext';
import { Equipment, Connection } from '@/types/equipment';
import { Network, Wifi, Router, Server, Monitor } from 'lucide-react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection as FlowConnection,
} from 'reactflow';
import 'reactflow/dist/style.css';

type CustomNodeData = {
  equipment: Equipment;
  name: string;
  type: string;
};

const NetworkDiagram: React.FC = () => {
  const { equipment, connections } = useEquipment();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Transform equipment to nodes
  useEffect(() => {
    if (equipment.length > 0) {
      // We need to calculate positions to avoid overlap
      // For this simple version, we'll arrange them in a grid
      const nodesPerRow = 4;
      const horizontalSpacing = 300;
      const verticalSpacing = 150;
      
      const newNodes: Node<CustomNodeData>[] = equipment.map((eq, index) => {
        const row = Math.floor(index / nodesPerRow);
        const col = index % nodesPerRow;
        
        return {
          id: eq.id,
          position: {
            x: col * horizontalSpacing + 100,
            y: row * verticalSpacing + 100
          },
          data: {
            equipment: eq,
            name: eq.name,
            type: eq.type,
          },
          type: 'deviceNode',
        };
      });
      
      setNodes(newNodes);
    }
  }, [equipment, setNodes]);

  // Transform connections to edges
  useEffect(() => {
    if (connections.length > 0) {
      const newEdges: Edge[] = connections.map((conn) => ({
        id: conn.id,
        source: conn.sourceId,
        target: conn.targetId,
        animated: conn.status === 'active',
        style: { 
          strokeWidth: 2,
          stroke: getConnectionColor(conn.status),
        },
        label: `${conn.sourcePort} → ${conn.targetPort}`,
      }));
      
      setEdges(newEdges);
    }
  }, [connections, setEdges]);

  const onConnect = useCallback(
    (params: FlowConnection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Helper function to get color based on connection status
  function getConnectionColor(status: Connection['status']) {
    switch (status) {
      case 'active':
        return '#4299e1'; // blue-500
      case 'warning':
        return '#f59e0b'; // amber-500
      case 'error':
        return '#ef4444'; // red-500
      case 'inactive':
      default:
        return '#a0aec0'; // gray-400
    }
  }

  // Custom node for network devices
  const DeviceNode: React.FC<{ data: CustomNodeData }> = ({ data }) => {
    const getIcon = () => {
      const iconClass = "h-5 w-5";
      
      switch (data.type) {
        case 'switch':
          return <Network className={iconClass} />;
        case 'accessPoint':
          return <Wifi className={iconClass} />;
        case 'router':
          return <Router className={iconClass} />;
        case 'server':
          return <Server className={iconClass} />;
        default:
          return <Monitor className={iconClass} />;
      }
    };
    
    const getNodeColor = () => {
      switch (data.type) {
        case 'switch':
          return 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700';
        case 'router':
          return 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700';
        case 'accessPoint':
          return 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700';
        case 'server':
          return 'bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700';
        default:
          return 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700';
      }
    };
  
    return (
      <div className={`p-4 rounded-lg shadow-lg border ${getNodeColor()} min-w-[180px]`}>
        <div className="flex items-center gap-2">
          <div className="rounded-md p-1.5 bg-white dark:bg-gray-800">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{data.name}</div>
            <div className="text-xs text-muted-foreground">
              {data.equipment.ipAddress || 'No IP'}
            </div>
          </div>
        </div>
        <div className="mt-2 text-xs">
          <span className="opacity-70">Ports: </span>
          <span className="font-medium">
            {data.equipment.ports.filter(p => p.status === 'connected').length}/
            {data.equipment.ports.length}
          </span>
        </div>
      </div>
    );
  };

  const nodeTypes = {
    deviceNode: DeviceNode,
  };

  return (
    <div className="w-full h-[600px] border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap 
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
        <Background gap={16} size={1} />
      </ReactFlow>
    </div>
  );
};

export default NetworkDiagram;
