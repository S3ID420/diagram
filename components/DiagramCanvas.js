'use client';
import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  Controls,
  Background,
  addEdge,
  ConnectionLineType,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import Popup from 'reactjs-popup';
import 'reactflow/dist/style.css';
import 'reactjs-popup/dist/index.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';



function CustomNode({ data, updateNode }) {
  const handleTextareaChange = (event) => {
    updateNode(event.target.value);
  };

  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        background: 'white',
        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <textarea
        value={data.label}
        onChange={handleTextareaChange}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          outline: 'none',
          resize: 'none',
          padding: '10px',
          fontSize: '14px',
          background: 'transparent',
        }}
        placeholder="Enter node content"
      />
      
      <Handle type="target" position={Position.Left} id="target" />
      <Handle type="source" position={Position.Right} id="source" />
    </div>
  );
}

export default function DiagramCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: '1',
      type: 'custom',
      position: { x: 250, y: 100 },
      data: { label: 'Start Node' },
      style: {
        width: 250,
        height: 150,
      },
    },
  ]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nodeDimensions, setNodeDimensions] = useState({ width: 250, height: 150 });

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: ConnectionLineType.SmoothStep,
            animated: true,
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const addNode = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalSubmit = () => {
    const newNodeId = `${nodes.length + 1}`;
    const newNode = {
      id: newNodeId,
      type: 'custom',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `Node ${newNodeId}` },
      style: {
        width: nodeDimensions.width,
        height: nodeDimensions.height,
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const updateNode = useCallback(
    (id, newLabel) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, label: newLabel } }
            : node
        )
      );
    },
    [setNodes]
  );

  const nodeTypes = useMemo(
    () => ({
      custom: (props) => <CustomNode {...props} updateNode={(label) => updateNode(props.id, label)} />,
    }),
    [updateNode]
  );

  const exportToPDF = () => {
    const element = document.getElementById('diagram-container'); 
  
    
    html2canvas(element, {
      scale: 2, 
      useCORS: true, 
    })
    .then((canvas) => {
      const imgData = canvas.toDataURL('image/png'); 
  
      const doc = new jsPDF();
      doc.addImage(imgData, 'PNG', 10, 10, 180, 160); 
      doc.save('diagram.pdf'); 
    })
    .catch((err) => {
      console.error('Error capturing diagram for PDF:', err);
    });
  };

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <button
        onClick={addNode}
        style={{
          position: 'absolute',
          zIndex: 10,
          top: '10px',
          left: '10px',
          padding: '10px 15px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Add Node
      </button>

      
      <button
        onClick={exportToPDF}
        style={{
          position: 'absolute',
          zIndex: 10,
          top: '10px',
          left: '120px',
          padding: '10px 15px',
          background: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Export to PDF
      </button>

      
      <Popup open={isModalOpen} onClose={handleModalCancel} modal>
        <div style={{ padding: '20px' }}>
          <h2>Enter Node Dimensions</h2>
          <div style={{ marginBottom: '10px' }}>
            <label>
              Width:
              <input
                type="number"
                value={nodeDimensions.width}
                onChange={(e) => setNodeDimensions({ ...nodeDimensions, width: e.target.value })}
                style={{ marginLeft: '10px' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>
              Height:
              <input
                type="number"
                value={nodeDimensions.height}
                onChange={(e) => setNodeDimensions({ ...nodeDimensions, height: e.target.value })}
                style={{ marginLeft: '10px' }}
              />
            </label>
          </div>
          <div>
            <button
              onClick={handleModalSubmit}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '10px 15px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Add Node
            </button>
            <button
              onClick={handleModalCancel}
              style={{
                backgroundColor: '#f44336',
                color: 'white',
                padding: '10px 15px',
                borderRadius: '4px',
                marginLeft: '10px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Popup>

      <div id="diagram-container" style={{ height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}
