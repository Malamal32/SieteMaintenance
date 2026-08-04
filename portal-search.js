
(() => {
    "use strict";

    const data = Array.isArray(window.MAINTENANCE_PORTAL_DATA)
        ? window.MAINTENANCE_PORTAL_DATA
        : [];

    const searchInput = document.getElementById("portal-search");
    const clearButton = document.getElementById("clear-search");
    const resultsGrid = document.getElementById("results-grid");
    const emptyState = document.getElementById("empty-state");
    const machineCount = document.getElementById("machine-count");
    const resultCount = document.getElementById("result-count");
    const filterButtons = [...document.querySelectorAll(".filter-button")];

    let activeDepartment = "All";

    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function searchableText(item) {
        return [
            item.department,
            item.name,
            item.manufacturer,
            item.lines,
            ...(item.keywords || [])
        ].join(" ").toLowerCase();
    }

    function render() {
        const query = searchInput.value.trim().toLowerCase();

        const filtered = data.filter((item) => {
            const departmentMatch =
                activeDepartment === "All" ||
                item.department === activeDepartment;

            const searchMatch =
                query === "" ||
                searchableText(item).includes(query);

            return departmentMatch && searchMatch;
        });

        machineCount.textContent = String(data.length);
        resultCount.textContent = String(filtered.length);
        emptyState.hidden = filtered.length !== 0;

        resultsGrid.innerHTML = filtered.map((item) => {
            const keywords = (item.keywords || [])
                .slice(0, 6)
                .map((keyword) =>
                    `<span class="keyword">${escapeHtml(keyword)}</span>`
                )
                .join("");

            return `
                <article class="machine-card">
                    <div class="machine-card-header">
                        <h3>${escapeHtml(item.name)}</h3>
                        <p class="machine-meta">
                            ${escapeHtml(item.department)} ·
                            ${escapeHtml(item.manufacturer)}
                        </p>
                        <p class="machine-lines">${escapeHtml(item.lines)}</p>
                        <div class="keyword-list">${keywords}</div>
                    </div>

                    <nav
                        class="resource-links"
                        aria-label="${escapeHtml(item.name)} resources"
                    >
                        <a href="${escapeHtml(item.machinePage)}">Machine</a>
                        <a href="${escapeHtml(item.sopPage)}">SOPs</a>
                        <a href="${escapeHtml(item.manualPage)}">Manuals</a>
                    </nav>
                </article>
            `;
        }).join("");
    }

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeDepartment = button.dataset.department || "All";

            filterButtons.forEach((item) => {
                item.classList.toggle("active", item === button);
            });

            render();
        });
    });

    searchInput.addEventListener("input", render);

    clearButton.addEventListener("click", () => {
        searchInput.value = "";
        searchInput.focus();
        render();
    });

    render();
})();
