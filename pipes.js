/** makes the right string of the url **/
function createPipe(form) {
	var url;
	
	url = form.inputurl.value.replace("info", "run");
	url = inputURL.concat("&_render=json" + "&param=" + form.param.value + "&_callback=pipeCallback");
	
	alert(url);
	/*
	var ka = document.createElement('script');
	ka.type = 'text/javascript';
	ka.src = url;
	var ks = document.getElementsByTagName('script')[0];
	ks.parentNode.insertBefore(ka, ks);
	*/
}

/**

/function pipeCallback(response) {
	try {
		var newsItem = response.value.items[0].channel.item[0];
		alert( newsItem.pubDate +"\n\n" + newsItem.title +"\n\n" + newsItem.description );
	}
	catch(err) { alert('Invalid response'+err); }
}

**/
 