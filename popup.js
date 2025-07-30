document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      chrome.runtime.sendMessage({ type: "login" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error sending message:", chrome.runtime.lastError.message);
        } else if (response && response.success) {
          alert("Logged in! Token: " + response.token);
        } else {
          alert("Login failed: " + (response?.error || "Unknown error"));
        }
      });
    });
  }
});