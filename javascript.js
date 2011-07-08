

$(function () {
		$(".button").click(function () {
				var dataString = 'name=' + name + '&email=' + email + '&phone=' + phone;
				//alert (dataString);return false;
				$.ajax({
						type : "POST",
						url : "bin/process.php",
						data : dataString,
						success : function () {
							$('#contact_form').html("<div id='message'></div>");
							$('#message').html("<h2>Contact Form Submitted!</h2>")
							.append("<p>We will be in touch soon.</p>")
							.hide()
							.fadeIn(1500, function () {
									$('#message').append("<img id='checkmark' src='images/check.png' />");
								});
						}
					});
				return false;
			});
	});

/** Form validation **/
$(function () {
		$('.error').hide();
		$(".button").click(function () {
				// validate and process form here
				
				$('.error').hide();
				var pipeurl = $("input#pipeurl").val();
				if (pipeurl == "") {
					$("label#url_error").show();
					$("input#pipeurl").focus();
					return false;
				}
				var param = $("input#param").val();
				if (email == "") {
					$("label#param_error").show();
					$("input#param").focus();
					return false;
				}
				
			});
	});

 