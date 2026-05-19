
// const axios = require("axios");
// const cheerio = require("cheerio");

// async function getResults() {
//   try {
//     const { data } = await axios.get("https://satta-king-fast.com/", {
//       headers: {
//         "User-Agent":
//           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
//       }
//     });

//     const $ = cheerio.load(data);

//     const results = [];

//     $("tr.game-result").each((i, el) => {
//       results.push({
//         // name: $(el).find(".game-details").text().trim(),
//         yesterday: $(el).find(".yesterday-number h3").text().trim(),
//         today: $(el).find(".today-number h3").text().trim(),
//       });
//     });

//     console.log(results);
//   } catch (err) {
//     console.log(err.message);
//   }
// }

// getResults();
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET() {
  try {
    const { data } = await axios.get("https://satta-king-fast.com/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });

    const $ = cheerio.load(data);
    const results = [];

    $("tr.game-result").each((i, el) => {
      results.push({
        name: $(el).find(".game-name").text().trim(),
        time: $(el).find(".game-time").text().trim(),
        yesterday: $(el).find(".yesterday-number h3").text().trim(),
        today: $(el).find(".today-number h3").text().trim(),
      });
    });

    return Response.json(results);

  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}