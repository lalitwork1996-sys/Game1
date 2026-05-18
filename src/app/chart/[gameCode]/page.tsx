"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getChartData, getAvailableChartMonths } from "@/lib/firestore";
import { ChartTable } from "@/components/charts/ChartTable";
import { Loading } from "@/components/ui/Loading";
import { DEFAULT_GAMES, getMonthName } from "@/lib/utils";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { ChartHistory } from "@/types";

export default function GameChartPage({
  params,
}: {
  params: Promise<{ gameCode: string }>;
}) {
  const { gameCode } = use(params);
  const router = useRouter();
  const [chart, setChart] = useState<ChartHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const game = DEFAULT_GAMES.find((g) => g.gameCode === gameCode);
  const gameName = game?.gameName || gameCode.toUpperCase();

  useEffect(() => {
    setLoading(true);
    getChartData(gameCode, year, month)
      .then(setChart)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [gameCode, year, month]);

  function navigateMonth(direction: -1 | 1) {
    let newMonth = month + direction;
    let newYear = year;
    if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    } else if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    }
    setMonth(newMonth);
    setYear(newYear);
  }

  const isCurrentMonth =
    year === new Date().getFullYear() && month === new Date().getMonth() + 1;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold text-[#1e3a5f] text-center mb-2">
        {gameName} Chart Record
      </h1>
      <p className="text-center text-gray-500 text-sm mb-6">
        Monthly result history for {gameName}
      </p>

      {/* Month Navigation */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Previous month"
        >
          <FiChevronLeft size={20} />
        </button>
        <div className="text-lg font-bold text-[#1e3a5f] min-w-[200px] text-center">
          {getMonthName(month)} {year}
        </div>
        <button
          onClick={() => navigateMonth(1)}
          disabled={isCurrentMonth}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next month"
        >
          <FiChevronRight size={20} />
        </button>
      </div>

      {/* Chart Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <Loading text="Loading chart..." />
        ) : chart ? (
          <ChartTable records={chart.records} gameName={gameName} />
        ) : (
          <div className="text-center py-12 text-gray-500">
            No chart data available for {getMonthName(month)} {year}.
          </div>
        )}
      </div>

      {/* Back link */}
      <div className="text-center mt-6">
        <button
          onClick={() => router.push("/charts")}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          &larr; Back to All Charts
        </button>
      </div>
    </div>
  );
}
