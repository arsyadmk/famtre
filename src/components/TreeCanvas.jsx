import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, MarkerType } from '@xyflow/react';
import dagre from '@dagrejs/dagre';
import FamilyNode from './FamilyNode'; 
import '@xyflow/react/dist/style.css';

const dagreGraph = new dagre.graphlib.Graph();

dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 220;
const nodeHeight = 100;

function getLayoutedElements(nodes, edges) {
  dagreGraph.setGraph({
    rankdir: 'TB', // Top -> Bottom
    nodesep: 60,
    ranksep: 120,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: nodeWidth,
      height: nodeHeight,
    });
  });

  const layoutEdges = edges.filter(
      (e) => !e.id.startsWith("spouse-")
  );

  layoutEdges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const pos = dagreGraph.node(node.id);

    node.position = {
      x: pos.x - nodeWidth / 2,
      y: pos.y - nodeHeight / 2,
    };
  });

  return { nodes, edges };
}

const nodeTypes = {
  familyNode: FamilyNode,
};

export default function TreeCanvas({ people, onSelectPerson }) {
  
  const { nodes, edges } = useMemo(() => {
    const generatedNodes = [];
    const generatedEdges = [];

    people.forEach((person, index) => {
      // Fallback baseline positions if no condition is met
      let x = 250 * index; 
      let y = 300; 

      // 1. Build Node using our custom type (Casting IDs to strings for React Flow)
      generatedNodes.push({
          id: person.id.toString(),
          type: 'familyNode',
          position: { x: 0, y: 0 },
          data: {
              person,
          },
      });

      // 2. Build Bloodline Connection Edges (Parents -> Children)
      if (person.fatherId) {
        generatedEdges.push({
          id: `e-${person.fatherId.toString()}-${person.id.toString()}`,
          source: person.fatherId.toString(),
          target: person.id.toString(),
          style: { stroke: '#94a3b8', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' }
        });
      }
      if (person.motherId) {
        generatedEdges.push({
          id: `e-${person.motherId.toString()}-${person.id.toString()}`,
          source: person.motherId.toString(),
          target: person.id.toString(),
          style: { stroke: '#94a3b8', strokeWidth: 2 }
        });
      }

      // 3. Build Marriage Spousal Edges
      person.spouseIds.forEach(spouseId => {
        if (person.id < spouseId) {
          generatedEdges.push({
            id: `spouse-${person.id}-${spouseId}`,
            source: person.id.toString(),
            target: spouseId.toString(),

            sourceHandle: 'spouse-right',
            targetHandle: 'spouse-left',

            type: 'straight',

            style: {
              stroke: '#f43f5e',
              strokeWidth: 2,
              strokeDasharray: '6 4',
            },
          });
        }
      });
    });

    return getLayoutedElements(
      generatedNodes,
      generatedEdges
    );
  }, [people]);

  const onNodeClick = (event, node) => {
    const clickedPerson = people.find(p => p.id === Number(node.id));
    if (clickedPerson) onSelectPerson(clickedPerson);
  };

  return (
    <div className="w-full h-full bg-slate-100 relative">
      <ReactFlow 
        nodes={nodes} 
        edges={edges}
        nodeTypes={nodeTypes} 
        onNodeClick={onNodeClick}
        fitView
      >
        <Background color="#cbd5e1" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

