(async () => {
  // ==== CONFIG ====
  const apiKey = "12fa7d10508c20aff9fe3ba13381028b"; // <-- your key (don't commit this publicly)
  const lat = 8.480029611319042;
  const lon = 124.6251441802532;
  const units = "metric";

  const currentUrl  = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;

  // ==== HELPERS ====
  const toTitle = s => s ? s[0].toUpperCase() + s.slice(1) : s;

  // Convert a UTC unix timestamp to a local-**city** date string using the city's timezone offset (seconds)
  function localDateKey(dtUnix, tzOffsetSeconds){
    const utcMs = dtUnix * 1000;
    const localMs = utcMs + (tzOffsetSeconds * 1000);
    const d = new Date(localMs);
    // YYYY-MM-DD for grouping
    return d.getUTCFullYear() + "-" +
           String(d.getUTCMonth()+1).padStart(2,"0") + "-" +
           String(d.getUTCDate()).padStart(2,"0");
  }

  function weekdayNameFromKey(key){ // key = "YYYY-MM-DD"
    const [y,m,d] = key.split("-").map(Number);
    const date = new Date(Date.UTC(y, m-1, d));
    return date.toLocaleDateString(undefined, { weekday: "long" }); // user locale
  }

  function iconUrl(icon){ return `https://openweathermap.org/img/wn/${icon}@2x.png`; }

  // ==== RENDER TARGETS ====
  const tempEl = document.getElementById("current-temp");
  const descEl = document.getElementById("current-desc");
  const iconEl = document.getElementById("current-icon");
  const forecastList = document.getElementById("forecast");

  try {
    // ---- CURRENT ----
    const currentRes = await fetch(currentUrl);
    if(!currentRes.ok) throw new Error("Failed to load current weather");
    const current = await currentRes.json();

    const currentTemp = Math.round(current.main.temp);
    const currentDesc = toTitle(current.weather?.[0]?.description || "—");
    const currentIcon = current.weather?.[0]?.icon;

    tempEl.textContent = `${currentTemp}°C`;
    descEl.textContent = currentDesc;
    if(currentIcon){
      iconEl.src = iconUrl(currentIcon);
      iconEl.alt = currentDesc;
    }

    // ---- FORECAST (3-day) ----
    const forecastRes = await fetch(forecastUrl);
    if(!forecastRes.ok) throw new Error("Failed to load forecast");
    const forecastData = await forecastRes.json();

    const tzOffset = forecastData.city?.timezone ?? 0;
    const todayKey  = localDateKey(Math.floor(Date.now()/1000), tzOffset);

    // Group by local date (skip today), then take next 3 unique days
    const groups = new Map();
    for(const item of forecastData.list){
      const key = localDateKey(item.dt, tzOffset);
      if(key === todayKey) continue; // skip remainder of today
      if(!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    }

    const nextThreeDays = Array.from(groups.keys()).slice(0,3);

    // Build summary per day: min/max temp and a representative icon/desc (prefer around 12:00)
    const dayCards = nextThreeDays.map(key => {
      const entries = groups.get(key);
      let min = Infinity, max = -Infinity;

      // Find entry closest to 12:00 (noon) local for nicer icon/desc
      const noonTargetHour = 12;
      let best = entries[0];
      let bestScore = Infinity;

      for(const e of entries){
        const localKey = localDateKey(e.dt, tzOffset);
        if(localKey !== key) continue;
        const localMs = (e.dt + tzOffset) * 1000;
        const hh = new Date(localMs).getUTCHours();
        const t = e.main.temp;
        if(t < min) min = t;
        if(t > max) max = t;
        const score = Math.abs(hh - noonTargetHour);
        if(score < bestScore){ bestScore = score; best = e; }
      }

      const desc = toTitle(best.weather?.[0]?.description || "");
      const icon = best.weather?.[0]?.icon;

      return {
        key,
        label: weekdayNameFromKey(key),
        min: Math.round(min),
        max: Math.round(max),
        desc,
        icon
      };
    });

    // Render forecast
    forecastList.innerHTML = "";
    for(const d of dayCards){
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="day">${d.label}</div>
        <div class="range">${d.min}°C – ${d.max}°C</div>
        <img src="${iconUrl(d.icon)}" alt="${d.desc}" width="48" height="48" loading="lazy">
        <div class="desc" style="text-transform:capitalize">${d.desc}</div>
      `;
      forecastList.appendChild(li);
    }

    if(dayCards.length < 3){
      // If for any reason fewer than 3 days (rare), pad with placeholders
      for(let i = dayCards.length; i < 3; i++){
        const li = document.createElement("li");
        li.textContent = "Forecast unavailable";
        forecastList.appendChild(li);
      }
    }
  } catch (err){
    console.error(err);
    descEl.textContent = "Weather unavailable";
    forecastList.innerHTML = `<li>Forecast unavailable</li><li>Forecast unavailable</li><li>Forecast unavailable</li>`;
  }
})();