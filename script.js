(function () {
  "use strict";

  const board = document.getElementById("board");
  const emptyState = document.getElementById("empty-state");
  const resultCount = document.getElementById("result-count");
  const qInput = document.getElementById("q");
  const locationSelect = document.getElementById("location");
  const categorySelect = document.getElementById("category");
  const typeSelect = document.getElementById("type");
  const sortSelect = document.getElementById("sort");
  const chipRow = document.getElementById("chip-row");
  const clearBtn = document.getElementById("clear-filters");

  const saved = new Set();

  // ---- Build filter option lists from data ----
  function uniqueSorted(list) {
    return [...new Set(list)].sort((a, b) => a.localeCompare(b, "vi"));
  }

  function populateSelect(select, values) {
    values.forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      select.appendChild(opt);
    });
  }

  const locations = uniqueSorted(JOBS.map((j) => j.location));
  const categories = uniqueSorted(JOBS.map((j) => j.category));
  const types = uniqueSorted(JOBS.map((j) => j.type));

  populateSelect(locationSelect, locations);
  populateSelect(categorySelect, categories);
  populateSelect(typeSelect, types);

  // ---- Quick-filter chips (top categories by volume) ----
  const categoryCounts = categories
    .map((c) => ({ name: c, count: JOBS.filter((j) => j.category === c).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  categoryCounts.forEach(({ name }) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = name;
    chip.setAttribute("aria-pressed", "false");
    chip.addEventListener("click", () => {
      const nowActive = chip.getAttribute("aria-pressed") !== "true";
      // reset all chips
      chipRow.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", "false"));
      categorySelect.value = nowActive ? name : "";
      if (nowActive) chip.setAttribute("aria-pressed", "true");
      render();
    });
    chipRow.appendChild(chip);
  });

  function syncChipsWithSelect() {
    const val = categorySelect.value;
    chipRow.querySelectorAll(".chip").forEach((c) => {
      c.setAttribute("aria-pressed", c.textContent === val ? "true" : "false");
    });
  }

  // ---- Helpers ----
  function formatSalary(min, max) {
    return `${min} – ${max} triệu / tháng`;
  }

  function formatPosted(daysAgo) {
    if (daysAgo === 0) return "Đăng hôm nay";
    if (daysAgo === 1) return "Đăng hôm qua";
    return `Đăng ${daysAgo} ngày trước`;
  }

  function matchesQuery(job, q) {
    if (!q) return true;
    const hay = `${job.title} ${job.company} ${job.tags.join(" ")}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  }

  // ---- Core filter + sort ----
  function getFiltered() {
    const q = qInput.value.trim();
    const loc = locationSelect.value;
    const cat = categorySelect.value;
    const type = typeSelect.value;

    let list = JOBS.filter((j) =>
      matchesQuery(j, q) &&
      (!loc || j.location === loc) &&
      (!cat || j.category === cat) &&
      (!type || j.type === type)
    );

    const sort = sortSelect.value;
    if (sort === "new") {
      list = list.slice().sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    } else if (sort === "salary-desc") {
      list = list.slice().sort((a, b) => b.salaryMax - a.salaryMax);
    } else if (sort === "salary-asc") {
      list = list.slice().sort((a, b) => a.salaryMin - b.salaryMin);
    }

    return list;
  }

  // ---- Render ----
  function renderCard(job) {
    const card = document.createElement("article");
    card.className = "job-card";
    card.setAttribute("aria-label", job.title);

    const isRemote = job.type === "Từ xa";
    const isSaved = saved.has(job.id);

    card.innerHTML = `
      <div class="pin" aria-hidden="true"></div>
      <div class="job-card-head">
        <div>
          <h3 class="job-title">${job.title}</h3>
          <p class="job-company">${job.company}</p>
        </div>
        <span class="job-badge ${isRemote ? "remote" : ""}">${job.type}</span>
      </div>
      <div class="job-meta">
        <span>📍 ${job.location}</span>
        <span>🏷️ ${job.category}</span>
      </div>
      <p class="job-salary">${formatSalary(job.salaryMin, job.salaryMax)}</p>
      <div class="job-tags">
        ${job.tags.map((t) => `<span>${t}</span>`).join("")}
      </div>
      <div class="tear-strip">
        <span class="posted-note">${formatPosted(job.postedDaysAgo)}</span>
        <button type="button" class="tear-btn" data-id="${job.id}">
          ${isSaved ? "✓ Đã lưu" : "Lưu tin"}
        </button>
      </div>
      <span class="code-tab">#${job.code}</span>
    `;

    card.querySelector(".tear-btn").addEventListener("click", (e) => {
      const btn = e.currentTarget;
      if (saved.has(job.id)) {
        saved.delete(job.id);
        btn.textContent = "Lưu tin";
      } else {
        saved.add(job.id);
        btn.textContent = "✓ Đã lưu";
      }
    });

    return card;
  }

  function render() {
    const list = getFiltered();
    board.innerHTML = "";
    list.forEach((job) => board.appendChild(renderCard(job)));

    resultCount.textContent = `${list.length} tin phù hợp / ${JOBS.length} tin`;
    emptyState.hidden = list.length !== 0;
    board.hidden = list.length === 0;
    syncChipsWithSelect();
  }

  // ---- Wire up events ----
  let debounceTimer;
  qInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(render, 150);
  });
  [locationSelect, categorySelect, typeSelect, sortSelect].forEach((el) =>
    el.addEventListener("change", render)
  );

  clearBtn.addEventListener("click", () => {
    qInput.value = "";
    locationSelect.value = "";
    categorySelect.value = "";
    typeSelect.value = "";
    sortSelect.value = "new";
    render();
  });

  render();
})();
