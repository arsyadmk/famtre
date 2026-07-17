import React, { useState, useMemo } from "react";

export default function LoginOverlay({ onComplete, suggestedPeople = [] }) {
  const [familyName, setFamilyName] = useState("");
  const [personName, setPersonName] = useState("");
  const [personId, setPersonId] = useState(null); // <-- NEW STATE to track ID
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(() => {
    const query = personName.trim().toLowerCase();
    if (query.length < 5) return [];

    return suggestedPeople.filter((person) => {
      const fullName = `${person.firstName} ${person.lastName}`.toLowerCase();
      return fullName.includes(query);
    });
  }, [personName, suggestedPeople]);

  const getAge = (birthDate) => {
    if (!birthDate) return null;
    const birthYear = new Date(birthDate).getFullYear() || parseInt(birthDate, 10);
    if (isNaN(birthYear)) return null;
    return new Date().getFullYear() - birthYear;
  };

  const handleSelectSuggestion = (person) => {
    const fullName = `${person.firstName} ${person.lastName}`;
    setPersonName(fullName);
    setPersonId(person.id); // <-- Save the ID when option clicked
    setShowSuggestions(false);

    if (!familyName.trim()) {
      setFamilyName("khoir");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!familyName.trim() || !personName.trim()) {
      return;
    }

    const loginData = {
      familyName: familyName.trim(),
      personName: personName.trim(),
      personId: personId, // <-- Include the ID in the login object
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("famtre-login", JSON.stringify(loginData));
    onComplete(loginData);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-slate-800 text-center">Welcome</h1>
        <p className="text-slate-500 text-center mt-2 mb-8">
          Please tell us who you are before entering the family tree.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Who is your family name?
            </label>
            <input
              type="text"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="Example: Smith"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Who are you?
            </label>
            <input
              type="text"
              value={personName}
              onChange={(e) => {
                setPersonName(e.target.value);
                setPersonId(null); // <-- Reset ID to null if they keep custom typing
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Example: John Smith"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 max-h-60 overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                {suggestions.map((person) => {
                  const fullName = `${person.firstName} ${person.lastName}`;
                  const age = getAge(person.birthDate);

                  return (
                    <li key={person.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectSuggestion(person)}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <div className="font-medium">{fullName}</div>
                        {age !== null && (
                          <div className="text-xs text-slate-400">{age} years old</div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            {showSuggestions && suggestions.length > 0 && (
              <div className="fixed inset-0 z-0" onClick={() => setShowSuggestions(false)} />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold transition"
          >
            Enter Family Tree
          </button>
        </form>
      </div>
    </div>
  );
}