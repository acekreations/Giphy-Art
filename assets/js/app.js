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
  var apiKey = "nFQ89Mq5zf85yyf2d2OqQFzI7x9XfRWz";
  var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=" + apiKey + "&q=" + tag + "&limit=10&rating=g";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response){
    $("#gifContainer").empty();
    for (var i = 0; i < response.data.length; i++) {
      var stillUrl = response.data[i].images["480w_still"].url;
      var gifUrl = response.data[i].images.downsized.url;
      var newGif = $("<img class='gif'>").attr("data-gifUrl", gifUrl).attr("data-stillUrl", stillUrl).attr("src", stillUrl);
      $("#gifContainer").append(newGif);
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


//jquery ready
$(function(){
//initialize
renderTags(defaultTags);
fetchGifs("Abstract");

$("#tagContainer").on("click", ".tag", function(){
  var tag = $(this).attr("data-tag");
  fetchGifs(tag);
});

$("#addTag").on("click", function(){
  event.preventDefault();
  addUserTag();
});

});
