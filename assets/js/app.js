var defaultTags = ["Abstract", "Minimal", "Geometric", "Trippy", "Illustration", "3d", "Design", "Motion Graphics", "Pattern", "Color"];

function renderTags(tagArr) {
  for (var i = 0; i < tagArr.length; i++) {
    var newBtn = $('<button type="button" class="btn btn-primary btn-sm mt-2 mr-1">');
    newBtn.attr("data-tag", tagArr[i]);
    newBtn.text(tagArr[i]);
    $("#tagContainer").append(newBtn);
  }
}

function fetchGifs(tag) {
  //var tag = $(this).attr("data-tag");
  var apiKey = "nFQ89Mq5zf85yyf2d2OqQFzI7x9XfRWz";
  var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=" + apiKey + "&q=" + tag + "&limit=10&rating=g";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response){
    console.log(response);
    for (var i = 0; i < response.data.length; i++) {
      var stillUrl = response.data[i].images["480w_still"].url;
      var gifUrl = response.data[i].images.downsized.url;
      var newGif = $("<img class='gif'>").attr("data-gifUrl", gifUrl).attr("data-stillUrl", stillUrl).attr("src", stillUrl);
      $("#gifContainer").append(newGif);
    }
  })
}


//jquery ready
$(function(){
renderTags(defaultTags);

fetchGifs("design");

});
