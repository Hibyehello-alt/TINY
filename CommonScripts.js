function createCardsfromResults(results, parentDiv, insertReverse = false, isPlaylistItem = false) {
  results.forEach(function(result) {
    var uploadDate = new Date(result.publishedAt).toLocaleDateString(); // Format date

    var div = document.createElement('div');
    div.className = 'search-item';
    
    if(result.kind == "youtube#video") {
        div.onclick = function() { saveHistory(result); embedVideo(result.videoId); };
        div.id = result.videoId;
    }
    if(result.kind == "youtube#playlist") {
      div.onclick = function() { saveHistory(result); loadPlaylist(result.playlistId, result.title, parentDiv); };
      div.id = result.playlistId;
    }
    if(isPlaylistItem) {
      div.id += "_PL";
    }
    div.innerHTML = '<img src="'+ result.thumbnailUrl +'" alt="Thumbnail">' +
                    '<div class="item-info">' +
                      '<p><strong>' + result.title + '</strong></p>' +
                      '<p>Uploaded: ' + uploadDate + '</p>' +
                      '<p>By: ' +  result.channelTitle + '</p>' +
                    '</div>';
    if(insertReverse) {
      parentDiv.insertBefore(div, parentDiv.children[0])
    } else {
      parentDiv.appendChild(div);
    }
  });
}

function getHtml(html = null, obj, filename = null) {
  if (html != null) {
    obj.html = html;
  }
  if (html == null && filename != null) {
    google.script.run.withSuccessHandler(function(responseHtml) {
      getHtml(responseHtml, obj, null);
    }).include(filename);
  }
}

function waitForHTML(variable_name, callback) {
  if(window[variable_name].html != "") {
    callback()
  } else {
    setTimeout(() => {waitForHTML(variable_name, callback)}, 100);
  }
}
