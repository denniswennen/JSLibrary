var stack = [0];

$(document).ready(function () {
		
		//INIT onLoad
		update_status_text("Ready. Waiting for pipe load.");
		document.getElementById('statusicon').style.display = 'none';
		$("#btnDel").hide();
		$(".sliding").hide();
		createPipeList();
		$('#DynamicGridLoading').hide();
		
		update_UI();
		
		$('.button:not("#importpipebutton")').css('visibility', 'hidden');
		
		$('#div_timeline, #div_googlechart').css('visibility', 'hidden');
		
		$('#div_timeline, #div_googlechart').each(function() {
			if ($(this).css("visibility") == "hidden") {
			$(this).css('display', 'none');
			}
		});
		
		$('.button').click(
			function () {
				var id,
					div;
					
				id = $(this).attr('id');
				
				if ( "googledrawbutton" == id ) {
					div = $('#div_googlechart');
					div.css('display', 'inherit').css('visibility', 'visible');
				} else if ( "timelinedrawbutton" == id ) {
					div = $('#div_timeline');
					div.css('display', 'inherit').css('visibility', 'visible');
				}
					
			}
		);
		
		$('.show_hide').click(function () {
				$(".sliding").slideToggle();
			});
		
		$('.mapslider').click(function () {
				$(".slidingmap").slideToggle();
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
		
		$('#btnAdd').click(function () {
				var num = $('.clonedInput').length; // how many "duplicatable" input fields we currently have
				var newNum = new Number(num + 1); // the numeric ID of the new input field being added
				
				if (num == 0) {
					// create the new element via clone(), and manipulate it's ID using newNum value
					var newElem = $('<div id="input1" style="margin-bottom:4px" class="clonedInput">Parameter: <input type="text" class="param_name" name="name1" id="name1" /> Value: <input type="text" class="param_value" name="value1" id="value1" /></div>').appendTo($('#emptydiv'));
				} else {
					// create the new element via clone(), and manipulate it's ID using newNum value
					var newElem = $('#input' + num).clone().attr('id', 'input' + newNum);
					
					// manipulate the name/id values of the input inside the new element
					newElem.children(':first').attr('id', 'param' + newNum).attr('name', 'param' + newNum);
					newElem.children(':nth-child(2)').attr('id', 'value' + newNum).attr('name', 'value' + newNum);
					
					// insert the new element after the last "duplicatable" input field
					$('#input' + num).after(newElem);
				}
				
				// enable the "remove" button
				if (num == 0) {
					$("#btnDel").slideToggle();
				}
			});
		
		$('#btnDel').click(function () {
				var num = $('.clonedInput').length; // how many "duplicatable" input fields we currently have
				$('#input' + num).remove(); // remove the last element
				
				// if only one element remains, disable the "remove" button
				if (num == 1)
					$("#btnDel").slideToggle();
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
		if (i != 0) {
			items[i].style.display = 'none';
			ellipsis = document.createElement('span');
			ellipsis.className = 'ellipsis';
			ellipsis.innerHTML = ' &hellip; ';
			items[i].parentNode.insertBefore(ellipsis, items[i]);
		}
	}
	
	function Clicker(evt) {
		
		var newAttr = evt.target.innerHTML;
		document.getElementById("selectedAttributes").innerHTML = newAttr;
		
	}
	
	// (previous) Function executed when an attribute is clicked
	function Clicker2(evt) {
		
		var newAttr = evt.target.innerHTML,
		currentAttr = document.getElementById('selectedAttributes').innerHTML.split(" | ", 1);
		document.getElementById("selectedAttributes").innerHTML = newAttr + " | " + currentAttr;
		
	}
	
	items = document.getElementsByClassName('prop');
	for (i = 0; i < items.length; i++) {
		items[i].addEventListener('click', Clicker, false)
	}
}

function GetSelectedText(selectItem) {
	var index = document.getElementById(selectItem).selectedIndex;
	return document.getElementById(selectItem).options[index].text;
}

function GetSelectedValue(selectItem) {
	var index = document.getElementById(selectItem).selectedIndex;
	return document.getElementById(selectItem).options[index].value;
}

function getRenderType() {
	
	var radios = document.getElementById("paramForm").pipetype;
	for (var i = 0; i < radios.length; i++) {
		if (radios[i].checked) {
			var rad_val = radios[i].value;
		}
	}
	
	return rad_val;
}

function create_checkboxes() {
	$("#keytable tr")
		.filter(':has(:checkbox:checked)')
		.addClass('selected')
		.end()
		.click(function (event) {
		
			var num = $("#keytable").find(".selected").length + 1;
			var result = $("#keytable").find(".numberCell");
			var i,
				j,
				v,
				bingo;
					
			for(i=0; i < result.length; i++) {
				if( result[i].innerHTML.length !== 0) {
					v = parseInt( result[i].innerHTML, 10);
					stack[v] = v;
				}
			}
			$(this).toggleClass('selected');
			
			if( $(this).hasClass('selected') ) { //number add
				for(j=0; j < stack.length; j++) {
					if( stack[j] === undefined ) {
						bingo = j;
						break;
					}
					else {
						bingo = num;
					}
				}
				$(this).find("td.numberCell")
					.attr('id', 'selected'+bingo)
					.html( bingo )
					.css('fontWeight', 'bold');
			} 
			else { //number remove
				$(this).find("td.numberCell")
					.removeAttr('id')
					.html( "" );
				for(i=0; i < result.length; i++) {
					stack.length = 1;
					if( result[i].innerHTML.length !== 0) {
						v = parseInt( result[i].innerHTML, 10);
						stack[v] = v;
					}
				}
			}

			if (event.target.type !== 'checkbox') {
				$(':checkbox', this).attr('checked', function () {
						return !this.checked;
					});
			}
			

		});
		
}

function update_status_text(str, status) {

	var o;

	o = document.getElementById("status");
	o.innerHTML = str;
	
	
	if( "error" == status ) {
		o.style["color"] = "#e40016";
	} else if ( "warning" == status ) {
		o.style["color"] = "#f77007";
	} else {
		o.style["color"] = "#0aa868";
	}

}
