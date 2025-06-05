// import express from "express";
// import axios from "axios";
// import cors from "cors";
// import dotenv from "dotenv";
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3001;

// const API_URL = process.env.ROYALE_API_URL || "https://api.clashroyale.com/v1";
// const API_TOKEN = process.env.ROYALE_API_TOKEN; 

// if (!API_TOKEN) {
//     console.error("❌ Royale API token is missing. Please set ROYALE_API_TOKEN in your .env file.");
//     process.exit(1);
// }

// app.use(cors());

// app.get("/api/player/:tag", async (req, res) => {
//     let tag = req.params.tag;
//     if (!tag.startsWith("#")) tag = "#" + tag;
//     tag = tag.replace("#", "%23");

//     try {
//         const { data } = await axios.get(
//             `${API_URL}/players/${tag}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${API_TOKEN}`,
//                 },
//             }
//         );
//         res.json(data);
//     } catch (err) {
//         console.error("Error fetching player:", err.response?.data || err.message);
//         res.status(500).json({ error: "Player not found or API error!" });
//     }
// });

// app.listen(PORT, () => {
//     console.log(`🟢 Backend online at http://localhost:${PORT}`);
// });
// api/player.js

import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const API_URL = process.env.ROYALE_API_URL || "https://api.clashroyale.com/v1";
const API_TOKEN = process.env.ROYALE_API_TOKEN;

if (!API_TOKEN) {
  throw new Error("❌ Royale API token is missing. Set ROYALE_API_TOKEN in Vercel env vars.");
}

app.get("/api/player/:tag", async (req, res) => {
  let tag = req.params.tag;
  if (!tag.startsWith("#")) tag = "#" + tag;
  tag = tag.replace("#", "%23");

  try {
    const { data } = await axios.get(`${API_URL}/players/${tag}`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    });
    res.json(data);
  } catch (err) {
    console.error("Error fetching player:", err.response?.data || err.message);
    res.status(500).json({ error: "Player not found or API error!" });
  }
});

export default app;
