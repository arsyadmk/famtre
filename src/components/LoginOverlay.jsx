import React, { useState } from "react";

export default function LoginOverlay({ onComplete }) {
  const [familyName, setFamilyName] = useState("");
  const [personName, setPersonName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!familyName.trim() || !personName.trim()) {
      return;
    }

    const loginData = {
      familyName: familyName.trim(),
      personName: personName.trim(),
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("famtre-login", JSON.stringify(loginData));

    onComplete(loginData);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-slate-800 text-center">
          Welcome
        </h1>

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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Who are you?
            </label>

            <input
              type="text"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="Example: John Smith"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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