Parse.initialize("1VgS4TGB6IxTL7uQp5YTxWFJRrPgwpwj7C9NCaAD", "mvoTnPKjzISniRKzYx4foLHpUmoeLVDXZeWlmSwc")

var SPOTIFY_URL = 'https://api.spotify.com/'

function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1)
  while ( e = r.exec(q)) {
     hashParams[e[1]] = decodeURIComponent(e[2])
  }
  return hashParams
}

function getUserTracks(access_token, next){
  var url = SPOTIFY_URL
      url += 'v1/me/tracks'

  $.ajax({
    url: url,
    headers: {
      Authorization : 'Bearer ' + access_token
    }
  })
  .done(function (res){
    var data = res
    data.items.forEach(function(item){
      if(item.track.artists.length > 1){
        item.safeArtistsName = item.track.artists.reduce(function(prev, cur, i, arr){
          if (i == arr.length - 1)
            return prev.name + ' and ' + cur.name
          else
            return prev.name + ', ' + prev.cur;
        })
      }
      else {
        item.safeArtistsName = item.track.artists[0].name;
      }
      console.dir(res);
      console.log(item.safeArtistsName)
    })
    next(data)
  })
  .fail(function (err){
    console.log(err)
  })
}

function authenticateUser(client_id){
    var scope = 'user-read-private user-read-email user-library-read'
    var redirect_uri = 'http://10.10.10.139:9000/'

    var url = 'https://accounts.spotify.com/authorize'
        url += '?response_type=token'
        url += '&client_id=' + encodeURIComponent(client_id)
        url += '&scope=' + encodeURIComponent(scope)
        url += '&redirect_uri=' + encodeURIComponent(redirect_uri)

    console.log(url)
    window.location = url
}

function templateData(tracks) {
  var source   = $("#tracklist").html()
  var template = Handlebars.compile(source)
  console.log('get here!!')

  $('#trackFeed').append(template(tracks))
  $('#trackFeed li:first-child').addClass('active')

}

$(document).ready(function(){
  Parse.Config.get().then(
    function(config){
      console.dir(config)
      var SPOTIFY_CLIENT_ID = config.get("SPOTIFY_CLIENT_ID")
      $('#login').on('click', function(e){
        e.preventDefault()
        authenticateUser(SPOTIFY_CLIENT_ID)
      })
      console.log('yas')
    },
    function(err){
      console.log('an error occurred')
    })

  var params = getHashParams()

  if (params)
    console.dir(params)

  if(params.access_token){
    getUserTracks(params.access_token, templateData)
  }

  for (var i = 1; i <= $('.list').length; i++) {
    (function(it){
      var idName = '#list-' + it
      var reactIdName = '#react-' + it
      console.log(idName)
      $(idName).click(function(){
        var li    = $('li:first-child'),
          liNext  = $('li:nth-child(2)')

        li.addClass('pop-off')

        $(reactIdName).addClass('pop-off')

        setTimeout(function(){
          $(reactIdName).removeClass('pop-off')
        }, 800)

        setTimeout(function(){
          liNext.addClass('active')
        }, 300)

        setTimeout(function(){
          li.remove()
        }, 800)
      })
    }(i))
  };

})