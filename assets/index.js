document.querySelector("#my-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const f = new FormData(document.querySelector("#my-form"));
    
    const r = await fetch("/read-file", {
        method: "POST",
        body: f
    });

    const d = await r.json();

    const markers = document.querySelector("#markers");

    markers.innerHTML = "";

    for (const marker of d) {
        const item = document.createElement("li");
        item.innerHTML = marker.content;

        markers.appendChild(item);
    }
});