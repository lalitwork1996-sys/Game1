// import axios from "axios";
// import * as cheerio from "cheerio";

// export async function GET() {
//   try {
//     const { data } = await axios.get("https://satta-king-fast.com/", {
//       headers: {
//         "User-Agent": "Mozilla/5.0"
//       }
//     });

//     const $ = cheerio.load(data);

//     const liveResults = [];

//     $("tr.game-result").each((i, el) => {
//       const gameName = $(el)
//         .find(".game-name")
//         .text()
//         .trim();

//       const gameTime = $(el)
//         .find(".game-time")
//         .text()
//         .trim();

//       const yesterdayNumber = $(el)
//         .find(".yesterday-number h3")
//         .text()
//         .trim();

//       const todayNumber = $(el)
//         .find(".today-number h3")
//         .text()
//         .trim();

//       // empty rows skip
//       if (gameName) {
//         liveResults.push({
//           gameName,
//           gameTime,
//           yesterdayNumber,
//           todayNumber
//         });
//       }
//     });

//     return Response.json({
//       success: true,
//       data: liveResults
//     });

//   } catch (error) {
//     return Response.json({
//       success: false,
//       error: error.message
//     }, {
//       status: 500
//     });
//   }
// }

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

    let isLiveSection = false;

    $("tr").each((i, el) => {

      // section heading
      const heading = $(el)
        .find("td.games-name h3")
        .text()
        .trim();

      // LIVE section start
      if (heading === "LIVE") {
        isLiveSection = true;
        return;
      }

      // agar NEXT aa gaya to LIVE stop
      if (heading === "NEXT") {
        isLiveSection = false;
      }

      // LIVE data rows
      if (
        isLiveSection &&
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