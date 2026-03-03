"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";

interface Client {
  id: string;
  name: string;
  style: string;
  order: number;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClients() {
      try {
        const q = query(collection(db, "clients"), orderBy("order", "asc"));
        const snap = await getDocs(q);
        setClients(
          snap.docs.map((d) => ({ id: d.id, ...d.data() } as Client))
        );
      } catch (err) {
        console.error("Failed to fetch clients:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchClients();
  }, []);

  if (loading) {
    return (
      <div className="pt-24 pb-20 px-6 md:px-11 min-h-screen flex items-center justify-center">
        <p className="text-tx-dim text-sm tracking-widest uppercase">
          Loading…
        </p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-6 md:px-11 min-h-screen flex flex-col justify-center">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-[10px] font-bold tracking-[5px] uppercase text-tx-ghost mb-16 text-center"
      >
        Selected Clients & Collaborators
      </motion.p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-14 md:gap-x-12 md:gap-y-14 max-w-[900px] mx-auto text-center">
        {clients.map((client, i) => (
          <motion.span
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.05 * i,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`text-gold/70 hover:text-gold transition-opacity duration-400 cursor-default ${
              client.style === "sans"
                ? "font-sans text-2xl md:text-4xl font-black tracking-tight"
                : "font-serif text-3xl md:text-5xl font-bold tracking-wide"
            }`}
          >
            {client.name}
          </motion.span>
        ))}
      </div>
    </div>
  );
}