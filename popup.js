document.getElementById("loginBtn").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "login" }, (response) => {
    if (response?.token) {
      console.log("Access Token:", response.token);
      alert("Logged in!");
      // You can now use this token to make Spotify Web API calls
    } else {
      alert("Spotify login failed.");
    }
  });
});