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

    let isRestSection = false;

    $("tr").each((i, el) => {

      // section heading detect
      const heading = $(el)
        .find("td.games-name h3")
        .text()
        .trim();

      // REST section start
      if (heading === "REST") {
        isRestSection = true;
        return;
      }

      // agar LIVE aa gaya to REST stop
      if (
        isRestSection &&
        heading &&
        heading !== "REST"
      ) {
        isRestSection = false;
      }

      // REST rows
      if (
        isRestSection &&
        ($(el).hasClass("game-result") ||
          $(el).hasClass("game-result highlight"))
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