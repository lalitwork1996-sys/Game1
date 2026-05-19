import axios from "axios";
import * as cheerio from "cheerio";

export async function GET() {
  try {
    const { data } = await axios.get(
      "https://satta-king-fast.com/",
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      }
    );

    const $ = cheerio.load(data);

    const results = [];

    // NEXT section ke rows
    let isNextSection = false;

    $("tr").each((i, el) => {

      // NEXT heading detect
      const heading = $(el)
        .find("td.games-name h3")
        .text()
        .trim();

      if (heading === "NEXT") {
        isNextSection = true;
        return;
      }

      // agar new section start ho gaya to stop
      if (
        isNextSection &&
        heading &&
        heading !== "NEXT"
      ) {
        return false;
      }

      // NEXT section data
      if (
        isNextSection &&
        $(el).hasClass("game-result")
      ) {

        const name = $(el)
          .find(".game-name")
          .text()
          .trim();

        const time = $(el)
          .find(".game-time")
          .text()
          .replace("at", "")
          .trim();

        const yesterday = $(el)
          .find(".yesterday-number h3")
          .text()
          .trim();

        const today = $(el)
          .find(".today-number h3")
          .text()
          .trim();

        if (name) {
          results.push({
            name,
            time,
            yesterday,
            today,
          });
        }
      }
    });

    return Response.json({
      success: true,
      total: results.length,
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