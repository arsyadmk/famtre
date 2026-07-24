import React, { useMemo } from 'react';
import { User, Heart, Info, X } from 'lucide-react';
import { getAvatarUrl, calculateAge } from '../utils/helpers';

export default function MemberSidebar({
  selectedPerson,
  people,
  isOpen,
  onClose,
}) {
  const spouses = useMemo(() => {
    if (!selectedPerson) return [];
    return people.filter(
      (p) =>
        (selectedPerson.spouseId && p.id === selectedPerson.spouseId) ||
        p.spouseId === selectedPerson.id
    );
  }, [people, selectedPerson]);

  const children = useMemo(() => {
    if (!selectedPerson) return [];
    return people.filter(
      (p) => p.fatherId === selectedPerson.id || p.motherId === selectedPerson.id
    );
  }, [people, selectedPerson]);

  const findPersonName = (id) => {
    const found = people.find((p) => p.id === id);
    return found ? `${found.firstName} ${found.lastName}` : 'Unknown';
  };

  const renderNames = (list) =>
    list.length > 0
      ? list.map((p) => `${p.firstName} ${p.lastName}`).join(', ')
      : 'None Linked';

  // Calculate age metrics
  const isDeceased = Boolean(selectedPerson?.deathDate);

  // Age when they passed away
  const ageAtDeath = isDeceased
    ? calculateAge(selectedPerson?.birthDate, selectedPerson?.deathDate)
    : null;

  // Age they would be today (or current age if living)
  const ageToday = selectedPerson
    ? calculateAge(selectedPerson.birthDate)
    : null;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 md:hidden z-40 transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
        fixed inset-y-0 right-0 z-50 w-full sm:w-80 bg-white border-l border-slate-200 p-6 shadow-2xl flex flex-col gap-6 overflow-y-auto transition-transform duration-300 ease-in-out
        md:static md:translate-x-0 md:shadow-xl shrink-0
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
          <h3 className="font-semibold text-slate-700">Member Details</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg md:hidden text-slate-500"
            aria-label="Close details"
          >
            <X size={20} />
          </button>
        </div>

        {selectedPerson ? (
          <div className="flex-1 space-y-6">
            {/* Profile Header */}
            <div className="text-center border-b border-slate-100 pb-6">
              <img
                src={getAvatarUrl(selectedPerson)}
                alt={`${selectedPerson.firstName} avatar`}
                className="w-24 h-24 rounded-full mx-auto bg-slate-50 mb-3 border-2 border-slate-200 object-cover shadow-sm"
              />
              <h2 className="text-xl font-bold text-slate-800">
                {selectedPerson.firstName} {selectedPerson.lastName}
              </h2>

              {selectedPerson.callName && (
                <p className="text-sm text-slate-500 italic mt-0.5">
                  "{selectedPerson.callName}"
                </p>
              )}

              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full capitalize bg-slate-100 text-slate-600 border border-slate-200">
                  {selectedPerson.gender}
                </span>
                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                    isDeceased
                      ? 'bg-slate-100 text-slate-500 border-slate-200'
                      : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                  }`}
                >
                  {isDeceased ? 'Deceased' : 'Living'}
                </span>
              </div>
            </div>

            {/* Personal Details Section */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Info size={14} className="text-blue-500" /> Personal Details
              </h3>
              <div className="space-y-2 text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                {selectedPerson.maidenName && (
                  <p className="flex justify-between">
                    <span className="text-slate-500">Maiden Name:</span>
                    <span className="font-medium">{selectedPerson.maidenName}</span>
                  </p>
                )}
                <p className="flex justify-between">
                  <span className="text-slate-500">Birth Date:</span>
                  <span className="font-medium">
                    {selectedPerson.birthDate || 'Unknown'}
                  </span>
                </p>

                {selectedPerson.deathDate && (
                  <p className="flex justify-between">
                    <span className="text-slate-500">Death Date:</span>
                    <span className="font-medium">{selectedPerson.deathDate}</span>
                  </p>
                )}

                {/* Living Person Age */}
                {!isDeceased && ageToday !== null && (
                  <p className="flex justify-between">
                    <span className="text-slate-500">Age:</span>
                    <span className="font-medium">{ageToday} years old</span>
                  </p>
                )}

                {/* Deceased Person Ages */}
                {isDeceased && (
                  <>
                    {ageAtDeath !== null && (
                      <p className="flex justify-between">
                        <span className="text-slate-500">Age at Death:</span>
                        <span className="font-medium">{ageAtDeath} years old</span>
                      </p>
                    )}
                    {ageToday !== null && (
                      <p className="flex justify-between">
                        <span className="text-slate-500">Would be (Today):</span>
                        <span className="font-medium">{ageToday} years old</span>
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Family Links Section */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Heart size={14} className="text-red-400" /> Immediate Family Links
              </h3>
              <div className="space-y-2.5 text-sm bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <p>
                  <span className="text-slate-500 block text-xs">Father</span>
                  <span className="font-medium text-slate-800">
                    {selectedPerson.fatherId
                      ? findPersonName(selectedPerson.fatherId)
                      : 'None Linked'}
                  </span>
                </p>
                <p>
                  <span className="text-slate-500 block text-xs">Mother</span>
                  <span className="font-medium text-slate-800">
                    {selectedPerson.motherId
                      ? findPersonName(selectedPerson.motherId)
                      : 'None Linked'}
                  </span>
                </p>
                <p>
                  <span className="text-slate-500 block text-xs">Spouse</span>
                  <span className="font-medium text-slate-800">
                    {renderNames(spouses)}
                  </span>
                </p>
                <p>
                  <span className="text-slate-500 block text-xs">Children</span>
                  <span className="font-medium text-slate-800">
                    {renderNames(children)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400">
            <User size={48} strokeWidth={1} className="mb-2" />
            <p className="text-sm">
              Select a family member to view their full details and relationships.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}