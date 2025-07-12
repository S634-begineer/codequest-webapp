console.log("script.js loaded");

// Show the About Us modal
document.getElementById("open-about").addEventListener("click", function (e) {
    e.preventDefault(); // Prevent default link behavior
    document.getElementById("about-modal-container").style.display = "flex";
});

// Close the About Us modal
document.getElementById("close-about").addEventListener("click", function () {
    document.getElementById("about-modal-container").style.display = "none";
});


//for modal to open when about us click
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("form[role='search']").addEventListener("submit", function (event) {
        event.preventDefault();

        const searchValue = document.getElementById("searchInput").value.toLowerCase().trim();
        const cards = document.querySelectorAll(".card");

        let found = false;

        cards.forEach(card => {
            const title = card.querySelector(".card-title").textContent.toLowerCase();
            if (title === searchValue) {
                card.style.display = "";
                found = true;
            } else {
                card.style.display = "none";
            }
        });

        if (!found) {
            alert("No matching language found!");
        }
    });
});


// Open and close challenges  modal
document.getElementById("open-challenges").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("challenges-modal-container").style.display = "block";
});

document.getElementById("close-challenges").addEventListener("click", function () {
    document.getElementById("challenges-modal-container").style.display = "none";
});

// Redirect to selected challenge
function openChallenge(fileName) {
    window.location.href = fileName;
}

//for available langauges
document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("toggle-language-support");
    const list = document.getElementById("language-support-list");

    if (toggle && list) {
      toggle.addEventListener("click", function () {
        list.style.display = list.style.display === "none" ? "block" : "none";
      });
    }
  });
