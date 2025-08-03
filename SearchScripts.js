var resultsDiv;

function searchOnLoad() {
  let searchSettingsOverlay = document.getElementById("searchSettingOverlay");
searchSettingsOverlay.addEventListener("click", (event) => {
  if(event.target.closest("#search-dialog")) return;
  event.target.style.display = "none";
});
let searchURLOverlay = document.getElementById("urlOverlay");
searchURLOverlay.addEventListener("click", (event) => {
  if(event.target.closest("#getURL")) return;
  event.target.style.display = "none";
});
  console.log("Successfully Loaded Search");

let searchBar = document.getElementById("searchQuery");
searchBar.addEventListener("focus", (event) => {
  let div = document.getElementById("prev-search")
  showSearchHistory(div);
});
}

function toggleSearchSettings() {
  var overlay = document.getElementById("searchSettingOverlay");

  if(overlay.style.display == "none" || overlay.style.display == "") {
    overlay.style.display = "flex";
  } else {
    overlay.style.display = "none";
  }
}

function doSearch() {
  var query = document.getElementById('searchQuery').value;
  hideSearchHistory();
  saveSearchHistory(query);
  console.log(query);
  searchWithTINY(query);
}

function searchWithTINY(query) {
  if(query == "test.tiny") {
    google.script.run.withSuccessHandler(displayResults).testSearch();
    return;
  }

  var v = document.getElementById('video-check').checked;
  var p = document.getElementById('playlist-check').checked;
  var c = document.getElementById('channel-check').checked;
  var safeSearchVal = document.getElementById('safeSearchSettings').value;
  var sortByVal = document.getElementById('sortBy').value;
  let settings = {
    searchType: "",
    safeSearch: safeSearchVal,
    sortBy: sortByVal
  };

  if (v) settings.searchType += ("video,");
  if (p) settings.searchType += ("playlist,")
  if (c) settings.searchType += ("channel,");

  console.log(query);

  google.script.run.withSuccessHandler(displayResults).searchYouTube(query, settings);
}

function displayResults(results) {
  resultsDiv = document.getElementById('searchResults');
  resultsDiv.innerHTML = '';
  resultsDiv.scrollTop = 0;
  
  createCardsfromResults(results, resultsDiv);
}



function getURLtoEmbed() {
  document.getElementById("urlOverlay").style.display = "flex";
}

function sendURLtoEmbed() {
  let urlQuery = document.getElementById('urlQuery');
  let url = urlQuery.value.trim();
  
  // Start ChatGPT
  // Verify URL is a valid YouTube URL
  let youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
  let match = url.match(youtubeRegex);
  
  if (!match) {
    alert("Please enter a valid YouTube URL.");
    urlQuery.value = "";
    return;
  }
  
  // Extract the YouTube video ID
  let id = match[1];
  // End ChatGPT
  
  embedVideo(id);
  
  urlQuery.value = "";
  document.getElementById("urlOverlay").style.display = "none";
}
