jQuery.ajaxPrefilter(function (options) {
  if (options.crossDomain && jQuery.support.cors) {
    options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
  }
});

var defaultTags = ["abstract", "minimal", "geometric", "trippy", "illustration", "3d", "design", "motion graphics", "pattern", "color"];

//dipslay tags on page
function renderTags(tagArr) {
  $("#tagContainer").empty();
  for (var i = 0; i < tagArr.length; i++) {
    var newBtn = $('<button type="button" class="btn btn-primary btn-sm mt-2 mr-1 tag text-capitalize">');
    newBtn.attr("data-tag", tagArr[i]);
    newBtn.text(tagArr[i]);
    $("#tagContainer").append(newBtn);
  }
}

//display title above gifs
function renderTitle(tag) {
  $("#tagTitle").text(tag);
}

//get gifs based on tag that was clicked or the default "abstract" query, then display new gifs on page.
function fetchGifs(tag, loadMore) {
  renderTitle(tag);
  $("#loadMore").attr("data-tag", tag);
  //get rand num for the offset query in the api
  var offset = Math.floor(Math.random() * 1000);
  var apiKey = "nFQ89Mq5zf85yyf2d2OqQFzI7x9XfRWz";
  // var apiKey = "bukNnkHciMEN5ODtDi4RwYv9ks57W5GV";
  var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=" + apiKey + "&q=" + tag + "&limit=10&rating=g&offset=" + offset;
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response){
    //if loadmore button was NOT pressed empty the gif container
    if (!loadMore) { $("#gifContainer").empty() };

    for (var i = 0; i < response.data.length; i++) {
      var stillUrl = response.data[i].images["480w_still"].url;
      var gifUrl = response.data[i].images.downsized.url;
      var newGif = $("<img class='gif'>").attr("data-gifurl", gifUrl).attr("data-stillurl", stillUrl).attr("data-imgtype", "still").attr("src", stillUrl);
      var favoriteBtn = '<span class="badge favoriteBtn" style="display: none;"><i class="far fa-star fa-2x"></i></span>';
      var gifDiv = $("<div class='gifDiv'>").append(newGif, favoriteBtn);
      $("#gifContainer").append(gifDiv);
    }
  })
}

//collect users new tag and reload tag container
function addUserTag() {
  var userTag = $("#addTagInput").val().trim().toLowerCase();

  if (userTag.length > 2 && defaultTags.indexOf(userTag) === -1) {
    defaultTags.push(userTag);
    renderTags(defaultTags);
    fetchGifs(userTag);
    $("#addTagInput").val("");
  }
}

//switch still images to gif images on click
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

//get and set new favorite gif when star on page is clicked
function setFavorite(favoritedGif) {
  var stillUrl = favoritedGif.data("stillurl");
  var gifUrl = favoritedGif.data("gifurl");
  var favArrItem = {"stillUrl": stillUrl, "gifUrl": gifUrl};

  //check if favorite already exists
  if (localStorage.getItem('favoriteGifs')) {
    var existingFavoriteGifsArr = JSON.parse(localStorage.getItem('favoriteGifs'));

    for (var i = 0; i < existingFavoriteGifsArr.favs.length; i++) {
      if (existingFavoriteGifsArr.favs[i].stillUrl === stillUrl) {
        return "Favorite already exists";
      }
    }
    //append new gif to existing cookie obj, push() does not work
    existingFavoriteGifsArr.favs[existingFavoriteGifsArr.favs.length] = favArrItem;
    localStorage.setItem('favoriteGifs', JSON.stringify(existingFavoriteGifsArr));
  }
  else {
    var favArr = [favArrItem];
    favArr = {"favs": favArr};
    localStorage.setItem("favoriteGifs", JSON.stringify(favArr));
  }
  renderFavorites();
}

//display users favorite gifs on the page
function renderFavorites() {
  $("#favoritesContainer").empty();
  if (localStorage.getItem('favoriteGifs')) {
    var favoritesArr = JSON.parse(localStorage.getItem('favoriteGifs'));
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
  fetchGifs("Abstract", false);
  renderFavorites();

  //load new gifs when tag is clicked
  $("#tagContainer").on("click", ".tag", function(){
    var tag = $(this).attr("data-tag");
    fetchGifs(tag, false);
  });

  //load more gifs when load more button is pressed
  $("#loadMore").on("click", function(){
    var tag = $(this).attr("data-tag");
    fetchGifs(tag, true);
  });

  //add new user tag when form is submitted
  $("#addTag").on("click", function(){
    event.preventDefault();
    addUserTag();
  });

  //toggle still/animated gif and show favorite button
  $("#gifContainer").on("mouseenter", ".gifDiv", function(){
    $(this).children(".favoriteBtn").show();
    var thisGif = $(this).children(".gif");
    toggleGif(thisGif);
  });
  $("#gifContainer").on("mouseleave", ".gifDiv", function(){
    $(this).children(".favoriteBtn").hide();
    var thisGif = $(this).children(".gif");
    toggleGif(thisGif);
  });

  //add gif to favorites
  $("#gifContainer").on("click", ".favoriteBtn", function(){
    var favoritedGif = $(this).siblings(".gif");
    setFavorite(favoritedGif);
  });

});
