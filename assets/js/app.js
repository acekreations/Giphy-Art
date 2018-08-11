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
  var apiKey = "nFQ89Mq5zf85yyf2d2OqQFzI7x9XfRWz";
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
      var newGif = $("<img class='gif' style='display:none;'>").attr("data-gifurl", gifUrl).attr("data-stillurl", stillUrl).attr("data-imgtype", "still").attr("src", stillUrl);
      newGif.bind("load", function () { $(this).fadeIn(); });
      //var overlay = $("<div class='gifOverlay'>");
      var downloadBtn = $("<a class='btn btn-secondary btn-sm download' target='_blank' download>").text("Download").attr("href", gifUrl);
      var gifDiv = $("<div class='gifDiv'>").append(newGif, downloadBtn);
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

$("#gifContainer").on("click", ".gif", function(){
  var thisGif = $(this);
  toggleGif(thisGif);
});

//toggle download button
$("#gifContainer").on("mouseenter", ".gifDiv", function(){
  $(this).children(".download").show();
});
$("#gifContainer").on("mouseleave", ".gifDiv", function(){
  $(this).children(".download").hide();
});

});
