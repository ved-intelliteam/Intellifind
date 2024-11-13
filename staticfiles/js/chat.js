document.addEventListener("DOMContentLoaded", function () {
  let sidebar = document.querySelector(".sidebar");
  const toggleBtn = document.querySelector("#btn");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatContainer = document.getElementById("chat-container");
  const chatMessages = document.getElementById("chat-messages");
  const mainContent = document.getElementById("main-content");

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    updateToggleIcon();
  });
  function updateToggleIcon() {
    if (sidebar.classList.contains("open")) {
      toggleBtn.classList.replace("bx-menu", "bx bx-menu");
    } else {
      toggleBtn.classList.replace("bx bx-menu", "bx-menu");
    }
  }

  function addMessage(content, isUser) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", isUser ? "user-message" : "ai-message");
    chatMessages.appendChild(messageDiv);

    if (isUser) {
      messageDiv.textContent = content;
    } else {
      const words = content.split(" ");
      let wordIndex = 0;

      function displayNextWord() {
        if (wordIndex < words.length) {
          messageDiv.textContent +=
            (wordIndex > 0 ? " " : "") + words[wordIndex];
          wordIndex++;
          chatContainer.scrollTop = chatContainer.scrollHeight;
          setTimeout(displayNextWord, 100);
        }
      }

      displayNextWord();
    }
  }

  function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
      if (mainContent.style.display !== "none") {
        mainContent.style.display = "none";
        chatContainer.classList.remove("d-none");
      }

      addMessage(message, true);
      chatInput.value = "";

      fetch("/chatbot/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({ user_input: message }),
      })
        .then((response) => {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return response.json();
          } else {
            return response.text();
          }
        })
        .then((data) => {
          let aiResponse;
          if (typeof data === "object" && data.response) {
            // JSON response
            aiResponse = data.response;
          } else if (typeof data === "string") {
            // HTML response
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, "text/html");
            const responseElement = doc.querySelector("#ai-response");
            aiResponse = responseElement ? responseElement.textContent : data;
          } else {
            throw new Error("Unexpected response format");
          }
          addMessage(aiResponse, false);
        })
        .catch((error) => {
          console.error("Error:", error);
          addMessage(
            "Sorry, there was an error processing your request.",
            false
          );
        });
    }
  }

  chatForm.addEventListener("submit", function (e) {
    e.preventDefault();
    sendMessage();
  });

  chatInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  window.addEventListener("resize", function () {
    if (window.innerWidth <= 768) {
      sidebar.classList.remove("open");
      updateToggleIcon();
    }
  });

  // Get the icon elements
  const icons = document.querySelectorAll(".sidebar .menu li a i");

  // Add event listener to the icon elements
  icons.forEach((icon) => {
    icon.addEventListener("click", () => {
      // Toggle the icon
      icon.classList.toggle("active");
    });
  });
});

// JavaScript to handle dropdown functionality
const avatar = document.getElementById("avatar");
const dropdown = document.getElementById("dropdown");

// Toggle dropdown on avatar click
avatar.addEventListener("click", () => {
  dropdown.style.display =
    dropdown.style.display === "none" || dropdown.style.display === ""
      ? "block"
      : "none";
});

// Handle logout click
document.getElementById("logout").addEventListener("click", () => {
  window.location.href = "/logout"; // Redirect to logout URL
});

// Close dropdown if clicking outside of it
window.addEventListener("click", (event) => {
  if (!avatar.contains(event.target)) {
    dropdown.style.display = "none";
  }
});
