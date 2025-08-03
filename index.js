var player;
var fullscreen_svg = {html: ''};

function onLoad() {
  let mainSettingsOverlay = document.getElementById("mainSettingOverlay");
  mainSettingsOverlay.addEventListener("click", (event) => {
    if(event.target.closest("#mainSettingDialog")) return;
    event.target.style.display = "none";
  });

  document.documentElement.addEventListener("click", (event) => {
    const doNotHideSearchClasses = ["prev-search", "searchBar", "old-search"];
    if(!doNotHideSearchClasses.includes(event.target.className)) {
      hideSearchHistory();
    }
  });

  getHtml(null, fullscreen_svg, "fullscreen_svg");
  waitForHTML("fullscreen_svg", () => {
    var fullscreenBtn = document.createElement("div");
    fullscreenBtn.innerHTML = fullscreen_svg.html;
    fullscreenBtn.className = "fullscreenBtn"
    document.body.appendChild(fullscreenBtn);
    document.getElementById("fs_exit").style = "display: none;"
  });

  document.getElementById("defaultOpen").click();
  showHistory();
  searchOnLoad();
  playlistOnLoad();
  historyOnLoad();
}

function toggleFullscreen() {
  if(document.fullscreenElement) {
    document.exitFullscreen();
    document.getElementById("fs_exit").style = "display: none;"
    document.getElementById("fs_enter").style = "display: block;"
  } else {
    document.documentElement.requestFullscreen();
    document.getElementById("fs_exit").style = "display: block;"
    document.getElementById("fs_enter").style = "display: none;"
  }
}

function openPage(evt, pageName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  if(pageName == "historyPage") {
    showHistory();
  }

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(pageName).style.display = "block";
  evt.currentTarget.className += " active";
}

function onYouTubeIframeAPIReady() {
  console.log("Successfully Loaded IframeAPI");
}

function embedVideo(id) {
  var parent = document.getElementById('video')
  var video_player = document.getElementById("video-player");
  let url = 'https://www.youtube.com/embed/' + id + '?widget_referrer=tall.global&autoplay=1&enablejsapi=1&modestbranding=1&controls=1';
  video_player.src = url;
  player = new YT.Player('video-player', {
      events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
      }
  });
  video_player.name = id;
  parent.style.display = 'inline-block';
  var searchRes = document.getElementById('searchResults');
  var historyRes = document.getElementById('historyResults')
  searchRes.style.height = '46vh';
  historyResults.style.height = '55vh';
}

function hideVideo() {
  var parent = document.getElementById('video')
  var player = document.getElementById('video-player');
  player.src = '';
  parent.style.display = 'none';
  var searchRes = document.getElementById('searchResults');
  var historyRes = document.getElementById('historyResults')
  searchRes.style.height = '74vh';
  historyRes.style.height = '83vh';
}


function skipBackward() {
  if (player) {
    player.seekTo(player.getCurrentTime() - 5, true);
  }
}

function skipForward() {
  if (player) {
    player.seekTo(player.getCurrentTime() + 5, true);
  }
}

function onPlayerReady(event) {
  event.target.playVideo();
  console.log("Player is ready!");
}

function onPlayerStateChange(event) {
  var video_player = document.getElementById('video-player');
  console.log(event.data);
  if (event.data == 0 /*Video End*/) {
    console.log(video_player.name + "_PL");
    var currentVideoDiv = document.getElementById(video_player.name + "_PL");
    console.log(currentVideoDiv);
    if(currentVideoDiv != null)
      playNextVideo(currentVideoDiv);
  }
}

function toggleMainSettings() {
  var overlay = document.getElementById("mainSettingOverlay");

  if(overlay.style.display == "none" || overlay.style.display == "") {
    overlay.style.display = "flex";
  } else {
    overlay.style.display = "none";
  }
}
