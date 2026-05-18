"use client";

import { useEffect, useMemo, useRef } from "react";
import { ALL_GAMES, fakeResult, type GameInfo } from "@/lib/games-data";
import { AdSlot } from "@/components/layout/AdSlot";
import Link from "next/link";
import { format } from "date-fns";
import { FiClock, FiTrendingUp, FiBarChart2, FiZap } from "react-icons/fi";

// ─── Helpers ───

function classifyGames() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  function parseTime(timeStr: string): number {
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return 0;
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3].toUpperCase();
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  const live: GameInfo[] = [];
  const next: GameInfo[] = [];
  const rest: GameInfo[] = [];

  for (const game of ALL_GAMES) {
    const gameMinutes = parseTime(game.resultTime);
    const diff = gameMinutes - currentMinutes;
    if (diff < -30) rest.push(game);
    else if (diff < 15) live.push(game);
    else next.push(game);
  }

  return { live, next, rest };
}

function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeInUp");
            entry.target.classList.remove("opacity-0", "translate-y-8");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    const el = ref.current;
    if (el) el.querySelectorAll(".sa").forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
  return ref;
}

// ─── Card Themes ───

const CARD_THEMES = {
  live: {
    gradient: "from-red-500 to-orange-500",
    glow: "shadow-red-300/40",
    badge: "bg-red-100 text-red-700",
    ring: "ring-red-300",
    icon: "text-red-400",
    cardBg: "bg-gradient-to-b from-red-50 to-orange-50",
    cardBorder: "border-red-200",
    resultBg: "bg-white/70",
    resultText: "text-red-600",
    todayBg: "bg-red-50",
    pendingBg: "bg-orange-50",
  },
  next: {
    gradient: "from-blue-500 to-indigo-500",
    glow: "shadow-blue-300/40",
    badge: "bg-blue-100 text-blue-700",
    ring: "ring-blue-300",
    icon: "text-blue-400",
    cardBg: "bg-gradient-to-b from-blue-50 to-indigo-50",
    cardBorder: "border-blue-200",
    resultBg: "bg-white/70",
    resultText: "text-blue-600",
    todayBg: "bg-blue-50",
    pendingBg: "bg-slate-50",
  },
  rest: {
    gradient: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-300/40",
    badge: "bg-emerald-100 text-emerald-700",
    ring: "ring-emerald-300",
    icon: "text-emerald-400",
    cardBg: "bg-gradient-to-b from-emerald-50 to-teal-50",
    cardBorder: "border-emerald-200",
    resultBg: "bg-white/70",
    resultText: "text-emerald-600",
    todayBg: "bg-emerald-50",
    pendingBg: "bg-gray-50",
  },
};

// ─── Main Page ───

export default function HomePage() {
  const { live, next, rest } = useMemo(classifyGames, []);
  const containerRef = useScrollAnimation();

  const results = useMemo(() => {
    const map: Record<string, { today: string; yesterday: string }> = {};
    for (const game of ALL_GAMES) {
      map[game.gameCode] = { today: fakeResult(), yesterday: fakeResult() };
    }
    return map;
  }, []);

  const updatedAt = format(new Date(), "MMMM dd, yyyy, hh:mm:ss a") + " IST";

  return (
    <div ref={containerRef}>
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0f2439] via-[#1e3a5f] to-[#2a5080] text-white text-center py-6 px-4">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
          Satta King Fast Result
        </h1>
        <p className="text-xs md:text-sm text-blue-200 leading-relaxed max-w-3xl mx-auto">
          Daily Superfast Satta King Result of {format(new Date(), "do MMMM yyyy")} &mdash;
          Gali, Desawar, Ghaziabad, Faridabad &amp; 90+ Games with Complete Chart Records
          from 2015&ndash;2026
        </p>
        <div className="mt-3 inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-xs text-blue-100">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Updated: {updatedAt}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border-b border-amber-200 py-2.5 px-4">
        <p className="text-center text-xs text-gray-600 max-w-4xl mx-auto">
          <span className="font-bold text-red-600">DISCLAIMER:</span> This is an independent
          informational portal. We do not promote gambling.{" "}
          <Link href="/disclaimer" className="text-blue-600 hover:underline font-medium">
            Read More...
          </Link>
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-3 md:px-6 py-6">
        <AdSlot placement="homepage_top" />

        {/* LIVE Section */}
        {live.length > 0 && (
          <GameSection
            title="LIVE Results"
            subtitle="Games currently being declared"
            icon={<FiZap size={20} />}
            theme={CARD_THEMES.live}
            games={live}
            results={results}
            isPending={false}
            sectionType="live"
          />
        )}

        <AdSlot placement="homepage_middle" />

        {/* NEXT Section */}
        {next.length > 0 && (
          <GameSection
            title="NEXT Upcoming"
            subtitle="Results will be declared soon"
            icon={<FiClock size={20} />}
            theme={CARD_THEMES.next}
            games={next}
            results={results}
            isPending={true}
            sectionType="next"
          />
        )}

        {/* REST Section */}
        {rest.length > 0 && (
          <GameSection
            title="Declared Results"
            subtitle="Today's completed results"
            icon={<FiTrendingUp size={20} />}
            theme={CARD_THEMES.rest}
            games={rest}
            results={results}
            isPending={false}
            sectionType="rest"
          />
        )}

        {/* CTA */}
        <div className="sa opacity-0 translate-y-8 mt-8 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl p-6 text-center shadow-lg">
          <p className="text-lg font-extrabold text-white">SHOW YOUR GAME HERE</p>
          <p className="text-sm text-white/80 mt-1">Contact us to feature your game on our platform</p>
        </div>

        <AdSlot placement="homepage_bottom" />

        {/* Monthly Chart */}
        <MonthlyChartSection />

        {/* SEO Content */}
        <SeoContent />
      </div>
    </div>
  );
}

// ─── Section Component ───

function GameSection({
  title,
  subtitle,
  icon,
  theme,
  games,
  results,
  isPending,
  sectionType,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  theme: (typeof CARD_THEMES)["live"];
  games: GameInfo[];
  results: Record<string, { today: string; yesterday: string }>;
  isPending: boolean;
  sectionType: "live" | "next" | "rest";
}) {
  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="sa opacity-0 translate-y-8 flex items-center gap-3 mb-5">
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${theme.gradient} text-white shadow-lg ${theme.glow}`}>
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <div className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${theme.badge}`}>
          {games.length} Games
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {games.map((game, i) => (
          <GameCard
            key={game.gameCode}
            game={game}
            yesterday={results[game.gameCode]?.yesterday || "--"}
            today={isPending ? "XX" : results[game.gameCode]?.today || "--"}
            index={i}
            theme={theme}
            isPending={isPending}
            sectionType={sectionType}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Card Component ───

function GameCard({
  game,
  yesterday,
  today,
  index,
  theme,
  isPending,
  sectionType,
}: {
  game: GameInfo;
  yesterday: string;
  today: string;
  index: number;
  theme: (typeof CARD_THEMES)["live"];
  isPending: boolean;
  sectionType: "live" | "next" | "rest";
}) {
  const isHighlighted = game.highlighted;

  return (
    <div
      className={`sa opacity-0 translate-y-8 group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl shadow-lg ${theme.glow} ${theme.cardBg} border ${theme.cardBorder} ${
        isHighlighted ? "ring-2 " + theme.ring : ""
      }`}
      style={{ transitionDelay: `${Math.min(index * 35, 350)}ms` }}
    >
      {/* Top gradient strip */}
      <div className={`h-2 bg-gradient-to-r ${theme.gradient}`} />

      {/* Live pulse badge */}
      {sectionType === "live" && (
        <div className="absolute top-4 right-3">
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Game name */}
        <h3 className="font-extrabold text-sm md:text-[15px] text-gray-900 leading-tight pr-5 truncate">
          {game.gameName}
        </h3>

        {/* Time */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <FiClock size={12} className={theme.icon} />
          <span className="text-xs font-semibold text-gray-500">{game.resultTime}</span>
        </div>

        {/* Results */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          {/* Yesterday */}
          <div className={`${theme.resultBg} backdrop-blur rounded-xl py-2.5 text-center border border-white/50`}>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Yesterday</p>
            <p className="text-xl md:text-2xl font-black font-mono text-gray-800 mt-0.5">
              {yesterday}
            </p>
          </div>
          {/* Today */}
          <div className={`${isPending ? theme.pendingBg : theme.todayBg} rounded-xl py-2.5 text-center border border-white/50`}>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Today</p>
            {isPending ? (
              <p className="text-xl md:text-2xl font-black font-mono text-gray-300 mt-0.5">XX</p>
            ) : (
              <p className={`text-xl md:text-2xl font-black font-mono ${theme.resultText} mt-0.5`}>
                {today}
              </p>
            )}
          </div>
        </div>

        {/* Record Chart Link */}
        <Link
          href={`/chart/${game.gameCode}`}
          className={`mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all bg-gradient-to-r ${theme.gradient} text-white shadow-md group-hover:shadow-lg group-hover:scale-[1.02]`}
        >
          <FiBarChart2 size={13} />
          Record Chart
        </Link>
      </div>
    </div>
  );
}

// ─── Monthly Chart Section ───

function MonthlyChartSection() {
  const now = new Date();
  const month = format(now, "MMMM");
  const year = format(now, "yyyy");
  const todayDate = now.getDate();

  const chartRows = Array.from({ length: todayDate }, (_, i) => {
    const day = i + 1;
    const isToday = day === todayDate;
    return {
      date: String(day).padStart(2, "0"),
      dswr: fakeResult(),
      frbd: isToday ? "XX" : fakeResult(),
      gzbd: isToday ? "XX" : fakeResult(),
      gali: isToday ? "XX" : fakeResult(),
    };
  });

  return (
    <div className="sa opacity-0 translate-y-8 mt-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200">
          <FiBarChart2 size={20} />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">Monthly Chart</h2>
          <p className="text-xs text-gray-500">
            {month} {year} &mdash; Gali, Desawar, Ghaziabad &amp; Faridabad
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center py-2.5 text-sm font-bold">
          Monthly Satta King Result Chart of {month} {year}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-orange-50 border-b border-orange-200">
                <th className="py-2.5 px-3 text-red-600 font-bold">DATE</th>
                <th className="py-2.5 px-3 font-bold text-gray-800">DSWR</th>
                <th className="py-2.5 px-3 font-bold text-gray-800">FRBD</th>
                <th className="py-2.5 px-3 font-bold text-green-700">GZBD</th>
                <th className="py-2.5 px-3 font-bold text-gray-800">GALI</th>
              </tr>
            </thead>
            <tbody>
              {chartRows.map((row, i) => (
                <tr
                  key={row.date}
                  className={`border-t border-gray-100 text-center transition-colors hover:bg-blue-50 ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <td className="py-2 px-3 text-red-600 font-bold">{row.date}</td>
                  <td className="py-2 px-3 font-mono font-bold">{row.dswr}</td>
                  <td className="py-2 px-3 font-mono font-bold">{row.frbd}</td>
                  <td className="py-2 px-3 font-mono font-bold text-green-700">{row.gzbd}</td>
                  <td className="py-2 px-3 font-mono font-bold">{row.gali}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <Link
          href="/charts"
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          {format(new Date(now.getFullYear(), now.getMonth() - 1), "MMM yyyy")}
        </Link>
        <Link
          href="/charts"
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          {format(new Date(now.getFullYear(), now.getMonth() + 1), "MMM yyyy")}
        </Link>
      </div>
      <Link
        href="/charts"
        className="block bg-gradient-to-r from-amber-400 to-orange-400 text-center py-3 mt-3 rounded-xl text-sm font-bold text-white hover:shadow-lg hover:-translate-y-0.5 transition-all"
      >
        View Latest Chart for {month} {year}
      </Link>
    </div>
  );
}

// ─── SEO Content ───

function SeoContent() {
  return (
    <div className="sa opacity-0 translate-y-8 mt-10 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 space-y-5 text-sm text-gray-700 leading-relaxed">
      <h2 className="text-xl font-extrabold text-[#1e3a5f]">
        Satta King Fast Result &mdash; Live Updates for All Games
      </h2>
      <p>
        Welcome to <strong>Satta King Fast Result</strong>, your most trusted and reliable source for daily Satta King
        results. We provide the fastest live results for all popular games including <strong>Gali,
        Desawar, Ghaziabad, Faridabad</strong>, and over <strong>90+ regional games</strong>. Our platform updates
        results in real-time so you never miss an update.
      </p>

      <h3 className="text-lg font-bold text-[#1e3a5f]">What is Satta King?</h3>
      <p>
        Satta King is a popular number-based game where players choose numbers and wait for results
        to be declared at specific times throughout the day. Each game has a fixed result time,
        and results are declared by authorized operators. Our website collects and displays these
        results from various sources for informational purposes.
      </p>

      <h3 className="text-lg font-bold text-[#1e3a5f]">Why Choose Satta King Fast?</h3>
      <ul className="list-disc list-inside space-y-1.5 pl-2">
        <li><strong>Fastest Results:</strong> We update results within seconds of declaration</li>
        <li><strong>90+ Games:</strong> Complete coverage of all regional and national games</li>
        <li><strong>Record Charts:</strong> Historical monthly charts for Gali, Desawar, Ghaziabad, Faridabad</li>
        <li><strong>Mobile Friendly:</strong> Optimized for all devices &mdash; mobile, tablet, and desktop</li>
        <li><strong>Free Access:</strong> All results and charts are completely free to view</li>
        <li><strong>WhatsApp Updates:</strong> Get instant result notifications on WhatsApp</li>
      </ul>

      <h3 className="text-lg font-bold text-[#1e3a5f]">Popular Games &amp; Result Times</h3>
      <p>
        The most popular games include <strong>Desawar</strong> (05:00 AM), <strong>Faridabad</strong> (06:00 PM),
        <strong> Ghaziabad</strong> (09:25 PM), and <strong>Gali</strong> (11:25 PM). We also cover regional
        games like Delhi Bazar, Mohali, Meerut City, Super Taj, Jaipur King, Mumbai Bazaar, and many more.
      </p>

      <h3 className="text-lg font-bold text-[#1e3a5f]">Monthly Satta King Chart 2026</h3>
      <p>
        View complete monthly result charts for all four major games. Our chart records go back to
        2015 and are updated daily. Charts are available for every month from 2015 to 2026.
      </p>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-700">
        <strong>Disclaimer:</strong> This website is purely informational. We do not encourage or
        promote any form of gambling or betting. Users should comply with their local laws and
        regulations.
      </div>
    </div>
  );
}
