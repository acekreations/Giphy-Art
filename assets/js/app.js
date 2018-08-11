jQuery.ajaxPrefilter(function (options) {
  if (options.crossDomain && jQuery.support.cors) {
    options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
  }
});

var defaultTags = ["abstract", "minimal", "geometric", "trippy", "illustration", "3d", "design", "motion graphics", "pattern", "color"];

function renderTags(tagArr) {
  $("#tagContainer").empty();
  for (var i = 0; i < tagArr.length; i++) {
    var newBtn = $('<button type="button" class="btn btn-primary btn-sm mt-2 mr-1 tag text-capitalize">');
    newBtn.attr("data-tag", tagArr[i]);
    newBtn.text(tagArr[i]);
    $("#tagContainer").append(newBtn);
  }
}

function renderTitle(tag) {
  $("#tagTitle").text(tag);
}

function fetchGifs(tag) {
  renderTitle(tag);
  var offset = Math.floor(Math.random() * 1000);
  // var apiKey = "nFQ89Mq5zf85yyf2d2OqQFzI7x9XfRWz";
  var apiKey = "bukNnkHciMEN5ODtDi4RwYv9ks57W5GV";
  var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=" + apiKey + "&q=" + tag + "&limit=10&rating=g&offset=" + offset;
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response){
    $("#gifContainer").empty();
    console.log(response);
    for (var i = 0; i < response.data.length; i++) {
      var stillUrl = response.data[i].images["480w_still"].url;
      var gifUrl = response.data[i].images.downsized.url;
      var newGif = $("<img class='gif'>").attr("data-gifurl", gifUrl).attr("data-stillurl", stillUrl).attr("data-imgtype", "still").attr("src", stillUrl);
      var favoriteBtn = '<span class="badge badge-secondary favoriteBtn"><i class="far fa-star"></i></span>';
      var gifDiv = $("<div class='gifDiv'>").append(newGif, favoriteBtn);
      $("#gifContainer").append(gifDiv);
    }
  })
}

function addUserTag() {
  var userTag = $("#addTagInput").val().trim().toLowerCase();
  if (userTag.length > 2 && defaultTags.indexOf(userTag) === -1) {
    defaultTags.push(userTag);
    renderTags(defaultTags);
    fetchGifs(userTag);
    $("#addTagInput").val("");
  }
}

function toggleGif(thisGif) {
  if (thisGif.attr("data-imgtype") === "still") {
    var gifUrl = thisGif.attr("data-gifurl");
    thisGif.attr("src", gifUrl);
    thisGif.attr("data-imgtype", "gif");
  }
  else {
    var stillUrl = thisGif.attr("data-stillurl");
    thisGif.attr("src", stillUrl);
    thisGif.attr("data-imgtype", "still");
  }
}

function setFavorite(favoritedGif) {
  var stillUrl = favoritedGif.data("stillurl");
  var gifUrl = favoritedGif.data("gifurl");
  var favArrItem = {"stillUrl": stillUrl, "gifUrl": gifUrl};
  if (Cookies.get('favoriteGifs')) {
    console.log("it exists");
    var existingFavoriteGifsArr = Cookies.getJSON('favoriteGifs');
    //append new gif to existing cookie obj, push() does not work
    existingFavoriteGifsArr.favs[existingFavoriteGifsArr.favs.length] = favArrItem;
    Cookies.set('favoriteGifs', existingFavoriteGifsArr, { expires: 90 });
  }
  else {
    console.log("it does not exists");
    var favArr = [favArrItem];
    favArr = {"favs": favArr};
    Cookies.set('favoriteGifs', favArr, { expires: 90 });
  }
  console.log("updated cookie:" + Cookies.get('favoriteGifs'));
}

function displayFavorites() {
  if (Cookies.get('favoriteGifs')) {
    var favoritesArr = Cookies.getJSON('favoriteGifs');
    for (var i = 0; i < favoritesArr.favs.length; i++) {
      var stillUrl = favoritesArr.favs[i].stillUrl;
      var gifUrl = favoritesArr.favs[i].gifUrl;
      var favLink = $("<a class='favGif' target='_blank'>").attr("href", gifUrl);
      var favImg = $("<img>").attr("src", stillUrl);
      favImg.attr("data-stillurl", stillUrl);
      favImg.attr("data-gifurl", gifUrl);
      favImg.attr("data-imgtype", "still");
      favLink.html(favImg);
      $("#favoritesContainer").append(favLink);
    }
  }
}


//jquery ready
$(function(){
  //initialize
  renderTags(defaultTags);
  fetchGifs("Abstract");
  displayFavorites();

  //load new gifs when tag is clicked
  $("#tagContainer").on("click", ".tag", function(){
    var tag = $(this).attr("data-tag");
    fetchGifs(tag);
  });

  //add new user tag when form is submitted
  $("#addTag").on("click", function(){
    event.preventDefault();
    addUserTag();
  });

  $("#gifContainer").on("click", ".gif", function(){
    var thisGif = $(this);
    toggleGif(thisGif);
  });

  //toggle download button
  $("#gifContainer").on("mouseenter", ".gifDiv", function(){
    $(this).children(".favoriteBtn").show();
  });
  $("#gifContainer").on("mouseleave", ".gifDiv", function(){
    $(this).children(".favoriteBtn").hide();
  });

  //add gif to favorites
  $("#gifContainer").on("click", ".favoriteBtn", function(){
    var favoritedGif = $(this).siblings(".gif");
    setFavorite(favoritedGif);
  });

});
