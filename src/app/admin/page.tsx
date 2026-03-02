"use client";

import Link from "next/link";

const quickLinks = [
  {
    href: "/admin/projects/new",
    title: "Add New Project",
    desc: "Upload a new film, music video, photo set, or documentary",
  },
  {
    href: "/admin/projects",
    title: "Manage Projects",
    desc: "Edit, reorder, or remove existing work",
  },
  {
    href: "/admin/clients",
    title: "Manage Clients",
    desc: "Add or remove client names",
  },
  {
    href: "/admin/settings",
    title: "Site Settings",
    desc: "Edit bio, mission statement, hero image, social links",
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold mb-2">Dashboard</h1>
      <p className="text-tx-dim text-sm mb-10">
        Welcome back. What do you want to update?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="border border-tx-mute p-6 hover:border-gold/40 hover:bg-gold-dim transition-all group"
          >
            <h3 className="font-sans text-base font-bold mb-1 group-hover:text-gold transition-colors">
              {link.title}
            </h3>
            <p className="text-tx-ghost text-sm font-light">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}