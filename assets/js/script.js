var button = $(".btn");

function songSearch(song) {

  var url = "https://spotify81.p.rapidapi.com/search?q="

  for (var i = 0; i < song.length; i++) {
    if (song[i] === ' ') {
      song = song.replace(' ', "%20");
    }
  }

  var searchUrl = song + "&type=tracks";

  const settings = {
    "async": true,
    "crossDomain": true,
    "url": `https://spotify23.p.rapidapi.com/search/?q=${searchUrl}`,
    "method": "GET",
    "headers": {
      "X-RapidAPI-Key": "6ba9b5ad58mshd483b168ebe03d8p197d0fjsncb9c30ca309d",
      "X-RapidAPI-Host": "spotify23.p.rapidapi.com"
    }
  };

  console.log(searchUrl);

  $.ajax(settings).done(function (spotify) {

    console.log(spotify);

  }).then(function (spotify) {

    $("#results").empty();

        var songName = spotify.tracks.items[0].data.name;
        var artist = spotify.tracks.items[0].data.artists.items[0].profile.name;
        var album = spotify.tracks.items[0].data.albumOfTrack.name;
        var songDuration = spotify.tracks.items[0].data.duration.totalMilliseconds;
        var icon = spotify.tracks.items[0].data.albumOfTrack.coverArt.sources[2].url;
        var songID = spotify.tracks.items[0].data.id;
        var shareURL = spotify.tracks.items[0].data.albumOfTrack.sharingInfo.shareUrl;
        console.log(shareURL);

        var tempDuration = moment.duration(songDuration);
        var inSeconds = tempDuration.seconds();
          if (inSeconds < 10) {
            songDuration = tempDuration.minutes() + ':0' + tempDuration.seconds();
          } else {
            songDuration = tempDuration.minutes() + ':' + tempDuration.seconds();
          }

        var coverArt = $(`
        <a href=${shareURL} target="_blank"
          <div class="column" id="left">
            <img src=${icon}>
          </div>
        </a>`)

        $("#results").append(coverArt);

        var content = $(`
          <div class="column" id="middle">
          <h3>Content</h3>
            <p>Artist: ${artist}</p>
            <p>Song Title: ${songName}</p>
            <p>Album: ${album}
            <p>Duration: ${songDuration}
          </div>`);
        
          $("#results").append(content);

    genius(song);
    getSongLyrics(songID);
  })
}

button.on('click', function (event) {
  event.preventDefault();

  var song = $("#search").val();
  songSearch(song);

})

function getSongLyrics(songId) {
  const settings = {
    "async": true,
    "crossDomain": true,
    "url": `https://spotify23.p.rapidapi.com/track_lyrics/?id=${songId}`,
    "method": "GET",
    "headers": {
      "X-RapidAPI-Key": "6ba9b5ad58mshd483b168ebe03d8p197d0fjsncb9c30ca309d",
      "X-RapidAPI-Host": "spotify23.p.rapidapi.com"
    }
  };

  $.ajax(settings).done(function (response) {
    console.log('inside getSongLyrics')
    console.log(response);
  }).then(function (response) {
    var lyrics = response.lyrics.lines;
    console.log(lyrics)

    var lyricsHeader = $('<div class="column" id="right"><h3>Lyrics</h3></div>');

    for (var i = 0; i < lyrics.length; i++) {
      var currentLine = $('<p>' + lyrics[i].words + '</p>');

      lyricsHeader.append(currentLine);
    }

    $("#results").append(lyricsHeader);
  }

  );
}

function genius(song) {
  const settings = {
    "async": true,
    "crossDomain": true,
    "url": `https://genius-song-lyrics1.p.rapidapi.com/search?q=${song}`,
    "method": "GET",
    "headers": {
      "X-RapidAPI-Key": "475dce269emsh2b6f39f956bde3ep1839f9jsnc87251b50322",
      "X-RapidAPI-Host": "genius-song-lyrics1.p.rapidapi.com"
    }
  };
  $.ajax(settings).done(function (response) {
    console.log(response);
  }).then(function (response) {
    var geniusId = response.response.hits[0].result.id;
    console.log(geniusId);
    getSamples(geniusId);
  });
}

function getSamples(id) {
  const settings = {
    "async": true,
    "crossDomain": true,
    "url": `https://genius-song-lyrics1.p.rapidapi.com/songs/${id}`,
    "method": "GET",
    "headers": {
      "X-RapidAPI-Key": "475dce269emsh2b6f39f956bde3ep1839f9jsnc87251b50322",
      "X-RapidAPI-Host": "genius-song-lyrics1.p.rapidapi.com"
    }
  };
  $.ajax(settings).done(function (response) {
    console.log(response);
  }).then(function (response) {
    var samples = response.response.song.song_relationships[0];
    var sampledIn = response.response.song.song_relationships[1];

    console.log("Inside song_relationships")
    console.log(samples);
    console.log(sampledIn);
  });
}