import React, { useState } from 'react';
import initialPeople from './data/people.json';
import PersonCard from './components/PersonCard';
import { User, Users, Heart, X } from 'lucide-react';
import TreeCanvas from './components/TreeCanvas';

export default function App() {
  const [people] = useState(initialPeople);
  const [selectedPerson, setSelectedPerson] = useState(null);
  // Track if the sidebar modal is explicitly open on mobile screens
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSelectPerson = (person) => {
    setSelectedPerson(person);
    setIsSidebarOpen(true); // Auto-open the drawer when clicking a person
  };

  const findPersonName = (id) => {
    const found = people.find(p => p.id === id);
    return found ? `${found.firstName} ${found.lastName}` : 'Unknown';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm shrink-0">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Users className="text-blue-600" /> Custom Family Tree App
        </h1>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Main List Grid */}
        {/* <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">All Family Members</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {people.map(person => (
              <PersonCard 
                key={person.id} 
                person={person} 
                onSelect={handleSelectPerson} 
                isActive={selectedPerson?.id === person.id}
              />
            ))}
          </div>
        </main> */}
        {/* Main Workspace Canvas */}
        <main className="flex-1 h-full relative">
          <TreeCanvas people={people} onSelectPerson={handleSelectPerson} />
        </main>

        {/* Backdrop overlay for mobile to tap out of the sidebar */}
        {isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 md:hidden z-40 transition-opacity"
          />
        )}

        {/* Responsive Drawer/Sidebar */}
        <aside className={`
          fixed inset-y-0 right-0 z-50 w-full sm:w-80 bg-white border-l border-slate-200 p-6 shadow-2xl flex flex-col gap-6 overflow-y-auto transition-transform duration-300 ease-in-out
          md:static md:translate-x-0 md:shadow-xl shrink-0
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          
          {/* Header section with mobile close button */}
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
              {/* Inside the sidebar profile card of src/App.jsx */}
              <div className="text-center border-b border-slate-100 pb-6">
                <img 
                  src={selectedPerson.avatarUrl} // <-- Read straight from JSON link!
                  className="w-24 h-24 rounded-full mx-auto bg-slate-50 mb-3" 
                  alt="" 
                />
                <h2 className="text-xl font-bold text-slate-800">{selectedPerson.firstName} {selectedPerson.lastName}</h2>
                <p className="text-sm text-slate-500 capitalize">{selectedPerson.gender}</p>
              </div>

              {/* Immediate Relationships section */}
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