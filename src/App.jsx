import React, { useState, useMemo } from 'react';
import LoginOverlay from "./components/LoginOverlay";
import TreeCanvas from './components/TreeCanvas';
import MemberSidebar from './components/MemberSidebar'; // <-- Import new component

import peopleDefault from './data/people.json';
import peopleAcM from './data/people_ac.json';
import peopleAc1 from './data/people_ac_1.json';
import { Users, LogOut } from 'lucide-react';

const peopleAc = peopleAcM.concat(peopleAc1);

const DATASETS = {
  default: peopleDefault,
  n: peopleAc,
};

export default function App() {
  const [loginData, setLoginData] = useState(() => {
    const saved = localStorage.getItem("famtre-login");
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const people = useMemo(() => {
    if (!loginData) return [];

    let fallbackDataset = peopleDefault;
    if (loginData.familyName === "khoir") {
      fallbackDataset = peopleAc;
    }

    const datasetKey = window.location.pathname
      .split('/')
      .filter(Boolean)
      .pop();

    return DATASETS[datasetKey] || fallbackDataset;
  }, [loginData]);

  if (!loginData) {
    return (
      <LoginOverlay
        suggestedPeople={peopleAc}
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm shrink-0 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Users className="text-blue-600" />
          <span className="hidden sm:inline">Family Tree App</span>
        </h1>

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

        {/* Separated Sidebar Component */}
        <MemberSidebar
          selectedPerson={selectedPerson}
          people={people}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
    </div>
  );
}