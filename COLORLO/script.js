let currentPalette = [];

function randomColor() {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function generatePalette() {
    const container = document.getElementById("palette-container");
    container.innerHTML = "";
    currentPalette = [];

    for (let i = 0; i < 5; i++) {
        let color = randomColor();
        currentPalette.push(color);

        let div = document.createElement("div");
        div.className = "color-box";
        div.style.background = color;
        div.innerText = color;

        container.appendChild(div);
    }
}

function savePalette() {
    if (currentPalette.length === 0) {
        alert("Generate a palette first!");
        return;
    }

    let saved = JSON.parse(localStorage.getItem("palettes")) || [];

    // prevent duplicates
    let exists = saved.some(p =>
        JSON.stringify(p) === JSON.stringify(currentPalette)
    );

    if (exists) {
        alert("This palette is already saved!");
        return;
    }

    saved.push(currentPalette);
    localStorage.setItem("palettes", JSON.stringify(saved));

    alert("Palette Saved!");
}

// auto generate on load
generatePalette();