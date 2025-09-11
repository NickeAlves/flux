"use client";

import { useEffect, useMemo, useState } from "react";

type Note = {
  id: string;
  title: string;
  body: string;
  updatedAt: number;
};

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const raw =
      typeof window !== "undefined" ? localStorage.getItem("notes") : null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Note[];
        setNotes(parsed);
        if (parsed.length > 0) setSelectedId(parsed[0].id);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byDate = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
    if (!q) return byDate;
    return byDate.filter(
      (n) =>
        n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
    );
  }, [notes, query]);

  const selected = notes.find((n) => n.id === selectedId) || null;

  const createNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: "New Note",
      body: "",
      updatedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedId(newNote.id);
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const updateNote = (
    id: string,
    updates: Partial<Pick<Note, "title" | "body">>
  ) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
      )
    );
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleString();
  };

  return (
    <div className="flex h-full w-full">
      <aside className="w-72 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-3 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.5 3.75a6.75 6.75 0 1 0 3.931 12.233l3.793 3.793a.75.75 0 1 0 1.06-1.06l-3.793-3.794A6.75 6.75 0 0 0 10.5 3.75ZM5.25 10.5a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setQuery("");
                }}
                placeholder="Search notes"
                aria-label="Search notes"
                className="w-full pl-9 pr-8 py-2 rounded-md border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute inset-y-0 right-2 my-auto h-6 w-6 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.97 6.97a.75.75 0 0 1 1.06 0L12 10.94l3.97-3.97a.75.75 0 1 1 1.06 1.06L13.06 12l3.97 3.97a.75.75 0 1 1-1.06 1.06L12 13.06l-3.97 3.97a.75.75 0 0 1-1.06-1.06L10.94 12 6.97 8.03a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={createNote}
              className="px-3 py-2 rounded-md bg-gray-900 text-white hover:bg-black/80 whitespace-nowrap"
            >
              New Note
            </button>
          </div>
        </div>
        <div className="overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">No notes</div>
          ) : (
            <ul>
              {filtered.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(n.id)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${
                      selectedId === n.id ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium truncate">
                        {n.title || "Untitled"}
                      </div>
                      <div className="ml-2 text-xs text-gray-500 shrink-0">
                        {formatTime(n.updatedAt)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {n.body || "No additional text"}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
      <main className="flex-1 bg-white">
        {!selected ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            {notes.length === 0 ? (
              <div className="text-center">
                <div className="mb-3">No notes yet</div>
                <button
                  type="button"
                  onClick={createNote}
                  className="px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-black/80"
                >
                  Create your first note
                </button>
              </div>
            ) : (
              <div>Select or create a note</div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 p-3 border-b border-gray-200">
              <input
                value={selected.title}
                onChange={(e) =>
                  updateNote(selected.id, { title: e.target.value })
                }
                className="flex-1 px-3 py-2 text-xl font-semibold focus:outline-none"
              />
              <button
                type="button"
                onClick={createNote}
                className="px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50"
              >
                New Note
              </button>
              <button
                type="button"
                onClick={() => deleteNote(selected.id)}
                className="px-3 py-2 rounded-md border border-red-200 text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
            <textarea
              value={selected.body}
              onChange={(e) =>
                updateNote(selected.id, { body: e.target.value })
              }
              className="flex-1 p-4 outline-none resize-none"
              placeholder="Start typing..."
            />
          </div>
        )}
      </main>
    </div>
  );
}
