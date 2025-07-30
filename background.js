chrome.runtime.onInstalled.addListener(() => {
  console.log("Spotify Extension installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "login") {
    const clientId = "f6bd05aa3328406c958040912ed82fe1";
    const redirectUri = chrome.identity.getRedirectURL();
    const scopes = [
      "user-read-private",
      "user-read-email"
    ];
    const authUrl = `https://accounts.spotify.com/authorize?` +
      `client_id=${clientId}` +
      `&response_type=token` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scopes.join(" "))}`;

    chrome.identity.launchWebAuthFlow(
      {
        url: authUrl,
        interactive: true
      },
      function (redirectUrl) {
        if (chrome.runtime.lastError) {
          console.error("OAuth error:", chrome.runtime.lastError.message);
           sendResponse({ success: false, error: chrome.runtime.lastError.message });
          return;
        }

        if (redirectUrl) {
          // Parse access_token from URL fragment
          const fragment = new URLSearchParams(redirectUrl.split("#")[1]);
          const accessToken = fragment.get('access_token');

          if (accessToken) {
            console.log("Access Token retrieved:", accessToken);
            sendResponse({ success: true, token: accessToken });
            // You can store or use the token here
          } else {
            console.error("Access token not found in redirect URL");
             sendResponse({ success: false, error: "No access token" });
          }
        }
      }
    );
    return true;
  }
});
