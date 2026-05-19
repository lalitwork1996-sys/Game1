"use client";

import { useEffect, useState, useRef } from "react";
import { AdSlot } from "@/components/layout/AdSlot";
import Link from "next/link";
import { format } from "date-fns";
import { FiClock, FiTrendingUp, FiBarChart2, FiZap } from "react-icons/fi";

// ─── Types ───

interface GameResult {
  name: string;
  time: string;
  yesterday: string;
  today: string;
}

interface ChartRow {
  date: string;
  frbd: string;
  gzbd: string;
  gali: string;
  dswr: string;
}

// ─── Card Themes ───
const CARD_THEMES = {
  live: {
    gradient: "from-red-500 to-orange-500",
    badge: "bg-red-100 text-red-700",
    resultText: "text-red-600",
    todayBg: "bg-red-50",
  },
  next: {
    gradient: "from-amber-400 to-orange-500",
    badge: "bg-amber-100 text-amber-700",
    resultText: "text-amber-600",
    todayBg: "bg-amber-50",
  },
  rest: {
    gradient: "from-emerald-500 to-teal-500",
    badge: "bg-emerald-100 text-emerald-700",
    resultText: "text-emerald-600",
    todayBg: "bg-emerald-50",
  },
};

// ─── Scroll Animation ───

function useScrollAnimation(deps: unknown[] = []) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

// ─── Main Page ───

export default function HomePage() {
  const [liveResults, setLiveResults] = useState<GameResult[]>([]);
  const [nextResults, setNextResults] = useState<GameResult[]>([]);
  const [restResults, setRestResults] = useState<GameResult[]>([]);
  const [chartData, setChartData] = useState<{ month: string; year: string; results: ChartRow[] }>({ month: "", year: "", results: [] });
  const [loading, setLoading] = useState(true);
  const containerRef = useScrollAnimation([loading]);

  useEffect(() => {
    const now = new Date();
    const month = format(now, "MMMM").toLowerCase();
    const year = format(now, "yyyy");

    const safeFetch = (url: string) =>
      fetch(url).then((r) => r.json()).catch(() => ({ success: false, results: [] }));

    Promise.all([
      safeFetch("/api/live-results"),
      safeFetch("/api/next-results"),
      safeFetch("/api/rest-results"),
      safeFetch(`/api/monthly-chart?month=${month}&year=${year}`),
    ]).then(([live, next, rest, chart]) => {
      if (live.success) setLiveResults(live.results || []);
      if (next.success) setNextResults(next.results || []);
      if (rest.success) setRestResults(rest.results || []);
      if (chart.success) setChartData({ month: chart.month, year: chart.year, results: chart.results || [] });
      setLoading(false);
    });
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

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading results...</div>
        ) : (
          <>
            {/* LIVE Section */}
            {liveResults.length > 0 && (
              <GameSection
                title="LIVE Results"
                subtitle="Games currently being declared"
                icon={<FiZap size={20} />}
                theme={CARD_THEMES.live}
                games={liveResults}
                isPending={false}
              />
            )}

            <AdSlot placement="homepage_middle" />

            {/* Monthly Chart — right after LIVE */}
            {chartData.results.length > 0 && (
              <MonthlyChartSection month={chartData.month} year={chartData.year} rows={chartData.results} />
            )}

            {/* NEXT Section */}
            {nextResults.length > 0 && (
              <GameSection
                title="NEXT Upcoming"
                subtitle="Results will be declared soon"
                icon={<FiClock size={20} />}
                theme={CARD_THEMES.next}
                games={nextResults}
                isPending={false}
              />
            )}

            {/* REST Section */}
            {restResults.length > 0 && (
              <GameSection
                title="Declared Results"
                subtitle="Today's completed results"
                icon={<FiTrendingUp size={20} />}
                theme={CARD_THEMES.rest}
                games={restResults}
                isPending={false}
              />
            )}
          </>
        )}

        {/* CTA */}
        <div className="sa opacity-0 translate-y-8 mt-8 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl p-6 text-center shadow-lg">
          <p className="text-lg font-extrabold text-white">SHOW YOUR GAME HERE</p>
          <p className="text-sm text-white/80 mt-1">Contact us to feature your game on our platform</p>
        </div>

        <AdSlot placement="homepage_bottom" />

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
  isPending,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  theme: (typeof CARD_THEMES)["live"];
  games: GameResult[];
  isPending: boolean;
}) {
  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="sa opacity-0 translate-y-8 flex items-center gap-3 mb-5">
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${theme.gradient} text-white shadow-lg`}>
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-[#1e3a5f]">{title}</h2>
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
            key={game.name + i}
            game={game}
            index={i}
            theme={theme}
            isPending={isPending}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Card Component ───

function GameCard({
  game,
  index,
  theme,
  isPending,
}: {
  game: GameResult;
  index: number;
  theme: (typeof CARD_THEMES)["live"];
  isPending: boolean;
}) {
  const slug = game.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <div
      className="sa opacity-0 translate-y-8 group relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
      style={{ transitionDelay: `${Math.min(index * 35, 350)}ms` }}
    >
      {/* Top color border */}
      <div className={`h-1 bg-gradient-to-r ${theme.gradient}`} />

      <div className="px-4 py-5 text-center">
        <h3 className="font-bold text-base text-[#1e3a5f] uppercase tracking-wide">
          {game.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1.5">
          Result Time: {game.time}
        </p>

        {/* Results */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="bg-gray-50 rounded-lg py-2">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Yesterday</p>
            <p className="text-xl font-black font-mono text-gray-800 mt-0.5">{game.yesterday || "--"}</p>
          </div>
          <div className={`${isPending ? "bg-gray-50" : theme.todayBg} rounded-lg py-2`}>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Today</p>
            {isPending ? (
              <p className="text-xl font-black font-mono text-gray-300 mt-0.5">XX</p>
            ) : (
              <p className={`text-xl font-black font-mono ${theme.resultText} mt-0.5`}>{game.today || "--"}</p>
            )}
          </div>
        </div>

        <Link
          href={`/chart/${slug}`}
          className="inline-block mt-3 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          View Chart →
        </Link>
      </div>
    </div>
  );
}

// ─── Monthly Chart Section ───

function MonthlyChartSection({ month: initialMonth, year: initialYear, rows: initialRows }: { month: string; year: string; rows: ChartRow[] }) {
  const [currentDate, setCurrentDate] = useState(new Date(Number(initialYear), new Date(`${initialMonth} 1, ${initialYear}`).getMonth()));
  const [rows, setRows] = useState(initialRows);
  const [chartLoading, setChartLoading] = useState(false);

  const displayMonth = format(currentDate, "MMMM");
  const displayYear = format(currentDate, "yyyy");

  const prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
  const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);

  const fetchMonth = async (date: Date) => {
    setChartLoading(true);
    const m = format(date, "MMMM").toLowerCase();
    const y = format(date, "yyyy");
    try {
      const res = await fetch(`/api/monthly-chart?month=${m}&year=${y}`);
      const data = await res.json();
      if (data.success) {
        setRows(data.results || []);
        setCurrentDate(date);
      }
    } catch (err) {
      console.error("Chart fetch error:", err);
    } finally {
      setChartLoading(false);
    }
  };

  return (
    <div className="sa opacity-0 translate-y-8 mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
          <FiBarChart2 size={20} />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-[#1e3a5f]">Monthly Chart</h2>
          <p className="text-xs text-gray-500">
            {displayMonth} {displayYear} &mdash; Gali, Desawar, Ghaziabad &amp; Faridabad
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center py-2.5 text-sm font-bold">
          Monthly Satta King Result Chart of {displayMonth} {displayYear} for Gali, Desawer, Gaziabad and Faridabad
        </div>

        {chartLoading ? (
          <div className="text-center py-10 text-gray-400">Loading chart...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-amber-100 border-b border-amber-200">
                  <th className="py-2.5 px-3 text-red-600 font-bold">DATE</th>
                  <th className="py-2.5 px-3 font-bold text-gray-800">DSWR</th>
                  <th className="py-2.5 px-3 font-bold text-gray-800">FRBD</th>
                  <th className="py-2.5 px-3 font-bold text-green-700">GZBD</th>
                  <th className="py-2.5 px-3 font-bold text-gray-800">GALI</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
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
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <button
          onClick={() => fetchMonth(prevDate)}
          disabled={chartLoading}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50"
        >
          {format(prevDate, "MMM yyyy")}
        </button>
        <button
          onClick={() => fetchMonth(nextDate)}
          disabled={chartLoading}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50"
        >
          {format(nextDate, "MMM yyyy")}
        </button>
      </div>
      <Link
        href="/"
        className="block bg-gradient-to-r from-amber-400 to-orange-400 text-center py-3 mt-3 rounded-xl text-sm font-bold text-white hover:shadow-lg hover:-translate-y-0.5 transition-all"
      >
        View Latest Chart for {displayMonth} {displayYear}
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
