import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, MarkerType, Handle, Position } from '@xyflow/react';
import FamilyNode from './FamilyNode'; 
import '@xyflow/react/dist/style.css';

const NODE_WIDTH = 240;
const NODE_HEIGHT = 110;
const HORIZONTAL_GAP = 80;
const SPOUSE_GAP = 40; 
const VERTICAL_SPACING = 220;

// Marriage Hub centered precisely on the horizontal line
const MarriageHubNode = () => (
  <div className="w-3 h-3 bg-pink-500 rounded-full border-2 border-white shadow-md relative">
    <Handle 
      type="target" 
      id="hub-left" 
      position={Position.Left} 
      style={{ top: '50%', transform: 'translateY(-50%)' }}
      className="!opacity-0 !w-1 !h-1 !min-w-0 !min-h-0 !border-0" 
    />
    <Handle 
      type="source" 
      id="hub-right" 
      position={Position.Right} 
      style={{ top: '50%', transform: 'translateY(-50%)' }}
      className="!opacity-0 !w-1 !h-1 !min-w-0 !min-h-0 !border-0" 
    />
    <Handle 
      type="source" 
      id="hub-bottom" 
      position={Position.Bottom} 
      style={{ left: '50%', transform: 'translateX(-50%)' }}
      className="!opacity-0 !w-1 !h-1 !min-w-0 !min-h-0 !border-0" 
    />
  </div>
);

const nodeTypes = {
  familyNode: FamilyNode,
  marriageHub: MarriageHubNode,
};

function getLayoutedElements(nodes, edges, people) {
  // 1. Group people by generation (supports -2, -1, 0, 1, 2, etc.)
  const generations = {};
  people.forEach((p) => {
    // Default to 0 or 1 if missing, but preserve negative numbers
    const gen = p.generation !== undefined && p.generation !== null ? Number(p.generation) : 1;
    if (!generations[gen]) generations[gen] = [];
    generations[gen].push(p);
  });

  const nodePositions = new Map();

  // Find the minimum generation number to normalize spacing if needed
  const sortedGenKeys = Object.keys(generations)
    .map(Number)
    .sort((a, b) => a - b); // Sort numerically ascending (e.g., -2, -1, 0, 1)

  const minGen = sortedGenKeys.length > 0 ? sortedGenKeys[0] : 0;

  // 2. Position nodes per generation
  sortedGenKeys.forEach((gen) => {
    const members = generations[gen];
    let currentX = 0;
    const placed = new Set();

    // Multiply vertical spacing directly by relative generation index or actual value
    // Using (gen - minGen) guarantees the lowest generation starts at Y = 0
    const yPos = (gen - minGen) * VERTICAL_SPACING;

    members.forEach((person) => {
      if (placed.has(person.id)) return;

      const spouse = person.spouseId
        ? members.find((m) => m.id === person.spouseId)
        : null;

      // Position primary person
      nodePositions.set(person.id.toString(), { x: currentX, y: yPos });
      placed.add(person.id);

      // Position spouse & hub
      if (spouse && !placed.has(spouse.id)) {
        const spouseX = currentX + NODE_WIDTH + SPOUSE_GAP;
        nodePositions.set(spouse.id.toString(), { x: spouseX, y: yPos });
        placed.add(spouse.id);

        const coupleKey = [person.id, spouse.id].sort((a, b) => a - b).join('-');
        const hubX = currentX + NODE_WIDTH + (SPOUSE_GAP / 2) - 6; 
        const hubY = yPos + (NODE_HEIGHT / 2) - 6;

        nodePositions.set(`hub-${coupleKey}`, { x: hubX, y: hubY });

        currentX = spouseX;
      }

      currentX += NODE_WIDTH + HORIZONTAL_GAP;
    });
  });

  // Apply positions
  nodes.forEach((node) => {
    const pos = nodePositions.get(node.id) || { x: 0, y: 0 };
    node.position = pos;
  });

  return { nodes, edges };
}

export default function TreeCanvas({ people, onSelectPerson }) {
  const { nodes, edges } = useMemo(() => {
    const generatedNodes = [];
    const generatedEdges = [];

    // 1. Build Person Nodes
    people.forEach((person) => {
      generatedNodes.push({
        id: person.id.toString(),
        type: 'familyNode',
        position: { x: 0, y: 0 },
        data: { person },
      });
    });

    // 2. Build Spouse Connections & Marriage Hub Nodes
    people.forEach((person) => {
      if (person.spouseId && person.id < person.spouseId) {
        const coupleKey = [person.id, person.spouseId].sort((a, b) => a - b).join('-');
        const hubId = `hub-${coupleKey}`;

        generatedNodes.push({
          id: hubId,
          type: 'marriageHub',
          position: { x: 0, y: 0 },
          data: {},
        });

        // Left Spouse -> Hub (Straight line)
        generatedEdges.push({
          id: `spouse-l-${coupleKey}`,
          source: person.id.toString(),
          target: hubId,
          sourceHandle: 'spouse-right',
          targetHandle: 'hub-left',
          type: 'straight',
          style: { stroke: '#ec4899', strokeWidth: 2, strokeDasharray: '4 4' },
        });

        // Hub -> Right Spouse (Straight line)
        generatedEdges.push({
          id: `spouse-r-${coupleKey}`,
          source: hubId,
          target: person.spouseId.toString(),
          sourceHandle: 'hub-right',
          targetHandle: 'spouse-left',
          type: 'straight',
          style: { stroke: '#ec4899', strokeWidth: 2, strokeDasharray: '4 4' },
        });
      }
    });

    // 3. Connect Children directly from the Marriage Hub down
    people.forEach((person) => {
      const childId = person.id.toString();

      if (person.fatherId && person.motherId) {
        const coupleKey = [person.fatherId, person.motherId].sort((a, b) => a - b).join('-');
        const hubId = `hub-${coupleKey}`;

        generatedEdges.push({
          id: `e-hub-${hubId}-${childId}`,
          source: hubId,
          target: childId,
          sourceHandle: 'hub-bottom',
          targetHandle: 'target-top',
          type: 'smoothstep',
          style: { stroke: '#64748b', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
        });
      } else if (person.fatherId || person.motherId) {
        const parentId = (person.fatherId || person.motherId).toString();
        generatedEdges.push({
          id: `e-single-${parentId}-${childId}`,
          source: parentId,
          target: childId,
          sourceHandle: 'source-bottom',
          targetHandle: 'target-top',
          type: 'smoothstep',
          style: { stroke: '#64748b', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
        });
      }
    });

    return getLayoutedElements(generatedNodes, generatedEdges, people);
  }, [people]);

  const onNodeClick = (event, node) => {
    if (node.type === 'marriageHub') return;
    const clickedPerson = people.find((p) => p.id === Number(node.id));
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