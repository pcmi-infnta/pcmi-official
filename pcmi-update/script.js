document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card, index) => {
        card.style.setProperty("--i", index);
        setTimeout(() => {
            card.classList.add("pulse");
        }, (2000 + index * 500)); // Adjust timing based on animation delays
    });
});