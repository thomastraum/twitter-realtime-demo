(function ($){

	var $container = $('#container');

	$container.isotope({
		itemSelector : '.element',
		layoutMode: 'cellsByRow',
		cellsByRow: {
			columnWidth: 240,
			rowHeight: 180
		}
	});

	var getFirstElements = function(num){

		var $firstElement = $container.data('isotope').$filteredAtoms.filter( function( i ) {
			return i < num;
		});

		return $firstElement;
	};

	var getAllElements = function(){

		var $elements = $container.data('isotope').$filteredAtoms.filter( function( i ) {
			return i;
		});

		return $elements;
	}

	var getHtmlWrapped = function( html ) {
		return "<div class='element' >" + html + "</div>";
	};

	var addElements = function( imagesBuffer ) {		

		// var $all = getAllElements();
		// if ( $all.length > 20 ) {
		// 	$container
		// 		.isotope( 'remove', getFirstElements(1) );
		// }

		var newElements = "";
		for (var i = 0; i < imagesBuffer.length; i++) {
			newElements += getHtmlWrapped( imagesBuffer[i] );
		};
		newElements  = $(newElements);
		// console.log( string );



		// setTimeout( function() {

			$container
				.append( newElements ).isotope( 'appended', newElements );
				// .isotope( 'remove', getFirstElements(5) )
		// }, 1000);

	}


	$('#append a').click(function(){
		addElements( ["hey","ho","one"] );
	});

	/*
	* socket.io
	*/

	var socket = io.connect();
	var buffer = [];

	socket.on('tweet', function(data) {

		// console.log( data );

		var html = "";
		html += "<img src='" + data.image + "' width='150px' height='150px' >"
		html += "<p>" + data.screen_name + "</p>";
		// html += "<p>" + data.text + "</p>";

		buffer.push( html );

		if (buffer.length > 1 ) {
			addElements( buffer );
			buffer = [];
		}

		// addNewElement( html );

	});

	$(document).ready(function() {
		// $("#images").append( "<p>Test</p>" );
		// console.log( 'hi');
	});

}(jQuery));