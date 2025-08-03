function historyOnLoad() {
  console.log("History Successfully Loaded");
}

function showHistory() {
  var searchQuery = document.getElementById('searchQuery');
  searchQuery.value = '';
  google.script.run.withSuccessHandler(displayHistory).getHistory();
}

function clearHistory() {
  var div = document.getElementById('clearBtn');
  google.script.run.withSuccessHandler(displayHistory).clearHistory();
}

function displayHistory(results) {
  resultsDiv = document.getElementById('historyResults');
  resultsDiv.innerHTML = '';
  /* Not sure if I want to keep this, so just commenting it out now
  resultsDiv.scrollTop = 0; */

  // Don't show the clear button unless we actually have history
  var clearBtn = document.getElementById('clearBtn');
  clearBtn.style.display = (results != "") ? 'block' : 'none';

  createCardsfromResults(results, resultsDiv, true);
}

function saveHistory(result) {
  google.script.run.saveHistory(result);
}

function saveSearchHistory(query) {
  google.script.run.saveSearchHistory(query);
}

function showSearchHistory(div) {
  google.script.run.withSuccessHandler(displaySearchHistory).withUserObject(div).getSearchHistory()
}

function hideSearchHistory() {
  let div = document.getElementById("prev-search")
  if(div.style.display != "none") {
    div.style.display = "none";
    
    while(div.firstChild)
      div.firstChild.remove();
  }
}

function displaySearchHistory(history, parent) {
  while(parent.firstChild)
      parent.firstChild.remove();

  if(!history || history == "[]")
    return;

  for(const t of history) {
    let div = document.createElement("div");
    div.className = "old-search";
    div.onclick = function() {searchFromHistory(t)};
    div.innerHTML = '<p1>' + t + '</p1>';
    parent.appendChild(div);
  }
   parent.style.display = "flex";
}

function searchFromHistory(query) {
  let div = document.getElementById("prev-search")
  hideSearchHistory();

  searchWithTINY(query);
}
