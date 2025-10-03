// ==UserScript==
// @name         Netflix IMDb + RT Ratings (Stable)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show IMDb + Rotten Tomatoes ratings on Netflix without flicker
// @match        https://www.netflix.com/*
// @grant        GM_xmlhttpRequest
// @connect      omdbapi.com
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = "Put your key"; // Replace with your OMDb API key

    const selectors = [
        'h1[data-uia="title-info-title"]',
        '[data-uia="video-title"]',
        '.title-title',
        '.previewModal--player-container h4',
        '.previewModal--section-header strong'
    ];

    function createWrapper() {
        const wrapper = document.createElement("div");
        wrapper.id = "ratings-wrapper";
        wrapper.style.display = "flex";
        wrapper.style.gap = "12px";
        wrapper.style.alignItems = "center";
        wrapper.style.marginTop = "8px";
        wrapper.style.fontWeight = "bold";
        wrapper.style.fontSize = "16px";
        return wrapper;
    }

    function updateWrapper(imdb, rt) {
        let wrapper = document.querySelector("#ratings-wrapper");

        if (!wrapper) {
            wrapper = createWrapper();
            const container = document.querySelector('.buttonControls--container');
            if (container) {
                container.insertAdjacentElement("afterend", wrapper);
            } else {
                console.log("⚠️ Could not find container for wrapper.");
                return;
            }
        }

        // Clear old content
        wrapper.innerHTML = "";

        // IMDb badge
        if (imdb) {
            const imdbEl = document.createElement("div");
            imdbEl.style.background = "#222";
            imdbEl.style.color = "#f5c518";
            imdbEl.style.padding = "4px 8px";
            imdbEl.style.borderRadius = "6px";
            imdbEl.textContent = `⭐ IMDb: ${imdb}`;
            wrapper.appendChild(imdbEl);
        }

        // Rotten Tomatoes badge
        if (rt) {
            const rtEl = document.createElement("div");
            rtEl.style.background = "#222";
            rtEl.style.color = "#ff4444";
            rtEl.style.padding = "4px 8px";
            rtEl.style.borderRadius = "6px";
            rtEl.textContent = `🍅 RT: ${rt}`;
            wrapper.appendChild(rtEl);
        }
    }

    function fetchRatings(title) {
        console.log("🔍 Fetching ratings for:", title);

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (!data || data.Response === "False") return;

                    const imdb = data.imdbRating && data.imdbRating !== "N/A" ? data.imdbRating : null;
                    let rt = null;

                    if (data.Ratings) {
                        const rtRating = data.Ratings.find(r => r.Source === "Rotten Tomatoes");
                        if (rtRating) rt = rtRating.Value;
                    }

                    updateWrapper(imdb, rt);

                } catch (e) {
                    console.error("❌ Error parsing data", e);
                }
            }
        });
    }

    function logAndFetchTitle() {
        for (let sel of selectors) {
            const el = document.querySelector(sel);
            if (el) {
                const title = el.textContent.trim();
                console.log("🎬 Netflix Title:", title);
                fetchRatings(title);
                return;
            }
        }
    }

    const observer = new MutationObserver(() => {
        logAndFetchTitle();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // First attempt
    logAndFetchTitle();
})();
