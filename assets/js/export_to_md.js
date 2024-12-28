document.querySelector("#export-md").addEventListener("click", () => {
    const markers = Array.from(document.querySelectorAll("[id^=marker---item---]"))
        .filter(m => {
            return !m.hasAttribute("hidden");
        })
        .map(m => m.querySelector(`[id^=marker---content]`).innerHTML);

    const md = markers.join("\n\n");

    const b = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(b);

    const a = document.createElement("a");
    a.href = url;
    a.download = "markers.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
});