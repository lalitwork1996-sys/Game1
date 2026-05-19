import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    if (!slug) {
      return Response.json({ success: false, error: "slug is required" }, { status: 400 });
    }

    // First, find the chart URL for this game from the homepage
    const { data: homeHtml } = await axios.get("https://satta-king-fast.com/", {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const $home = cheerio.load(homeHtml);
    let chartUrl = "";

    $home(`a[href*="/${slug}/satta-result-chart/"]`).each((i, el) => {
      if (!chartUrl) {
        chartUrl = $home(el).attr("href");
      }
    });

    if (!chartUrl) {
      return Response.json({ success: false, error: "Game not found" }, { status: 404 });
    }

    // If month/year provided, modify the URL
    if (month && year) {
      const monthMap = {
        january: "01", february: "02", march: "03", april: "04",
        may: "05", june: "06", july: "07", august: "08",
        september: "09", october: "10", november: "11", december: "12",
      };
      const monthNum = monthMap[month.toLowerCase()];
      const formattedMonth = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
      // Append query params for specific month
      chartUrl = chartUrl + `?month=${monthNum}&year=${year}&ResultFor=${formattedMonth}-${year}`;
    }

    const { data: chartHtml } = await axios.get(chartUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const $ = cheerio.load(chartHtml);

    // Get game name and chart title
    const chartTitle = $("tr.chart-head td.month h1").text().trim();

    // Get column headers
    const columns = [];
    $("tr.date-name th.name").each((i, el) => {
      columns.push($(el).text().trim().toUpperCase());
    });

    // Map common abbreviations to full slugs
    const abbrMap = {
      DSWR: "desawar",
      FRBD: "faridabad",
      GZBD: "ghaziabad",
      GALI: "gali",
      SRGN: "shri-ganesh",
    };

    // Find the game's column - try exact match on chart title first
    // The chart page title contains the game name, and the game's own column
    // is typically named after it. Use the slug from the URL path as reference.
    const gameNameUpper = slug.replace(/-/g, " ").toUpperCase();
    let gameColIndex = -1;

    // Try matching column abbreviation to slug
    columns.forEach((col, i) => {
      const fullName = abbrMap[col];
      if (fullName === slug) {
        gameColIndex = i;
      }
    });

    // Try matching column name directly
    if (gameColIndex === -1) {
      columns.forEach((col, i) => {
        if (col === gameNameUpper) {
          gameColIndex = i;
        }
      });
    }

    // Fallback: the game's own result is usually the LAST column on its chart page
    if (gameColIndex === -1) {
      gameColIndex = columns.length - 1;
    }

    // Get rows
    const results = [];
    $("tr.day-number").each((i, el) => {
      const dayEl = $(el).find("td.day");
      const dateNum = dayEl.text().trim();
      const dateTitle = dayEl.attr("title") || "";

      const numbers = $(el)
        .find("td.number")
        .map((i, item) => $(item).text().trim())
        .get();

      if (dateNum) {
        // Find the day name from the title (e.g., "May 01, 2026")
        let dayName = "";
        if (dateTitle) {
          try {
            const d = new Date(dateTitle);
            dayName = d.toLocaleDateString("en-US", { weekday: "long" });
          } catch {
            dayName = "";
          }
        }

        // Get the game's result (use gameColIndex, or last column as fallback)
        const gameResult = gameColIndex >= 0
          ? (numbers[gameColIndex] || "XX")
          : (numbers[numbers.length - 1] || "XX");

        results.push({
          date: dateTitle || dateNum,
          day: dayName,
          result: gameResult || "XX",
        });
      }
    });

    // Extract displayed month/year from title
    const titleMatch = chartTitle.match(/of\s+(\w+)\s+(\d{4})/);
    const displayMonth = titleMatch ? titleMatch[1] : "";
    const displayYear = titleMatch ? titleMatch[2] : "";

    return Response.json({
      success: true,
      gameName: gameNameUpper,
      chartTitle,
      month: displayMonth,
      year: displayYear,
      columns,
      results,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
