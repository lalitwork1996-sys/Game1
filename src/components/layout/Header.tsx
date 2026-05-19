"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiMenu, FiX, FiHome, FiBarChart2, FiMessageCircle, FiInfo } from "react-icons/fi";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: FiHome },
  { href: "/contact", label: "Contact", icon: FiMessageCircle },
  { href: "/about", label: "About", icon: FiInfo },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="bg-gradient-to-r from-[#0f2439] via-[#1e3a5f] to-[#1a3355] text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            SATTA<span className="text-amber-400">RESULT</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    active
                      ? "bg-amber-400 text-[#1e3a5f] shadow-md shadow-amber-400/30"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={15} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-3 pt-2 flex flex-col gap-1 border-t border-white/10">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    active
                      ? "bg-amber-400 text-[#1e3a5f]"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      {/* Marquee */}
      <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-[#1e3a5f] py-1 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap text-xs font-bold">
          Welcome to Satta Result &mdash; Your trusted source for live daily results. Check Gali, Desawar, Ghaziabad, Faridabad results here! &nbsp;&nbsp;&bull;&nbsp;&nbsp; Fast Results &nbsp;&nbsp;&bull;&nbsp;&nbsp; 90+ Games &nbsp;&nbsp;&bull;&nbsp;&nbsp; Free Chart Records
        </div>
      </div>
    </header>
  );
}
