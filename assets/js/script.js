var button = $(".btn");

function songSearch(song) {

  var url = "https://spotify81.p.rapidapi.com/search?q="

  for (var i = 0; i < song.length; i++) {
    if (song[i] === ' ') {
      song = song.replace(' ', "%20");
    }
  }

  var searchUrl = url + song + "&type=tracks";

  const settings = {
    "async": true,
    "crossDomain": true,
    "url": searchUrl,
    "method": "GET",
    "headers": {
      "X-RapidAPI-Key": "6ba9b5ad58mshd483b168ebe03d8p197d0fjsncb9c30ca309d",
      "X-RapidAPI-Host": "spotify81.p.rapidapi.com"
    }
  };

  console.log(searchUrl);

  $.ajax(settings).done(function (spotify) {

    console.log(spotify);

  }).then(function (spotify) {

    $("#results").empty();

        var songName = spotify.tracks[0].data.name
        var artist = spotify.tracks[0].data.artists.items[0].profile.name
        var album = spotify.tracks[0].data.albumOfTrack.name
        var songDuration = spotify.tracks[0].data.duration.totalMilliseconds
        var icon = spotify.tracks[0].data.albumOfTrack.coverArt.sources[2].url

        var tempDuration = moment.duration(songDuration);
        var inSeconds = tempDuration.seconds();
          if (inSeconds < 10) {
            songDuration = tempDuration.minutes() + ':0' + tempDuration.seconds();
          } else {
            songDuration = tempDuration.minutes() + ':' + tempDuration.seconds();
          }

        var coverArt = $(`
          <div class="column" id="left">
            <img src=${icon}>
          </div>`)

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

    /* for (var i = 0; i < spotify.tracks.length; i++) {
      var songInfo = {
        name: spotify.tracks[i].data.name,
        artist: spotify.tracks[i].data.artists.items[0].profile.name,
        album: spotify.tracks[i].data.albumOfTrack.name,
        duration: spotify.tracks[i].data.duration.totalMilliseconds,
      }
      //console.log(trackName);
      var songName = songInfo.name;
      var songArtist = songInfo.artist;
      var songAlbum = songInfo.album;
      var songDuration = songInfo.duration;

      var tempDuration = moment.duration(songDuration);
      var inSeconds = tempDuration.seconds();
      if (inSeconds < 10) {
        songDuration = tempDuration.minutes() + ':0' + tempDuration.seconds();
      } else {
        songDuration = tempDuration.minutes() + ':' + tempDuration.seconds();
      }

      console.log('Song name: ' + songName + ' , Artist: ' + songArtist
        + ' , Album: ' + songAlbum + ', Duration: ', songDuration);
      /* console.log(songArtist);
      console.log(songAlbum);
      console.log(songDuration); */

  //}
    genius(song);
    getSongId(spotify.tracks[0].data.name)
  })
}

button.on('click', function (event) {
  event.preventDefault();

  var song = $("#search").val();
  songSearch(song);

})

function getSongId(song, artist) {
  song = song.trim()
  console.log(song)

  const settings = {
    "async": true,
    "crossDomain": true,
    "url": `https://spotify23.p.rapidapi.com/search/?q=${song}&type=tracks`,
    "method": "GET",
    "headers": {
      "X-RapidAPI-Key": "6ba9b5ad58mshd483b168ebe03d8p197d0fjsncb9c30ca309d",
      "X-RapidAPI-Host": "spotify23.p.rapidapi.com"
    }
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
    var songId = response.tracks.items[0].data.id
    console.log(songId)
    getSongLyrics(songId)
  });
}

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

    var lyricsHeader = $('<div class="column" id="right"></div>');

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

