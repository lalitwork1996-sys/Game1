import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const monthName = searchParams.get("month") || "may";
    const year = searchParams.get("year") || "2026";

    const monthMap = {
      january: "01",
      february: "02",
      march: "03",
      april: "04",
      may: "05",
      june: "06",
      july: "07",
      august: "08",
      september: "09",
      october: "10",
      november: "11",
      december: "12",
    };

    const monthNumber = monthMap[monthName.toLowerCase()];

    const formattedMonth =
      monthName.charAt(0).toUpperCase() +
      monthName.slice(1).toLowerCase();

    const url = `https://satta-king-fast.com/chart.php?ResultFor=${formattedMonth}-${year}&month=${monthNumber}&year=${year}`;

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(data);

    const results = [];

    $("table.chart-table tr.day-number").each((i, el) => {
      const date = $(el).find("td.day").text().trim();

      let numbers = $(el)
        .find("td.number")
        .map((i, item) => $(item).text().trim())
        .get();

      // hidden extra first value remove
      if (numbers.length > 4) {
        numbers.shift();
      }

      if (date) {
        results.push({
          date,
          dswr: numbers[0] || "XX",
          frbd: numbers[1] || "XX",
          gzbd: numbers[2] || "XX",
          gali: numbers[3] || "XX",
        });
      }
    });

    return Response.json({
      success: true,
      month: formattedMonth,
      year,
      results,
    });

  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}