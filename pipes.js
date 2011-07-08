/* global variables */

// The URL of the RSS feed you want to display

//The id of the HTML element you want to contain the displayed feed
var containerID = "pipes-feed-content";

$(document).ready(function () {
		//code here
	});

function JSONcall(form) {
	
	var parameter,
	id;
	
	parameter = $("form > count").value;
	id = $("form > url").value;
	url = "http://pipes.yahoo.com/pipes/pipe.run?id=" + pipe_id + "&" + parameter + "&_render=json&_callback=myCallbackFunction";
	
	//fetch the feed from the address specified in 'url'
	// then call "myCallbackFunction" with the resulting feed items
	$.getJSON(
		url,
		function (data) {
			myCallbackFunction(data.value.items);
		});
}

function myCallbackFunction(items) {
	// 'items' contains the separate feed items;
	// 'title' contains the item title, 'link' the url, 'description' the main text
	
	// Run through each item in the feed and print out its title
	for (var i = 0; i < items.length; i++) {
		displayOutput(items[i].title);
	}
	// You could easily call 'myArbitraryCallbackFunction(items)" from this function
}

// Display the title of the feed items
function displayOutput(txt) {
	$('#' + containerID).append('<div>' + txt + '</div>');
}

// Tell JQuery to call the feed loader when the page is all loaded
//$(document).ready(JSONcall(url));


/*** previous code 2011-07-08


var descList = new Array();
var itemList = "";

$(document).ready(function() {
var content = "",
url = "";

$.getJSON("yahoopiping.php",
function(json){
if(json.count > 0) {
content = output_feed_items(json);
} else {
content = "The request did not return results.";
}
$("#pipes-feed-content").html(content);
}
);
});

function output_feed_items(json) {
document.title = json.value.title;
var heading = '<h3>' + json.value.title + '</h3>';
for (i=0;i<json.count;i++) {
itemList += make_feed_item(json.value.items[i], i);
descList.push(make_feed_desc(json.value.items[i], i));
}
return heading + itemList;
}

function make_feed_item(item, item_id) {
return '<h4 id="heading-' + item_id + '">' +
'<a href="#heading-' + item_id +
'" onclick="toggle_feed_desc(' + item_id + ');">' +
item.title + '</a></h4>';
}

function make_feed_desc(item, item_id) {
var desc_info = '<span="item-submitted">Published: ' +
item.pubDate + '</span>';
desc_info += ' - <a href="' + item.link + '">Link to Article</a>';
var desc_info = '<div class="item-info">' + desc_info + '</div>';
return '<div id="desc-' + item_id + '">' +
desc_info + item.description + '</div>';
}

function toggle_feed_desc(item_id) {
var heading = '#heading-' + item_id;
var item_div = 'div#desc-' + item_id;
if ($(item_div).html()) {
$(item_div).remove();
} else {
$(heading).after(descList[item_id]);
}
}

 **/
 