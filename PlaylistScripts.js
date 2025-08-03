function playlistOnLoad() {
  console.log("Playlist successfully loaded");
}

var autoplay_svg = {html: ''};
var shuffle_svg = {html: ''};

function loadPlaylist(id, title, parentDiv) {
  var playlist_info = {i: id, t: title, p: parentDiv}
  getHtml(null, autoplay_svg, "autoplay_svg");
  getHtml(null, shuffle_svg, "shuffle_svg");
  console.log("Loading Playlist: " + title)
  waitForHTML("shuffle_svg", () => {getPlaylist(playlist_info)});
}

function getPlaylist(playlist_info) {
  google.script.run.withSuccessHandler(displayPlaylist).withUserObject(playlist_info.p).getPlaylist(playlist_info.i, playlist_info.t)
}

function displayPlaylist(results, parentDiv) {
  var openPlaylist = document.querySelector('.playlist');
  if(openPlaylist != null) {
    closeOpenPlaylist();
  }

  var div = document.createElement('div');
  div.innerHTML = '<div class="header">' +
                  '<input type="image" class="close-btn" src="https://raw.githubusercontent.com/Hibyehello-alt/Tiny-icon-repo/main/close-btn.svg" onclick="closeOpenPlaylist()">' +
                  '<h1> ' + results[0].playlistTitle + ' </h1>' +
                  autoplay_svg.html + shuffle_svg.html +
                  '</div>';

  div.className = 'playlist';
  div.id = results[0].playlistId;

  var contentDiv = document.createElement('div')
  contentDiv.className = 'content';
  createCardsfromResults(results,contentDiv, false, true);

  div.appendChild(contentDiv);

  parentDiv.replaceChild(div, document.getElementById(results[0].playlistId));
  parentDiv.insertBefore(div, parentDiv.firstChild);
  parentDiv.scrollTop = 0;
  if(document.getElementById("global_autoplay").checked) {
    document.getElementById("autoplay_stop").style.display = "block";
    document.getElementById("autoplay_start").style.display = "none";
  } else {
    document.getElementById("autoplay_stop").style.display = "none";
    document.getElementById("autoplay_start").style.display = "block";
  }
  if(document.getElementById("global_shuffle").checked) {
    document.getElementById("playlist_noShuffle").style.display = "none";
    document.getElementById("playlist_shuffle").style.display = "block";
  } else {
    document.getElementById("playlist_noShuffle").style.display = "block";
    document.getElementById("playlist_shuffle").style.display = "none";
  }
}

function playNextVideo(videoDiv) {
  var currentIdx;
  if(doAutoplay()) {
    if(doShuffle())
      currentIdx = Math.floor(Math.random() * videoDiv.parentNode.children.length)
    else 
      currentIdx = [...videoDiv.parentNode.children].indexOf(videoDiv)+1;

    if(currentIdx < videoDiv.parentNode.children.length) {
      console.log("Next video");
      videoDiv.parentNode.children[currentIdx].click();
    } else {
      console.log("Wrapping around!");
      videoDiv.parentNode.firstChild.click();
    }
  }
}

function toggleAutoPlay() {
  let start = document.getElementById("autoplay_start");
  let stop = document.getElementById("autoplay_stop");
  let arrow = document.getElementById("autoplay_arrow");
  if(arrow.style.animation == '') {
    arrow.style.animation = "spin 0.5s linear";
    setTimeout(() => arrow.style.animation = '', 500)
  }

  if(stop.style.display == "none") {
    start.style.display = "none";
    stop.style.display = "block";
    console.log("Turning on");
  } else if(start.style.display == "none") {
    start.style.display = "block";
    stop.style.display = "none";
    console.log("Turning off");
  } else {
    start.style.display = "block";
    stop.style.display = "none";
  }
}

function doAutoplay() {
  if(document.getElementById("autoplay_stop").style.display == "none")
    return false;

  return true;
}

function toggleShuffle() {
  let shuffle = document.getElementById("playlist_shuffle");
  let noShuffle = document.getElementById("playlist_noShuffle");

  if(noShuffle.style.display == "none") {
    shuffle.style.display = "none";
    noShuffle.style.display = "block";
    console.log("Turning shuffle off");
  } else if(shuffle.style.display == "none") {
    shuffle.style.display = "block";
    noShuffle.style.display = "none";
    console.log("Turning shuffle on");
  } else {
    shuffle.style.display = "block";
    noShuffle.style.display = "none";
  }
}

function doShuffle() {
    if(document.getElementById("playlist_shuffle").style.display == "none")
    return false;

  return true;
}

function closeOpenPlaylist() {
  console.log("Closing Playlist");
  let playlist = document.getElementsByClassName('playlist')[0];
  google.script.run.withSuccessHandler(createCardsfromResults).withUserObject(resultsDiv).getParentPlaylist(playlist.id);

  let div = document.getElementById(playlist.id);
  resultsDiv.removeChild(playlist);
  
}
