document.addEventListener("DOMContentLoaded", (event) => {
  const btn = document.getElementById("btn");
  const sidebar = document.querySelector(".files-sidebar");
  const upload = document.querySelector(".bx-upload");

  // Handle sidebar toggle
  btn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  // Handle folder link clicks
  const folderLinks = document.querySelectorAll(".folder-link");
  folderLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const folderName = e.target
        .closest(".folder-link")
        .querySelector(".folder-name").innerText;
      loadSidebarContent(folderName);
    });
  });

  // Upload button click handler
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.style.display = "none"; // Hidden file input
  document.body.appendChild(fileInput);

  upload.addEventListener("click", () => {
    // Trigger file input click to open file dialog
    fileInput.click();
  });

  // Handle file selection and upload
  fileInput.addEventListener("change", (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      uploadFileToDjango(selectedFile);
    }
  });
});

function loadSidebarContent(folderName) {
  const filesContent = document.querySelector(".files-content");
  filesContent.innerHTML = `<h3>${folderName} Files</h3>`;
  const files = ["File 1", "File 2", "File 3"];
  const fileItems = files
    .map(
      (file) =>
        `<div class="file-item"><i class="bx bx-file"></i><span class="file-name">${file}</span></div>`
    )
    .join("");
  filesContent.innerHTML += `<div class="files-list">${fileItems}</div>`;
}

// Function to upload the selected file to Django
function uploadFileToDjango(file) {
  const formData = new FormData();
  formData.append("file", file);

  fetch("/your-django-upload-url/", {
    method: "POST",
    body: formData,
    headers: {
      // Add any custom headers here, e.g. CSRF token if required
      "X-CSRFToken": getCSRFToken(), // Example for CSRF protection
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("File upload failed");
      }
    })
    .then((data) => {
      console.log("File uploaded successfully:", data);
      // Handle success, e.g., refresh file list
    })
    .catch((error) => {
      console.error("Error uploading file:", error);
    });
}

// Function to get the CSRF token (if needed in Django)
function getCSRFToken() {
  return document.querySelector("[name=csrfmiddlewaretoken]").value;
}
