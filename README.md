# Netflix IMDb + RT Ratings (Stable)

This is a Tampermonkey userscript that displays **IMDb ⭐** and **Rotten Tomatoes 🍅** ratings directly on Netflix movie and series pages.

## Features
- Fetches ratings from the [OMDb API](https://omdbapi.com).
- No flicker when loading.
- Works on both preview modals and full pages.

## How it works
- The script detects the movie or show title currently being displayed on Netflix.  
- It then calls the **OMDb API** to retrieve ratings.  
- From the response, it extracts the **IMDb ⭐ rating** and the **Rotten Tomatoes 🍅 score** (if available).  
- These ratings are displayed in a small styled badge below the Netflix title controls.  
- A `MutationObserver` is used so the script updates automatically when you open a new title or a preview.

This way, the ratings always stay in sync with the content you’re watching.

## Installation
1. Install [Tampermonkey](https://www.tampermonkey.net/).
2. [Click here to install the script](https://github.com/YOUR_USERNAME/netflix-imdb-rt-ratings/raw/main/netflix-imdb-rt-ratings.user.js).
3. Open Netflix and enjoy ratings inline!

## Screenshot
![Preview](Screenshot_2.jpg)

## Notes
- Requires a free OMDb API key: [Get one here](https://www.omdbapi.com/apikey.aspx).
- Replace `API_KEY` in the script with your own.
- IMDb ratings will appear as **⭐ IMDb: X.X**
- Rotten Tomatoes ratings will appear as **🍅 RT: XX%**
