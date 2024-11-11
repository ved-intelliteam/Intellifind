document.addEventListener('DOMContentLoaded', function() {
    let sidebar = document.querySelector(".sidebar");
    let closeBtn = document.querySelector("#btn");

    closeBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");
        menuBtnChange();
    });

    function menuBtnChange() {
        if (sidebar.classList.contains("open")) {
            closeBtn.classList.replace("bx-left-arrow-alt", "bx-menu");
        } else {
            closeBtn.classList.replace("bx-menu", "bx-left-arrow-alt");
        }
    }

    // Handle chat form submission
    document.getElementById('chatForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const chatInput = document.getElementById('chatInput');
        const query = chatInput.value.trim();

        if (query) {
            // Send POST request
            fetch('/your-api-endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                // Handle the response here (e.g., display the bot's reply)
            })
            .catch((error) => {
                console.error('Error:', error);
            });

            // Clear the input field
            chatInput.value = '';
        }
    });
});