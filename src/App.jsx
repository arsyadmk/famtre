import React, { useState, useMemo } from 'react';

import LoginOverlay from "./components/LoginOverlay";

import peopleDefault from './data/people.json';
import peopleAcM from './data/people_ac.json';
import peopleAc1 from './data/people_ac_1.json';
import alias from './data/alias.json';

import PersonCard from './components/PersonCard';
import { User, Users, Heart, X, LogOut } from 'lucide-react';
import TreeCanvas from './components/TreeCanvas';

// const peopleAc = peopleAcM
// const peopleAc = [peopleAcM, peopleAc1];
const peopleAc = peopleAcM.concat(peopleAc1);

// console.log(peopleAc);

const DATASETS = {
  default: peopleDefault,
  n: peopleAc,
};

export default function App() {
  // 1. All hooks must be grouped together at the top of the component
  const [loginData, setLoginData] = useState(() => {
    const saved = localStorage.getItem("famtre-login");
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 2. We run useMemo here so it ALWAYS executes (preserving Hook order), 
  // but we return an empty array if loginData is not yet available.
  const people = useMemo(() => {
    if (!loginData) return []; // Return placeholder empty data until logged in

    let fallbackDataset = peopleDefault;
    if (loginData.familyName === "khoir") {
      fallbackDataset = peopleAc;
    }

    const datasetKey = window.location.pathname
      .split('/')
      .filter(Boolean)
      .pop();

      // console.log(loginData.personId, loginData.familyName, loginData.personName);
      return DATASETS[datasetKey] || fallbackDataset;
  }, [loginData]);

  // 3. NOW it is safe to perform the early return for the UI
  if (!loginData) {
    return (
      <LoginOverlay
        suggestedPeople={peopleAc} // <-- Pass the dataset directly to login page
        onComplete={(data) => {
          localStorage.setItem("famtre-login", JSON.stringify(data));
          setLoginData(data);
        }}
      />
    );
  }

  const handleSelectPerson = (person) => {
    setSelectedPerson(person);
    setIsSidebarOpen(true);
  };

  const findPersonName = (id) => {
    const found = people.find(p => p.id === id);
    return found ? `${found.firstName} ${found.lastName}` : 'Unknown';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm shrink-0 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Users className="text-blue-600" />
          <span className="hidden sm:inline">Family Tree App</span>
        </h1>

        {/* Unified Account Badge */}
        <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
          <span className="px-3.5 py-2 text-sm font-medium text-slate-600 border-r border-slate-200 max-w-[140px] sm:max-w-none truncate">
            👋 Hi, {loginData.personName.split(' ')[0]}
          </span>
          <button
            onClick={() => {
              localStorage.removeItem("famtre-login");
              window.location.reload();
            }}
            title="Logout"
            aria-label="Logout"
            className="p-2 px-3 bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors flex items-center justify-center"
          >
            <LogOut size={16} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        <main className="flex-1 h-full relative">
          <TreeCanvas people={people} onSelectPerson={handleSelectPerson} />
        </main>

        {isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 md:hidden z-40 transition-opacity"
          />
        )}

        <aside className={`
          fixed inset-y-0 right-0 z-50 w-full sm:w-80 bg-white border-l border-slate-200 p-6 shadow-2xl flex flex-col gap-6 overflow-y-auto transition-transform duration-300 ease-in-out
          md:static md:translate-x-0 md:shadow-xl shrink-0
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
            <h3 className="font-semibold text-slate-700">Member Details</h3>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 hover:bg-slate-100 rounded-lg md:hidden text-slate-500"
              aria-label="Close details"
            >
              <X size={20} />
            </button>
          </div>

          {selectedPerson ? (
            <div className="flex-1">
              <div className="text-center border-b border-slate-100 pb-6">
                <img 
                  src={selectedPerson.avatarUrl} 
                  className="w-24 h-24 rounded-full mx-auto bg-slate-50 mb-3" 
                  alt="" 
                />
                <h2 className="text-xl font-bold text-slate-800">{selectedPerson.firstName} {selectedPerson.lastName}</h2>
                <p className="text-sm text-slate-500 capitalize">{selectedPerson.gender}</p>
              </div>

              <div className="mt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1">
                  <Heart size={14} className="text-red-400"/> Immediate Family Links
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-slate-500">Father:</span> {selectedPerson.fatherId ? findPersonName(selectedPerson.fatherId) : 'None Linked'}</p>
                  <p><span className="text-slate-500">Mother:</span> {selectedPerson.motherId ? findPersonName(selectedPerson.motherId) : 'None Linked'}</p>
                  <p><span className="text-slate-500">Spouses:</span> {selectedPerson.spouseIds.length > 0 ? selectedPerson.spouseIds.map(id => findPersonName(id)).join(', ') : 'None Linked'}</p>
                  <p><span className="text-slate-500">Children:</span> {selectedPerson.childrenIds.length > 0 ? selectedPerson.childrenIds.map(id => findPersonName(id)).join(', ') : 'None Linked'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400">
              <User size={48} strokeWidth={1} className="mb-2"/>
              <p className="text-sm">Select a family member to view their profile details and relationships.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}