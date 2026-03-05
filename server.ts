import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Spotify OAuth Routes
  app.get("/api/auth/spotify/url", (req, res) => {
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const redirect_uri = `${process.env.APP_URL || 'http://localhost:3000'}/auth/callback`;
    const scope = "user-read-private user-read-email user-modify-playback-state user-read-playback-state streaming";
    
    const params = new URLSearchParams({
      response_type: "code",
      client_id: client_id || "",
      scope: scope,
      redirect_uri: redirect_uri,
    });

    res.json({ url: `https://accounts.spotify.com/authorize?${params.toString()}` });
  });

  app.get("/auth/callback", async (req, res) => {
    const code = req.query.code as string;
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirect_uri = `${process.env.APP_URL || 'http://localhost:3000'}/auth/callback`;

    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64"),
        },
        body: new URLSearchParams({
          code: code,
          redirect_uri: redirect_uri,
          grant_type: "authorization_code",
        }),
      });

      const data = await response.json();
      
      // In a real app, we'd store this in a session. 
      // For this demo, we'll pass it back to the client via postMessage.
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'SPOTIFY_AUTH_SUCCESS', tokens: ${JSON.stringify(data)} }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Spotify Auth Error:", error);
      res.status(500).send("Authentication failed");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
