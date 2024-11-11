// DOM elements
const dropArea = document.getElementById("dropArea");
const imageButton = document.getElementById("imageButton");
const pdfButton = document.getElementById("pdfButton");
const imageFile = document.getElementById("imageFile");
const pdfFile = document.getElementById("pdfFile");
const selectedFilesUl = document.getElementById("selected-files");
const submitButton = document.getElementById("submitButton");
const resultsBox = document.getElementById("resultsBox");
const csvUploadButton = document.getElementById("csvUploadButton");
const csvFileInput = document.getElementById("csvFile");
const csvDataDiv = document.getElementById("csvData");
const userQueryForm = document.getElementById("userQueryForm");
const userQueryInput = document.getElementById("userQueryInput");

// Image editor elements
const imageEditorSidebar = document.getElementById("imageEditorSidebar");
const rotationInput = document.getElementById("rotation");
const flipHorizontalInput = document.getElementById("flip-horizontal");
const flipVerticalInput = document.getElementById("flip-vertical");
const brightnessInput = document.getElementById("brightness");
const contrastInput = document.getElementById("contrast");
const saturationInput = document.getElementById("saturation");
const sharpnessInput = document.getElementById("sharpness");
const zoomInput = document.getElementById("zoom");
const scaleInput = document.getElementById("scale");
const backgroundColorInput = document.getElementById("background-color");

let files = [];

// File handling functions
function handleFiles(newFiles) {
  files = [...files, ...Array.from(newFiles)];
  updateSelectedFiles();
}

function updateSelectedFiles() {
  selectedFilesUl.innerHTML = "";
  files.forEach((file) => {
    const li = document.createElement("li");
    const img = document.createElement("img");
    const span = document.createElement("span");

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else if (file.type === "application/pdf") {
      img.src = "https://img.icons8.com/ios/50/000000/pdf.png";
    }

    span.textContent = file.name;
    li.appendChild(img);
    li.appendChild(span);
    selectedFilesUl.appendChild(li);
  });
}

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight() {
  dropArea.classList.add("highlight");
}

function unhighlight() {
  dropArea.classList.remove("highlight");
}

function handleDrop(e) {
  const dt = e.dataTransfer;
  const newFiles = [...dt.files];
  handleFiles(newFiles);
}

// CSRF token handling
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

// Function to display CSV data in a table
function displayCSVTable(csvContent, containerId) {
  const rows = csvContent.trim().split("\n");
  const headers = rows[0].split(",");
  let tableHTML = '<table class="table table-striped"><thead><tr>';

  headers.forEach((header) => {
    tableHTML += `<th>${header.trim()}</th>`;
  });

  tableHTML += "</tr></thead><tbody>";

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].split(",");
    if (cells.length === headers.length) {
      tableHTML += "<tr>";
      cells.forEach((cell) => {
        tableHTML += `<td>${cell.trim()}</td>`;
      });
      tableHTML += "</tr>";
    }
  }

  tableHTML += "</tbody></table>";
  document.getElementById(containerId).innerHTML = tableHTML;
}

// File upload handling
function uploadFiles() {
  if (files.length === 0) {
    alert("Please select at least one file before submitting.");
    return;
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const csrftoken = getCookie("csrftoken");

  fetch("/intelliventory/", {
    method: "POST",
    body: formData,
    headers: {
      "X-CSRFToken": csrftoken,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        displayCSVTable(data.updatedInventory, "updatedInventory");
        displayCSVTable(data.discrepancies, "discrepancies");
        alert(data.message);
      } else {
        alert("Error processing files: " + data.message);
      }
    })
    .catch((error) => {
      alert("Error uploading files: " + error);
    });
}

// CSV handling
function handleCSVUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const contents = e.target.result;
      displayCSVData(contents);
    };
    reader.readAsText(file);
  }
}

function displayCSVData(csvContent) {
  const rows = csvContent.split("\n");
  const headers = rows[0].split(",");
  let tableHTML = '<table class="csv-table"><thead><tr>';

  headers.forEach((header) => {
    tableHTML += `<th>${header.trim()}</th>`;
  });

  tableHTML += "</tr></thead><tbody>";

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].split(",");
    if (cells.length === headers.length) {
      tableHTML += "<tr>";
      cells.forEach((cell) => {
        tableHTML += `<td>${cell.trim()}</td>`;
      });
      tableHTML += "</tr>";
    }
  }

  tableHTML += "</tbody></table>";
  csvDataDiv.innerHTML = tableHTML;
}

// User query handling
function handleUserQuery(e) {
  e.preventDefault();
  const query = userQueryInput.value;

  const formData = new FormData();
  formData.append("user_query", query);

  const csrftoken = getCookie("csrftoken");

  fetch("/intelliventory/", {
    method: "POST",
    body: formData,
    headers: {
      "X-CSRFToken": csrftoken,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        document.getElementById("aiResponse").textContent = data.aiResponse;
        document.getElementById("generatedCode").textContent =
          data.generatedCode;
      } else {
        alert("Error processing query: " + data.message);
      }
    })
    .catch((error) => {
      alert("Error sending query: " + error);
    });
}

// Image editing functions
function openSidebar() {
  imageEditorSidebar.classList.add("open");
}

function closeSidebar() {
  imageEditorSidebar.classList.remove("open");
}

function applyImageEdits() {
  // This function would apply the edits to the selected image
  // For now, we'll just log the values
  console.log("Rotation:", rotationInput.value);
  console.log("Flip Horizontal:", flipHorizontalInput.checked);
  console.log("Flip Vertical:", flipVerticalInput.checked);
  console.log("Brightness:", brightnessInput.value);
  console.log("Contrast:", contrastInput.value);
  console.log("Saturation:", saturationInput.value);
  console.log("Sharpness:", sharpnessInput.value);
  console.log("Zoom:", zoomInput.value);
  console.log("Scale:", scaleInput.value);
  console.log("Background Color:", backgroundColorInput.value);
}

// Event listeners
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

["dragenter", "dragover"].forEach((eventName) => {
  dropArea.addEventListener(eventName, highlight, false);
});

["dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

dropArea.addEventListener("drop", handleDrop, false);
imageButton.addEventListener("click", () => imageFile.click());
pdfButton.addEventListener("click", () => pdfFile.click());
imageFile.addEventListener("change", (e) => handleFiles(e.target.files));
pdfFile.addEventListener("change", (e) => handleFiles(e.target.files));
submitButton.addEventListener("click", uploadFiles);
csvUploadButton.addEventListener("click", () => csvFileInput.click());
csvFileInput.addEventListener("change", handleCSVUpload);
userQueryForm.addEventListener("submit", handleUserQuery);

// Image editor event listeners
[
  rotationInput,
  flipHorizontalInput,
  flipVerticalInput,
  brightnessInput,
  contrastInput,
  saturationInput,
  sharpnessInput,
  zoomInput,
  scaleInput,
  backgroundColorInput,
].forEach((input) => {
  input.addEventListener("change", applyImageEdits);
});
