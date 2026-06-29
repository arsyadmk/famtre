import React from 'react';
import { Heart, Calendar } from 'lucide-react';

export default function PersonCard({ person, onSelect, isActive }) {
  const isMale = person.gender === 'male';
  
  return (
    <div 
      onClick={() => onSelect(person)}
      className={`p-4 bg-white rounded-xl shadow-sm border-2 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 w-64
        ${isActive ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-100'}
      `}
    >
      <div className="flex items-center gap-3">
        <img 
          src={person.avatarUrl} 
          alt={person.firstName} 
          className={`w-12 h-12 rounded-full border-2 ${isMale ? 'border-blue-200 bg-blue-50' : 'border-pink-200 bg-pink-50'}`}
        />
        <div className="overflow-hidden">
          <h3 className="font-semibold text-slate-800 truncate">
            {person.firstName} {person.lastName}
          </h3>
          {person.maidenName && (
            <p className="text-xs text-slate-400 italic truncate">née {person.maidenName}</p>
          )}
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
            <Calendar size={12} />
            <span>{person.birthDate.split('-')[0]}</span>
            {person.isDeceased && <span> – {person.deathDate.split('-')[0]}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}