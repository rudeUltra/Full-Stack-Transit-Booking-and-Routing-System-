import React, { useEffect, useState, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';

const LINE_COLORS = {
  1: '#0072bc', // Blue Line
  2: '#00a651', // Green Line
  6: '#f58220', // Orange Line
};

const MetroMap = ({ data }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  useEffect(() => {
    const initialNodes = Object.entries(data.stations).map(([id, name], index) => ({
      id: id.toString(),
      data: { label: name },
      position: { x: (index % 3) * 260, y: Math.floor(index / 3) * 160 },
      style: {
        background: '#1a1a1a',
        color: '#f0f0f0',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        fontWeight: '500',
        fontSize: '12px',
        width: 150,
        padding: '8px 12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
      },
    }));

    const initialEdges = [];
    const seen = new Set();

    Object.entries(data.graph).forEach(([sourceId, neighbors]) => {
      neighbors.forEach((neighbor) => {
        const edgeId = [sourceId, neighbor.to].sort().join('-');
        if (!seen.has(edgeId)) {
          initialEdges.push({
            id: `e${edgeId}`,
            source: sourceId.toString(),
            target: neighbor.to.toString(),
            label: `${neighbor.weight} km`,
            animated: true,
            style: {
              stroke: LINE_COLORS[neighbor.lineId] || '#444',
              strokeWidth: 3,
            },
            labelStyle: {
              fill: 'rgba(255,255,255,0.55)',
              fontWeight: 600,
              fontSize: '11px',
            },
            labelBgStyle: {
              fill: 'rgba(13,13,13,0.85)',
              borderRadius: 4,
            },
            labelBgPadding: [4, 6],
          });
          seen.add(edgeId);
        }
      });
    });

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', background: '#0d0d0d' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background
          color="rgba(255,255,255,0.04)"
          gap={24}
          size={1}
        />
        <Controls
          style={{
            background: '#141414',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        />
      </ReactFlow>
    </div>
  );
};

export default MetroMap;
