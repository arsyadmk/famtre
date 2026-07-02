import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Calendar } from 'lucide-react';

export default function FamilyNode({ data }) {
  const { person } = data;
  const isMale = person.gender === 'male';

  // Helper to generate a gender-accurate Notionist avatar URL
  const getGenderedAvatar = (p) => {
    // Use a different seed base for male vs female to completely separate the lookups
    // Adding a prefix like "man-" or "woman-" forces DiceBear's seed algorithm to choose a matching silhouette
    const genderPrefix = p.gender === 'male' ? 'man' : 'woman';
    
    // Clean URL that works perfectly without strict parameter validation errors
    return `https://api.dicebear.com/7.x/notionists/svg?seed=${genderPrefix}-${p.id}`;
  };

  const avatarSrc = getGenderedAvatar(person);

  return (
    <div className={`p-3 bg-white rounded-xl shadow-md border-2 min-w-[220px] transition-all hover:shadow-lg
      ${isMale ? 'border-blue-400 bg-gradient-to-br from-white to-blue-50/20' : 'border-pink-400 bg-gradient-to-br from-white to-pink-50/20'}
    `}>
      <Handle type="target" position={Position.Top} className="!bg-slate-400 !w-2 !h-2" />

      <div className="flex items-center gap-3">
        <img 
        src={person.avatarUrl} // <-- Read straight from JSON link!
        alt={`${person.firstName} avatar`} 
        className={`w-12 h-12 rounded-full border-2 object-cover shrink-0
            ${isMale ? 'border-blue-200 bg-blue-50' : 'border-pink-200 bg-pink-50'}
        `}
        />
        
        <div className="overflow-hidden">
          <h4 className="font-bold text-slate-800 text-sm truncate">
            {person.firstName} {person.lastName}
          </h4>

          {person.callName && (
            <p className="text-xs text-slate-500 italic truncate">
              "{person.callName}"
            </p>
          )}

          {person.maidenName && (
            <p className="text-[10px] text-slate-400 italic truncate -mt-0.5">
              née {person.maidenName}
            </p>
          )}

          <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
            <Calendar size={10} className="text-slate-400" />
            <span>
              {person.birthDate && (
                <>{new Date().getFullYear() - new Date(person.birthDate).getFullYear()} years old</>
              )}
            </span>
            <span>{person.birthDate?.split('-')[0]}</span>
            {person.isDeceased && <span> – {person.deathDate?.split('-')[0]}</span>}
          </div>
        </div>
      </div>

      <Handle
        type="target"
        id="parent"
        position={Position.Top}
        className="!bg-slate-400 !w-2 !h-2"
      />

      <Handle
        type="source"
        id="child"
        position={Position.Bottom}
        className="!bg-slate-400 !w-2 !h-2"
      />

      <Handle
        type="source"
        id="spouse-right"
        position={Position.Right}
        className="!bg-pink-400 !w-2 !h-2"
        style={{
          top: '50%',
          right: -5,
          transform: 'translateY(-50%)',
        }}
      />

      <Handle
        type="target"
        id="spouse-left"
        position={Position.Left}
        className="!bg-pink-400 !w-2 !h-2"
        style={{
          top: '50%',
          left: -5,
          transform: 'translateY(-50%)',
        }}
      />
    </div>
  );
}