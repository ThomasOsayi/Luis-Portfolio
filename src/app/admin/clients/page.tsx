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

interface Client {
  id: string;
  name: string;
  style: string;
  order: number;
}

export default function ClientsAdmin() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newStyle, setNewStyle] = useState("serif");

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

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Remove "${name}" from clients?`)) return;
    await deleteDoc(doc(db, "clients", id));
    setClients((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl font-semibold mb-8">Clients</h1>

      {/* Add form */}
      <form onSubmit={handleAdd} className="flex gap-3 mb-8">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Client name"
          className="flex-1 bg-bg-elevated border border-tx-mute px-4 py-3 text-sm text-tx outline-none focus:border-gold transition-colors"
        />
        <select
          value={newStyle}
          onChange={(e) => setNewStyle(e.target.value)}
          className="bg-bg-elevated border border-tx-mute px-4 py-3 text-sm text-tx outline-none"
        >
          <option value="serif">Serif</option>
          <option value="sans">Sans (bold)</option>
        </select>
        <button
          type="submit"
          className="bg-gold text-bg text-[10px] font-bold tracking-[3px] uppercase px-6 hover:bg-gold/80 transition-colors"
        >
          Add
        </button>
      </form>

      {/* Client list */}
      {loading ? (
        <p className="text-tx-dim text-sm">Loading...</p>
      ) : (
        <div className="flex flex-col gap-2">
          {clients.map((client) => (
            <div
              key={client.id}
              className="flex items-center justify-between border border-tx-mute p-4"
            >
              <div className="flex items-center gap-4">
                <span className="text-tx-ghost text-xs w-6">{client.order}</span>
                <span
                  className={
                    client.style === "sans"
                      ? "font-sans font-black text-lg"
                      : "font-serif font-bold text-xl"
                  }
                >
                  {client.name}
                </span>
                <span className="text-tx-ghost text-[10px] tracking-wider uppercase">
                  {client.style}
                </span>
              </div>
              <button
                onClick={() => handleDelete(client.id, client.name)}
                className="text-[10px] tracking-[2px] uppercase text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}