const container = document.getElementById("saved-container");

let palettes = JSON.parse(localStorage.getItem("palettes")) || [];

if (palettes.length === 0) {
    container.innerHTML = "<p>No saved palettes yet.</p>";
}

palettes.forEach((palette, index) => {
    let wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.marginBottom = "20px";

    palette.forEach(color => {
        let div = document.createElement("div");
        div.className = "color-box";
        div.style.background = color;
        div.innerText = color;

        wrapper.appendChild(div);
    });

    // delete button
    let delBtn = document.createElement("button");
    delBtn.innerText = "Delete";

    delBtn.onclick = () => {
        palettes.splice(index, 1);
        localStorage.setItem("palettes", JSON.stringify(palettes));
        location.reload();
    };

    wrapper.appendChild(delBtn);
    container.appendChild(wrapper);
});