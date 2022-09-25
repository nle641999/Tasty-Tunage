// Autocomplete Starts

$( function() {
  $.widget( "custom.catcomplete", $.ui.autocomplete, {
    _create: function() {
      this._super();
      this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
    },
    _renderMenu: function( ul, items ) {
      var that = this,
        currentCategory = "";
      $.each( items, function( index, item ) {
        var li;
        if ( item.category != currentCategory ) {
          ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
          currentCategory = item.category;
        }
        li = that._renderItemData( ul, item );
        if ( item.category ) {
          li.attr( "aria-label", item.category + " : " + item.label );
        }
      });
    }
  });
  var data = [
    { label: "anders", category: "" },
    { label: "andreas", category: "" },
    { label: "antal", category: "" },
    { label: "annhhx10", category: "Products" },
    { label: "annk K12", category: "Products" },
    { label: "annttop C13", category: "Products" },
    { label: "anders andersson", category: "People" },
    { label: "andreas andersson", category: "People" },
    { label: "andreas johnson", category: "People" }
  ];

  $( "#search" ).catcomplete({
    delay: 0,
    source: data
  });
} );

// Autocomplete Ends

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

  $.ajax(settings).done(function (response) {
    
    console.log(response);

  }).then(function(response) {
      
      for (var i = 0; i < response.tracks.length; i++) {
        var songInfo = {
        name: response.tracks[i].data.name,
        artist: response.tracks[i].data.artists.items[0].profile.name,
        album: response.tracks[i].data.albumOfTrack.name,
        duration: response.tracks[i].data.duration.totalMilliseconds,
        }
        //console.log(trackName);
        var songName = songInfo.name;
        var songArtist = songInfo.artist;
        var songAlbum = songInfo.album;
        var songDuration = songInfo.duration;
  
        var tempDuration = moment.duration(songDuration);
        songDuration = tempDuration.minutes() + ':' + tempDuration.seconds();

        console.log(songName);
        console.log(songArtist);
        console.log(songAlbum);
        console.log(songDuration);
      }
    })
}

button.on('click', function(event) {
  event.preventDefault();

  var song = $("#search").val();
  songSearch(song);
})

