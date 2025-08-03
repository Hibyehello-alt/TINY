function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('TINY Search')
    .addItem('Open TINY', 'showSearchDialog')
    .addToUi();
}

function include(filename) {
  var html = HtmlService.createHtmlOutputFromFile(filename).getContent();
  return html;
}

function showSearchDialog() {
  var template = HtmlService.createTemplateFromFile('Main');

  var html = template.evaluate()
      .setWidth(390)
      .setHeight(802.66);


  SpreadsheetApp.getUi().showModalDialog(html, "TINY");
}

function searchYouTube(query, settings) {  
  let max_results = 50;
  var ytService = YouTube.Search.list('snippet', {
      q: query, 
      maxResults: max_results,  
      type: settings.searchType,
      safeSearch: settings.safeSearch,
      order: settings.sortBy
  }); //Quota Usage: 100

  console.log(settings.sortBy);
  
  return ytService.items.map(function(item) {
    return {
      title: item.snippet.title,
      kind: item.id.kind,
      videoId: item.id.videoId,
      playlistId: item.id.playlistId,
      playlistTitle: null,
      thumbnailUrl: item.snippet.thumbnails.default.url,
      publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle,
      isPlaylistVideo: true
    };
  });

}

function getPlaylist(id, playlistTitle) {
  console.log(id);
  var response = YouTube.PlaylistItems.list("snippet", {
    playlistId: id,
    maxResults: 50
  }); //Quota Usage: 1

  return response.items.map(function(item) {
    return {
      title: item.snippet.title,
      kind: item.snippet.resourceId.kind,
      videoId: item.snippet.resourceId.videoId,
      playlistId: item.snippet.playlistId,
      playlistTitle: playlistTitle,
      thumbnailUrl: item.snippet.thumbnails.default.url,
      publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle,
      isPlaylistVideo: true
    };
  });
}

function getParentPlaylist(id) {
  var response = YouTube.Playlists.list("snippet", {
    id: id
  }); //Quota Usage: 1

  return response.items.map(function(item) {
    return {
      title: item.snippet.title,
      kind: item.kind,
      videoId: null, // We're not dealing with videos
      playlistId: item.id,
      playlistTitle: null,
      thumbnailUrl: item.snippet.thumbnails.default.url,
      publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle,
      isPlaylistVideo: true
    };
  });
}

function getUser() {
  return Session.getActiveUser().getEmail();
}

function saveHistory(result) {
    var userProperties = PropertiesService.getUserProperties();
    var history = userProperties.getProperty('history');
    if(!history) {
      userProperties.setProperty('history', '[]');
    } else {
      var temp;
      try {
        temp = JSON.parse(history);
      } catch (e) {
        console.log("Parse Error, so flushing history, likely history from old implementation");
        temp = [];
      }

      temp.push(result);

      userProperties.setProperty('history', JSON.stringify(temp));
    }
}

function getHistory() {
  var userProperties = PropertiesService.getUserProperties();
  try {
  return JSON.parse(userProperties.getProperty('history'));
  } catch (e) {
    console.log("Parse Error, so flushing history, likely history from old implementation");
    return clearHistory();
  }
}

function clearHistory() {
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('history', "[]");
  return [];
}

function saveSearchHistory(query) {
  var userProperties = PropertiesService.getUserProperties();
  var history = userProperties.getProperty('search_history');

  if(!history) {
      userProperties.setProperty('search_history', '["' + query + '"]');
  } else {
    var temp = JSON.parse(history);
    
    if(temp.length == 5) {
      temp.shift();
      temp.push(query);
    } else {
      temp.push(query);
    }

    userProperties.setProperty('search_history', JSON.stringify(temp));
  }
}

function getSearchHistory() {
  var userProperties = PropertiesService.getUserProperties();
  return JSON.parse(userProperties.getProperty('search_history'));
}

function clearSearchHistory() {
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('search_history', "[]");
}

function doGet(e) {
  return HtmlService.createTemplateFromFile("Main")
  .evaluate()
  .setTitle("My Web App")
  .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL); 
}

function testSearch() {
  return [ { title: 'lofi hip hop radio 📚 beats to relax/study to',
    kind: 'youtube#video',
    videoId: 'jfKfPfyJRdk',
    playlistId: undefined,
    thumbnailUrl: 'https://i.ytimg.com/vi/jfKfPfyJRdk/default_live.jpg',
    publishedAt: '2022-07-12T12:12:29Z',
    channelTitle: 'Lofi Girl' },
  { title: '90&#39;s Lofi City 🔥Retro Tokyo Lofi 🌃 Lo fi Beats To Sleep, Relax  [lofi hiphop mix]',
    kind: 'youtube#video',
    videoId: 'HQwLPhE2zys',
    playlistId: undefined,
    thumbnailUrl: 'https://i.ytimg.com/vi/HQwLPhE2zys/default.jpg',
    publishedAt: '2024-09-03T14:17:34Z',
    channelTitle: 'Chillhop Street Beats' },
  { title: '90&#39;s Chill Lofi ☕️ Study Music Lofi Rain Chillhop Beats ☔️ Lofi Rain Playlist',
    kind: 'youtube#video',
    videoId: 'sF80I-TQiW0',
    playlistId: undefined,
    thumbnailUrl: 'https://i.ytimg.com/vi/sF80I-TQiW0/default.jpg',
    publishedAt: '2024-06-04T05:02:38Z',
    channelTitle: 'The Japanese Town' },
  { title: 'Make you feel positive and peaceful 🍀 Lofi Coffee ☕ ~ Lofi Hip Hop - Lofi Music [ Study/ Relax ]',
    kind: 'youtube#video',
    videoId: 'OO2kPK5-qno',
    playlistId: undefined,
    thumbnailUrl: 'https://i.ytimg.com/vi/OO2kPK5-qno/default.jpg',
    publishedAt: '2024-05-18T12:00:23Z',
    channelTitle: 'Lofi Coffee' },
  { title: 'Retro Lofi Hip Hop Beats 🌔 Nostalgic Vibes &amp; 1980s &amp; 90s Japanese Town Ambience 🌆 Lofi Rain Playlist',
    kind: 'youtube#video',
    videoId: '4kDc6KVLY0A',
    playlistId: undefined,
    thumbnailUrl: 'https://i.ytimg.com/vi/4kDc6KVLY0A/default_live.jpg',
    publishedAt: '2025-03-08T09:49:02Z',
    channelTitle: 'The Japanese Town' },
  { title: 'Best of lofi hip hop 2021 ✨ [beats to relax/study to]',
    kind: 'youtube#video',
    videoId: 'n61ULEU7CO0',
    playlistId: undefined,
    thumbnailUrl: 'https://i.ytimg.com/vi/n61ULEU7CO0/default.jpg',
    publishedAt: '2021-12-31T16:30:13Z',
    channelTitle: 'Lofi Girl' },
  { title: '𝙻𝚘𝚏𝚒 𝚁𝚘𝚘𝚖 / 𝙶𝚞𝚒𝚝𝚊𝚛 𝙻𝚘𝚏𝚒 / 𝙲𝚊𝚏𝚎 𝙼𝚞𝚜𝚒𝚌 / 𝙴𝚊𝚜𝚢 𝚕𝚒𝚜𝚝𝚎𝚗𝚒𝚗𝚐 / 𝙱𝙶𝙼 / 𝙻𝚘𝚏𝚒 𝙼𝚞𝚜𝚒𝚌 / 𝚅𝚎𝚛.𝟾',
    kind: 'youtube#video',
    videoId: 'VUQfT3gNT3g',
    playlistId: undefined,
    thumbnailUrl: 'https://i.ytimg.com/vi/VUQfT3gNT3g/default.jpg',
    publishedAt: '2024-12-21T08:46:44Z',
    channelTitle: 'Myour Music' },
  { title: 'Chill Lofi Beats Mix [chill lo-fi hip hop beats/Study &amp; Relax Music]',
    kind: 'youtube#video',
    videoId: 'BCxTQq0UiFs',
    playlistId: undefined,
    thumbnailUrl: 'https://i.ytimg.com/vi/BCxTQq0UiFs/default.jpg',
    publishedAt: '2024-11-17T20:00:07Z',
    channelTitle: 'Art Is Sound' },
  { title: 'Path of Floating Lanterns 🏮✨ LoFi to Calm the Soul',
    kind: 'youtube#video',
    videoId: 'q2hHX_1GalA',
    playlistId: undefined,
    thumbnailUrl: 'https://i.ytimg.com/vi/q2hHX_1GalA/default_live.jpg',
    publishedAt: '2025-03-08T18:00:06Z',
    channelTitle: 'Bitcoin Nation' },
  { title: 'Coffee Lofi ☕1 Hour Cafe Song 🎵 Stream cafe ✨cute &amp; relaxing music 🍪 Make Your Day Better',
    kind: 'youtube#video',
    videoId: '01dn67QubYQ',
    playlistId: undefined,
    thumbnailUrl: 'https://i.ytimg.com/vi/01dn67QubYQ/default.jpg',
    publishedAt: '2024-08-14T11:15:00Z',
    channelTitle: 'Lofi Kitty' },
  { title: 'Chill Lofi Mix [chill lo-fi hip hop beats]',
    kind: 'youtube#video',
    videoId: 'CLeZyIID9Bo',
    playlistId: undefined,
    thumbnailUrl: 'https://i.ytimg.com/vi/CLeZyIID9Bo/default.jpg',
    publishedAt: '2022-08-12T11:30:07Z',
    channelTitle: 'Settle' },
  { title: 'old songs but it&#39;s lofi remix',
    kind: 'youtube#video',
    videoId: 'BrnDlRmW5hs',
    playlistId: undefined,
    thumbnailUrl: 'https://i.ytimg.com/vi/BrnDlRmW5hs/default.jpg',
    publishedAt: '2020-07-18T20:25:39Z',
    channelTitle: 'Lo-fi Music' },
  { title: '1 A.M Study Session 📚 [lofi hip hop]',
    kind: 'youtube#video',
    videoId: 'lTRiuFIWV54',
    playlistId: undefined,
    thumbnailUrl: 'https://i.ytimg.com/vi/lTRiuFIWV54/default.jpg',
    publishedAt: '2019-12-08T22:02:06Z',
    channelTitle: 'Lofi Girl' },
  { title: 'Japan Coastal Vibes 🌅 Lofi Mix for Focus and Relaxation',
    kind: 'youtube#video',
    videoId: 'PLLRRXURicM',
    playlistId: undefined,
    thumbnailUrl: 'https://i.ytimg.com/vi/PLLRRXURicM/default.jpg',
    publishedAt: '2024-06-24T15:25:53Z',
    channelTitle: 'Calm City' },
  { title: 'Night Smoke Lofi 🚬 Lofi Hip Hop &amp; Chillhop Mix ~ Relaxed Vibes for Smoking',
    kind: 'youtube#video',
    videoId: '_-UlZAdX8Ec',
    playlistId: undefined,
    thumbnailUrl: 'https://i.ytimg.com/vi/_-UlZAdX8Ec/default.jpg',
    publishedAt: '2024-08-22T06:39:41Z',
    channelTitle: 'Mimi Lofi Chill' },
  { title: 'Snow Coffee ☕ Winter Lofi Chill ❄️ Deep Focus for study/work with [ Lofi Hip Hop - Lofi Cafe ]',
    kind: 'youtube#video',
    videoId: 'tONVgIvdk0A',
    playlistId: undefined,
    thumbnailUrl: 'https://i.ytimg.com/vi/tONVgIvdk0A/default.jpg',
    publishedAt: '2024-11-17T01:17:44Z',
    channelTitle: 'Healing Me' },
  { title: 'Nhạc Chill TikTok - Những Bản Nhạc Lofi Chill Nhẹ Nhàng - Nhạc Lofi Buồn Hot Nhất Hiện Nay',
    kind: 'youtube#video',
    videoId: 'QhfSm5BzB6M',
    playlistId: undefined,
    thumbnailUrl: 'https://i.ytimg.com/vi/QhfSm5BzB6M/default.jpg',
    publishedAt: '2025-03-06T11:00:37Z',
    channelTitle: 'Anten.' },
  { title: 'Morning Tea ☕ Dopamine morning with Lofi Cafe 🍂 Lofi Deep Focus to study / relax  [ Lofi Hip Hop ]',
    kind: 'youtube#video',
    videoId: 'ee6SjNN2_uk',
    playlistId: undefined,
    thumbnailUrl: 'https://i.ytimg.com/vi/ee6SjNN2_uk/default.jpg',
    publishedAt: '2024-07-29T01:17:49Z',
    channelTitle: 'Healing Me' },
  { title: 'Upbeat Lofi - Power and Energize Your Workday - [R&amp;B, Neo Soul, Lofi Hiphop]',
    kind: 'youtube#video',
    videoId: 'ONcY0BM5EAg',
    playlistId: undefined,
    thumbnailUrl: 'https://i.ytimg.com/vi/ONcY0BM5EAg/default.jpg',
    publishedAt: '2024-09-05T12:15:32Z',
    channelTitle: 'A Lofi Soul' },
  { title: 'Relax mind, get some coffee ☂️ Lo-fi Rain / Jazzy HipHop / Chillhop',
    kind: 'youtube#video',
    videoId: 'wn0IyvGBeUI',
    playlistId: undefined,
    thumbnailUrl: 'https://i.ytimg.com/vi/wn0IyvGBeUI/default.jpg',
    publishedAt: '2024-10-04T10:51:41Z',
    channelTitle: 'chill chill journal' },
  { title: 'Morning Coffee ☕️ [lofi hip hop]',
    kind: 'youtube#video',
    videoId: '1fueZCTYkpA',
    playlistId: undefined,
    thumbnailUrl: 'https://i.ytimg.com/vi/1fueZCTYkpA/default.jpg',
    publishedAt: '2022-04-11T18:00:15Z',
    channelTitle: 'Lofi Girl' },
  { title: 'Lofi Hip Hop Beats 🎲 Retro 1980s &amp; 90s Vibes &amp; Nostalgic Japanese Town Ambience 🌆 Lofi Rain Playlist',
    kind: 'youtube#video',
    videoId: 'EqkGMMHNWBg',
    playlistId: undefined,
    thumbnailUrl: 'https://i.ytimg.com/vi/EqkGMMHNWBg/default.jpg',
    publishedAt: '2025-03-08T02:38:26Z',
    channelTitle: 'The Japanese Town' },
  { title: 'THE CHILLEST LOFI IN THE UNIVERSE // featuring the best sci fi images',
    kind: 'youtube#video',
    videoId: 'V-b9MirVx2w',
    playlistId: undefined,
    thumbnailUrl: 'https://i.ytimg.com/vi/V-b9MirVx2w/default.jpg',
    publishedAt: '2025-02-03T13:45:03Z',
    channelTitle: 'VVM Lofi' },
  { title: 'lofi hip hop mix 📚 beats to relax/study to (Part 1)',
    kind: 'youtube#video',
    videoId: 'CFGLoQIhmow',
    playlistId: undefined,
    thumbnailUrl: 'https://i.ytimg.com/vi/CFGLoQIhmow/default.jpg',
    publishedAt: '2024-10-17T19:00:07Z',
    channelTitle: 'Lofi Girl' },
  { title: 'Lofi Work Space 📂 Deep Focus Study/Work Concentration [chill lo-fi hip hop beats]',
    kind: 'youtube#video',
    videoId: 'Q89Dzox4jAE',
    playlistId: undefined,
    thumbnailUrl: 'https://i.ytimg.com/vi/Q89Dzox4jAE/default.jpg',
    publishedAt: '2024-05-10T04:26:02Z',
    channelTitle: '𝗖𝗛𝗜𝗟𝗟 𝗩𝗜𝗟𝗟𝗔𝗚𝗘' } ];
}
