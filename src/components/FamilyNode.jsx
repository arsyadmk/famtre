import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Calendar } from 'lucide-react';
import { getAvatarUrl, calculateAge } from '../utils/helpers';

export default function FamilyNode({ data }) {
  const { person } = data;
  const isMale = person.gender === 'male';

  // Deceased status derived directly from deathDate presence
  const isDeceased = Boolean(person.deathDate);

  // Calculate birth year and death year safely
  const birthYear = person.birthDate ? person.birthDate.split('-')[0] : null;
  const deathYear = person.deathDate ? person.deathDate.split('-')[0] : null;

  // Calculate correct age (age at death if deceased, current age if living)
  const displayAge = isDeceased
    ? calculateAge(person.birthDate, person.deathDate)
    : calculateAge(person.birthDate);

  return (
    <div className={`p-3 bg-white rounded-xl shadow-md border-2 min-w-[220px] transition-all hover:shadow-lg relative
      ${isMale ? 'border-blue-400 bg-gradient-to-br from-white to-blue-50/20' : 'border-pink-400 bg-gradient-to-br from-white to-pink-50/20'}
    `}>
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        className="!bg-slate-400 !w-3 !h-3"
      />

      <div className="flex items-center gap-3">
        <img 
          src={getAvatarUrl(person)} 
          alt={`${person.firstName} avatar`} 
          className="w-12 h-12 rounded-full border-2 object-cover shrink-0"
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
            <Calendar size={10} className="text-slate-400 shrink-0" />
            <span>
              {birthYear && (
                <>
                  {birthYear}
                  {isDeceased ? ` – ${deathYear}` : ''}
                  {displayAge !== null && ` (${displayAge} yrs)`}
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="source-bottom"
        className="!bg-slate-400 !w-3 !h-3"
      />

      {/* SPOUSE HANDLES - Centered vertically at exactly 50% */}
      <Handle
        type="source"
        id="spouse-right"
        position={Position.Right}
        style={{ top: '50%' }}
        className="!bg-pink-400 !w-2.5 !h-2.5"
      />
      <Handle
        type="target"
        id="spouse-left"
        position={Position.Left}
        style={{ top: '50%' }}
        className="!bg-pink-400 !w-2.5 !h-2.5"
      />
    </div>
  );
}