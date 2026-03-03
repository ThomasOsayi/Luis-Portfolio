"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ───────── types ───────── */
interface Client {
  id: string;
  name: string;
  style: string;
  order: number;
}

/* ───────── icons ───────── */
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
function GripIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="9" cy="6" r="1" /><circle cx="15" cy="6" r="1" />
      <circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" />
      <circle cx="9" cy="18" r="1" /><circle cx="15" cy="18" r="1" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/* ═══════════════════════════════════════
   CLIENTS ADMIN
   ═══════════════════════════════════════ */
export default function ClientsAdmin() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newStyle, setNewStyle] = useState("serif");
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  async function fetchClients() {
    const q = query(collection(db, "clients"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    setClients(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Client)));
    setLoading(false);
  }

  useEffect(() => {
    fetchClients();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    await addDoc(collection(db, "clients"), {
      name: newName.trim(),
      style: newStyle,
      order: clients.length,
      createdAt: serverTimestamp(),
    });
    setNewName("");
    fetchClients();
  }

  async function handleDelete(
    e: React.MouseEvent,
    id: string,
    name: string
  ) {
    e.stopPropagation();
    if (!confirm(`Remove "${name}" from clients?`)) return;
    await deleteDoc(doc(db, "clients", id));
    setClients((prev) => prev.filter((c) => c.id !== id));
  }

  // Preview list includes the new name being typed
  const previewClients = [
    ...clients,
    ...(newName.trim()
      ? [{ id: "preview-new", name: newName.trim(), style: newStyle, order: clients.length }]
      : []),
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-serif text-[28px] font-normal tracking-wide mb-1">
            Clients
          </h1>
          <p className="text-tx-dim text-sm">
            {clients.length} client{clients.length !== 1 ? "s" : ""} &
            collaborators
          </p>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className={`flex items-center gap-2 px-4 py-2 text-[11px] tracking-[1px] uppercase rounded-lg border transition-colors ${
            showPreview
              ? "border-gold/30 text-gold bg-gold/[0.06]"
              : "border-tx-mute text-tx-dim hover:border-tx-ghost hover:text-tx"
          }`}
        >
          <EyeIcon />
          {showPreview ? "Hide Preview" : "Show Preview"}
        </button>
      </div>

      <div
        className={`grid gap-6 ${showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 max-w-2xl"}`}
      >
        {/* ═══ LEFT: ADD + LIST ═══ */}
        <div>
          {/* Add Client Form */}
          <form onSubmit={handleAdd} className="mb-6">
            <label className="text-[10px] tracking-[2px] uppercase text-tx-ghost block mb-3 font-medium">
              Add New Client
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Client or brand name"
                className="flex-1 bg-[#0e0e0e] border border-tx-mute rounded-lg px-3.5 py-2.5 text-sm text-tx outline-none focus:border-gold transition-colors"
              />
              <select
                value={newStyle}
                onChange={(e) => setNewStyle(e.target.value)}
                className="bg-[#0e0e0e] border border-tx-mute rounded-lg px-3.5 py-2.5 text-sm text-tx outline-none focus:border-gold transition-colors appearance-none w-[110px]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238A8478' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px center",
                }}
              >
                <option value="serif">Serif</option>
                <option value="sans">Sans</option>
              </select>
              <button
                type="submit"
                className="flex items-center gap-2 bg-gold text-bg text-[11px] font-semibold tracking-[1.5px] uppercase px-5 py-2.5 rounded-lg hover:bg-gold/85 transition-colors"
              >
                <PlusIcon /> Add
              </button>
            </div>
            {/* Live typing preview */}
            {newName.trim() && (
              <div className="mt-3 px-4 py-3 border border-gold/15 rounded-lg bg-gold/[0.03]">
                <span className="text-[10px] tracking-[1.5px] uppercase text-gold/60 mr-3">
                  Preview:
                </span>
                <span
                  className={
                    newStyle === "sans"
                      ? "font-sans font-black text-lg text-tx"
                      : "font-serif font-semibold text-xl text-tx"
                  }
                >
                  {newName.trim()}
                </span>
              </div>
            )}
          </form>

          {/* Client List */}
          <div>
            <div className="text-[10px] tracking-[2px] uppercase text-tx-ghost font-medium mb-3">
              All Clients
            </div>

            {loading ? (
              <p className="text-tx-dim text-sm tracking-widest uppercase">
                Loading…
              </p>
            ) : clients.length === 0 ? (
              <div className="border border-tx-mute rounded-xl p-10 text-center">
                <p className="text-tx-ghost text-sm mb-1">No clients yet</p>
                <p className="text-tx-mute text-xs">
                  Add your first client above
                </p>
              </div>
            ) : (
              <div className="border border-tx-mute rounded-xl overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[28px_1fr_80px_60px] px-4 py-2 border-b border-tx-mute text-[9px] tracking-[2px] uppercase text-tx-ghost items-center bg-bg-card/50">
                  <span>#</span>
                  <span>Name</span>
                  <span>Style</span>
                  <span />
                </div>

                {clients.map((client, i) => (
                  <div
                    key={client.id}
                    className={`grid grid-cols-[28px_1fr_80px_60px] px-4 py-3 items-center transition-colors group ${
                      i < clients.length - 1 ? "border-b border-tx-mute" : ""
                    } ${
                      hoveredRow === client.id
                        ? "bg-bg-card"
                        : "hover:bg-bg-card/50"
                    }`}
                    onMouseEnter={() => setHoveredRow(client.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    {/* Grip */}
                    <span className="text-tx-mute">
                      <GripIcon />
                    </span>

                    {/* Name with style applied */}
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={
                          client.style === "sans"
                            ? "font-sans font-black text-base text-tx"
                            : "font-serif font-semibold text-lg text-tx"
                        }
                      >
                        {client.name}
                      </span>
                    </div>

                    {/* Style pill */}
                    <div>
                      <span
                        className={`text-[10px] tracking-wide px-2.5 py-0.5 rounded-full ${
                          client.style === "serif"
                            ? "text-gold bg-gold/8"
                            : "text-indigo-400 bg-indigo-400/8"
                        }`}
                      >
                        {client.style}
                      </span>
                    </div>

                    {/* Delete */}
                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) =>
                          handleDelete(e, client.id, client.name)
                        }
                        className="w-[30px] h-[30px] rounded-md border border-tx-mute bg-bg-card flex items-center justify-center text-tx-dim hover:border-red-400 hover:text-red-400 transition-colors"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ═══ RIGHT: LIVE PREVIEW (Public Clients Page) ═══ */}
        {showPreview && (
          <div className="bg-[#080808] rounded-xl border border-tx-mute overflow-hidden flex flex-col">
            {/* Preview Header */}
            <div className="px-5 py-3 border-b border-tx-mute flex items-center gap-2 bg-[#0a0a0a]/90 backdrop-blur-xl">
              <EyeIcon />
              <span className="text-[11px] tracking-[2px] uppercase text-tx-ghost">
                Live Preview — /clients
              </span>
            </div>

            {/* Preview Content */}
            <div className="flex-1 p-8">
              <p className="text-[9px] tracking-[4px] uppercase text-tx-ghost mb-3">
                Selected Clients & Collaborators
              </p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                {previewClients.map((client) => (
                  <div
                    key={client.id}
                    className={`transition-opacity ${
                      client.id === "preview-new" ? "opacity-50" : ""
                    }`}
                  >
                    <span
                      className={
                        client.style === "sans"
                          ? "font-sans font-black text-xl text-tx"
                          : "font-serif font-semibold text-2xl text-tx"
                      }
                    >
                      {client.name}
                    </span>
                  </div>
                ))}
              </div>
              {previewClients.length === 0 && (
                <p className="text-tx-ghost text-sm text-center py-8">
                  No clients to preview
                </p>
              )}
            </div>

            {/* Preview Footer */}
            <div className="px-5 py-3 border-t border-tx-mute text-[11px] text-tx-ghost text-center">
              Shows how names appear on the public clients page
            </div>
          </div>
        )}
      </div>
    </div>
  );
}