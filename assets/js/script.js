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

    for (var i = 0; i < spotify.tracks.length; i++) {
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

    }
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
    "url": `https://genius-song-lyrics1.p.rapidapi.com/search?q=${song}&per_page=10&page=1`,
    "method": "GET",
    "headers": {
      "X-RapidAPI-Key": "771d35b36bmsh62f70d22890e5d0p16709bjsn749829a1231f",
      "X-RapidAPI-Host": "genius-song-lyrics1.p.rapidapi.com"
    }
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
    var songId = response.response.hits[0].result.id
    console.log(songId)
    getSongLyrics(songId)
  });
}

function getSongLyrics(songId) {
  const settings = {
    "async": true,
    "crossDomain": true,
    "url": `https://genius-song-lyrics1.p.rapidapi.com/songs/${songId}/lyrics`,
    "method": "GET",
    "headers": {
      "X-RapidAPI-Key": "771d35b36bmsh62f70d22890e5d0p16709bjsn749829a1231f",
      "X-RapidAPI-Host": "genius-song-lyrics1.p.rapidapi.com"
    }
  };

  $.ajax(settings).done(function (response) {
    console.log('inside getSongLyrics')
    console.log(response);
  });
}



