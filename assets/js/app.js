var defaultTags = ["Abstract", "Minimal", "Geometric", "Trippy", "Illustration", "3d", "Design", "Motion Graphics", "Pattern", "Color"];

function renderTags(tagArr) {
  $("#tagContainer").empty();
  for (var i = 0; i < tagArr.length; i++) {
    var newBtn = $('<button type="button" class="btn btn-primary btn-sm mt-2 mr-1 tag">');
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
  var apiKey = "nFQ89Mq5zf85yyf2d2OqQFzI7x9XfRWz";
  var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=" + apiKey + "&q=" + tag + "&limit=10&rating=g&offset=" + offset;
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response){
    $("#gifContainer").empty();
    for (var i = 0; i < response.data.length; i++) {
      var stillUrl = response.data[i].images["480w_still"].url;
      var gifUrl = response.data[i].images.downsized.url;
      var newGif = $("<img class='gif'>").attr("data-gifurl", gifUrl).attr("data-stillurl", stillUrl).attr("data-imgtype", "still").attr("src", stillUrl);
      var overlay = $("<div class='gifOverlay'>");
      var gifDiv = $("<div class='gifDiv'>").append(newGif, overlay);
      $("#gifContainer").append(gifDiv);
    }
  })
}

function addUserTag() {
  var userTag = $("#addTagInput").val().trim();
  console.log(userTag);
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


//jquery ready
$(function(){
//initialize
renderTags(defaultTags);
fetchGifs("Abstract");

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

$("#gifContainer").on("click", ".gifOverlay", function(){
  var thisGif = $(this).siblings(".gif");
  console.log(thisGif);
  toggleGif(thisGif);
});

});
