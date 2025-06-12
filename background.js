const CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID';
const REDIRECT_URI = chrome.identity.getRedirectURL("callback");
const SCOPES = [
  "user-read-playback-state",
  "user-modify-playback-state",
  "playlist-modify-public",
  "playlist-read-private"
].join(" ");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "login") {
    const authUrl = `https://accounts.spotify.com/authorize?` +
      `client_id=${CLIENT_ID}&` +
      `response_type=token&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `scope=${encodeURIComponent(SCOPES)}`;

    chrome.identity.launchWebAuthFlow({
      url: authUrl,
      interactive: true
    }, (redirectUrl) => {
      if (chrome.runtime.lastError || !redirectUrl) {
        console.error("OAuth error:", chrome.runtime.lastError);
        sendResponse({ error: "Authorization failed" });
        return;
      }

      const tokenMatch = redirectUrl.match(/[#&]access_token=([^&]+)/);
      const token = tokenMatch ? tokenMatch[1] : null;

      if (token) {
        console.log("Spotify token:", token);
        sendResponse({ token });
      } else {
        sendResponse({ error: "No token received" });
      }
    });

    return true; 
  }
});