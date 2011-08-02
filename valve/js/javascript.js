$(document).ready(function () {
		
		$(".sliding").hide();
		
		$('.show_hide').click(function () {
				$(".sliding").slideToggle();
			});
		
		$(".add").click(function () {
				var el = $("form > p:nth-child(1)")
				.clone(true)
				.insertBefore("form > p:last-child");
				return false;
			});
		
		$(".remove").click(function () {
				$(this).parent().remove();
			});
		
	});

/* Adds an option to the selected dropdownbox */
function addOption(selectbox, text, value) {
	var optn = document.createElement("OPTION");
	optn.text = text;
	optn.value = value;
	selectbox.options.add(optn);
}

// Adds the clickHandlers for the JSON Viewer
function addClickHandlers() {
	
	var items,
	i,
	ellipsis,
	collapser;
	
	// Click handler for collapsing and expanding objects and arrays
	function collapse(evt) {
		collapser = evt.target;
		
		var target = collapser.parentNode.getElementsByClassName('collapsible');
		
		if (!target.length) {
			return;
		}
		
		target = target[0];
		
		if (target.style.display == 'none') {
			ellipsis = target.parentNode.getElementsByClassName('ellipsis')[0];
			target.parentNode.removeChild(ellipsis);
			target.style.display = '';
		} else {
			target.style.display = 'none';
			ellipsis = document.createElement('span');
			ellipsis.className = 'ellipsis';
			ellipsis.innerHTML = ' &hellip; ';
			target.parentNode.insertBefore(ellipsis, target);
		}
		
		collapser.innerHTML = (collapser.innerHTML == '-') ? '+' : '-';
	}
	
	function addCollapser(item) {
		
		// This mainly filters out the root object (which shouldn't be collapsible)
		if (item.nodeName != 'LI') {
			return;
		}
		
		collapser = document.createElement('div');
		collapser.className = 'collapser';
		collapser.innerHTML = '+';
		collapser.addEventListener('click', collapse, false);
		item.insertBefore(collapser, item.firstChild);
	}
	
	
	items = document.getElementsByClassName('collapsible');
	for (i = 0; i < items.length; i++) {
		addCollapser(items[i].parentNode);
		if ( i != 0 ) {
			items[i].style.display = 'none';
			ellipsis = document.createElement('span');
			ellipsis.className = 'ellipsis';
			ellipsis.innerHTML = ' &hellip; ';
			items[i].parentNode.insertBefore(ellipsis, items[i]);
		}
	}
	
	//Function executed when an attribute is clicked
	function Clicker(evt) {
	
		var newAttr = evt.target.innerHTML,
			currentAttr = document.getElementById('selectedAttributes').innerHTML.split(" | ",1);
		document.getElementById("selectedAttributes").innerHTML = newAttr + " | " + currentAttr;
		
	}
	
	items = document.getElementsByClassName('prop');
	for (i = 0; i < items.length; i++) {
		items[i].addEventListener('click', Clicker, false)
	}
}
 