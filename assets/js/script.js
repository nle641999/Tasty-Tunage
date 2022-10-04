var button = $(".btn");
//Search History Array
var previousSearches = [];

function songSearch(song) {

  //var url = "https://spotify81.p.rapidapi.com/search?q="

  //Replaces whitespaces with %20 for the query URL
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
      "X-RapidAPI-Key": "475dce269emsh2b6f39f956bde3ep1839f9jsnc87251b50322",
      "X-RapidAPI-Host": "spotify23.p.rapidapi.com"
    }
  };

  console.log(searchUrl);

  $.ajax(settings).done(function (spotify) {

    console.log(spotify);

  }).then(function (spotify) {

    $("#results").empty();
        //all relevant data from the spotify API
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

          genius(song, content);
          $("#results").append(content);

    getSongLyrics(songID);
  })
}

//Pulling the lyrics from the spotify data and appends them to the content variable in songSearch
function getSongLyrics(songId) {
  const settings = {
    "async": true,
    "crossDomain": true,
    "url": `https://spotify23.p.rapidapi.com/track_lyrics/?id=${songId}`,
    "method": "GET",
    "headers": {
      "X-RapidAPI-Key": "475dce269emsh2b6f39f956bde3ep1839f9jsnc87251b50322",
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

//Samples functions
function genius(song, content) {
  const settings = {
    "async": true,
    "crossDomain": true,
    "url": `https://genius-song-lyrics1.p.rapidapi.com/search?q=${song}`,
    "method": "GET",
    "headers": {
      "X-RapidAPI-Key": "6ba9b5ad58mshd483b168ebe03d8p197d0fjsncb9c30ca309d",
      "X-RapidAPI-Host": "genius-song-lyrics1.p.rapidapi.com"
    }
  };
  $.ajax(settings).done(function (response) {
    console.log(response);
  }).then(function (response) {
    var geniusId = response.response.hits[0].result.id;
    console.log(geniusId);
    getSamples(geniusId, content);
  });
}

function getSamples(id, content) {
  const settings = {
    "async": true,
    "crossDomain": true,
    "url": `https://genius-song-lyrics1.p.rapidapi.com/songs/${id}`,
    "method": "GET",
    "headers": {
      "X-RapidAPI-Key": "6ba9b5ad58mshd483b168ebe03d8p197d0fjsncb9c30ca309d",
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

    if (samples.songs.length != 0) {
      var sampleHeader = $(`<h3>Samples</h3>`)
      content.append(sampleHeader)
      for (var i = 0; i < samples.songs.length; i++) {
        var samplesUrl = samples.songs[i].url;
        var sampleName = $(`
          <a href=${samplesUrl} target="_blank"
            <p>Title: ${samples.songs[i].full_title}</p>
          </a>`)
        
        content.append(sampleName);
        //Stops the loop at 3 maximum samples
        if(i === 2) {
          break;
        }
      }
    } 
    
    if (sampledIn.songs.length != 0) {
      var sampledInHeader = $(`<h3>Sampled In</h3>`)
      content.append(sampledInHeader);

      for (var i = 0; i < sampledIn.songs.length; i++) {
        var sampledUrl = sampledIn.songs[i].url;
        var sampledInName = $(`
          <a href=${sampledUrl} target="_blank"
            <p>Title: ${sampledIn.songs[i].full_title}</p>
          </a>`);

        content.append(sampledInName);
        //Stops the loop at 3 maximum sampledIn's
        if(i === 2) {
          break;
        }
      }
    }
  });
}

//on submit, application searches and presents info based on that search
button.on('click', function (event) {
  event.preventDefault();

  var song = $("#search").val().trim();
  songSearch(song);

  //populates the previousSearches array with user searches
  if(!previousSearches.includes(song)) {
    previousSearches.push(song);
    var search = $(`<button id="songItem">${song}</button>`);

    $(".historyBtn").append(search);
  }

  //stores searches as array of strings 
  localStorage.setItem("song", JSON.stringify(previousSearches));
  //console.log(previousSearches);

})

//When a user clicks a previous search item, they are presented with the data
//related to that item
$(".historyBtn").on("click", "#songItem", function() {
  var previousSong = $(this).text();
  //localStorage.clear();
  /* previousSearches.push(previousSong)
  localStorage.setItem("song", JSON.stringify(previousSearches)); */
  songSearch(previousSong);
})

//retrieves the last search from the user and displays on refresh/reload
$(document).ready(function() {
  var storageHistory = JSON.parse(localStorage.getItem("song"));

  if(storageHistory != null){
    var lastSong = storageHistory.length-1;
    var history = storageHistory[lastSong];
  }

  songSearch(history);
})