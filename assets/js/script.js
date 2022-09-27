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

  }).then(function(spotify) {
      
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
    })
}

button.on('click', function(event) {
  event.preventDefault();

  var song = $("#search").val();
  songSearch(song);
})

