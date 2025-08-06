function historyOnLoad() {
  if(doHistory)
    console.log("History Module Successfully Loaded");
  else
    console.log("History Module Disabled");
}

function showHistory() {
  if(!doHistory) return;
  var searchQuery = document.getElementById('searchQuery');
  searchQuery.value = '';
  google.script.run.withSuccessHandler(displayHistory).getHistory();
}

function clearHistory() {
  if(!doHistory) return;
  var div = document.getElementById('clearBtn');
  google.script.run.withSuccessHandler(displayHistory).clearHistory();
}

function displayHistory(results) {
  if(!doHistory) return;
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
  if(!doHistory) return;
  google.script.run.saveHistory(result);
}

function saveSearchHistory(query) {
  if(!doHistory) return;
  google.script.run.saveSearchHistory(query);
}

function showSearchHistory(div) {
  if(!doHistory) return;
  google.script.run.withSuccessHandler(displaySearchHistory).withUserObject(div).getSearchHistory()
}

function hideSearchHistory() {
  if(!doHistory) return;
  let div = document.getElementById("prev-search")
  if(div.style.display != "none") {
    div.style.display = "none";
    
    while(div.firstChild)
      div.firstChild.remove();
  }
}

function displaySearchHistory(history, parent) {
  if(!doHistory) return;
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
  if(!doHistory) return;
  let div = document.getElementById("prev-search")
  hideSearchHistory();

  searchWithTINY(query);
}
