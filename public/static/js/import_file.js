document.querySelector("#my-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const f = new FormData(document.querySelector("#my-form"));
    
    const d = await readFile(f);

    renderFilters(d);   
    renderMarkers(d);

    document.querySelector("#export-md").removeAttribute("hidden");
});

const readFile = async (f) => {
    const r = await fetch("/clippings/import-clipping", {
        method: "PUT",
        body: f
    });

    return (await r.json()).data;
}

const renderMarkers = (data) => {
    return new Promise(r => {
        const markers = document.querySelector("#markers");

        markers.innerHTML = "";

        for (const marker of data) {
            const item = document.createElement("li");
            item.id = "marker---item---" + Math.random().toString(36).substring(2, 9);

            const content = document.createElement("p");
            content.innerHTML = marker.content;
            content.id = "marker---content---" + Math.random().toString(36).substring(2, 9);

            const book = document.createElement("span");
            book.innerHTML = marker.book;
            book.id = "marker---book---" + marker.book

            item.appendChild(content);
            item.appendChild(book);

            markers.appendChild(item);
        }

        r();
    });
}

const renderFilters = (data) => {
    return new Promise(r => {
        ["book"].forEach(el => {
            renderFilter(el, Array.from(new Set(data.map(d => d[el].trim()))));
        });

        document.querySelector(".filters").style.display = "block";

        r();
    });
}

const renderFilter = (name, items) => {
    return new Promise(r => {
        const list = document.querySelector(`.filter__list--${name}s`);

        list.innerHTML = "";

        for (const b of items) {
            const li = document.createElement("li");
            li.className = "list__item";

            const l = document.createElement("label");
            l.className = "item__label";
            l.innerHTML = b;

            const inp = document.createElement("input");
            inp.className = "item__input";
            inp.type = "checkbox";
            inp.checked = true;

            inp.addEventListener("change", e => {
                document.querySelectorAll("[id^=marker---item]").forEach(i => {
                    if (i.querySelector(`[id^=marker---${name}]`).id.split("---")[2].trim() === b.trim()) {
                        if (e.target.checked) {
                            i.removeAttribute("hidden");
                        } else {
                            i.setAttribute("hidden", "");
                        }
                    } 
                });
            });

            li.appendChild(inp);
            li.appendChild(l);

            list.appendChild(li);
        }

        r();
    });
}