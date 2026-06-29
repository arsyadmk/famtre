import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, MarkerType } from '@xyflow/react';
import FamilyNode from './FamilyNode'; 
import '@xyflow/react/dist/style.css';

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

      // FIXED: Checks matching your new integer JSON keys (1, 2, 3, 4)
      if (person.id === 1 || person.id === 2) {
        y = 50; // Top Layer (Grandparents)
        x = person.id === 1 ? 150 : 420;
      } else if (person.id === 3) {
        y = 250; // Middle Layer (Parents)
        x = 285;
      } else if (person.id === 4) {
        y = 450; // Bottom Layer (Children)
        x = 285;
      }

      // 1. Build Node using our custom type (Casting IDs to strings for React Flow)
      generatedNodes.push({
        id: person.id.toString(),
        type: 'familyNode', 
        position: { x, y },
        data: { person: person } 
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
            id: `spouse-${person.id.toString()}-${spouseId.toString()}`,
            source: person.id.toString(),
            target: spouseId.toString(),
            style: { stroke: '#f43f5e', strokeWidth: 2, strokeDasharray: '5,5' },
          });
        }
      });
    });

    return { nodes: generatedNodes, edges: generatedEdges };
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