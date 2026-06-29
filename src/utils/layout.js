/**
 * Dynamically computes X and Y positions for a family tree dataset.
 * * @param {Array} people - The raw flat array from people.json
 * @param {Object} spacing - Config for spacing out the nodes
 * @returns {Array} - Nodes array with calculated { x, y } positions
 */
export function calculateTreeLayout(people, spacing = { xGap: 250, yGap: 200 }) {
  const peopleMap = new Map(people.map(p => [p.id, p]));
  const levels = {}; // Keeps track of which person belongs to which generation level
  
  // --- PASS 1: Calculate Generation Levels (Y-Axis) ---
  function determineLevel(personId, currentLevel = 0) {
    if (!personId) return;
    
    // If the person already has a level assigned, keep the deepest one 
    // (handles complex lineages or multi-generation relationships cleanly)
    if (levels[personId] !== undefined && levels[personId] >= currentLevel) {
      return;
    }
    
    levels[personId] = currentLevel;
    const person = peopleMap.get(personId);
    
    if (person && person.childrenIds) {
      person.childrenIds.forEach(childId => {
        determineLevel(childId, currentLevel + 1);
      });
    }
  }

  // Find "Roots" (People who have no listed parents in the system)
  const roots = people.filter(p => !p.fatherId && !p.motherId);
  
  // If no pure roots exist (e.g. loops or partial data), default to everyone to kickstart traversal
  const startingNodes = roots.length > 0 ? roots : people;
  startingNodes.forEach(root => determineLevel(root.id, 0));

  // --- PASS 2: Assign Horizontal Positions (X-Axis) ---
  const levelCounts = {}; // Keeps track of how many nodes we've placed on each row so far

  return people.map(person => {
    const level = levels[person.id] || 0;
    
    // Initialize count for this level if it doesn't exist
    if (levelCounts[level] === undefined) {
      levelCounts[level] = 0;
    }

    // X calculation: index position on this level * defined horizontal gap
    const x = levelCounts[level] * spacing.xGap;
    // Y calculation: generation level * defined vertical row gap
    const y = level * spacing.yGap;

    // Increment count for the next node entering this row
    levelCounts[level]++;

    return {
      ...person,
      position: { x, y }
    };
  });
}