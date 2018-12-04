/*
 * jQuery UI Autocomplete HTML Extension
 *
 * Copyright 2010, Scott González (http://scottgonzalez.com)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * http://github.com/scottgonzalez/jquery-ui-extensions
 */
(function( $ ) {

var proto = $.ui.autocomplete.prototype,
	initSource = proto._initSource;

function filter( array, term ) {
	var matcher = new RegExp( $.ui.autocomplete.escapeRegex(term), "i" );
	return $.grep( array, function(value) {
		return matcher.test( $( "<div>" ).html( value.label || value.value || value ).text() );
	});
}

$.extend( proto, {
	_initSource: function() {
		if ( this.options.html && $.isArray(this.options.source) ) {
			this.source = function( request, response ) {
				response( filter( this.options.source, request.term ) );
			};
		} else {
			initSource.call( this );
		}
	},

	_renderMenu: function( ul, items ) {
		var that = this,
				newItem;

		if (this.options.header) {
			newItem = { header: this.options.header };

			// Insert our "Suggested" label to the top of the menu
			items.splice(0, 0, newItem);
		}

		$.each( items, function( index, item ) {
			that._renderItemData( ul, item );
		});
	},

	_renderItem: function (ul, item) {
		var newListItem = $("<li>");
		
		// If this is our header item, render it differently
		if (item.header) {
			newListItem.text(item.header).addClass("ui-state-disabled");
		} else {
			var $a = $("<a></a>")[this.options.html ? "html" : "text"](item.label);

			if (item.selected) {
				newListItem.addClass('selected');
				$a.append($("<span class='selected-checkmark small icon-checkmark'></span>"));
			}

			newListItem.data("item.autocomplete", item).append($a);

		}

		newListItem.appendTo(ul);

		return newListItem;
	},

	// Override so we can change the position of the menu
	_suggest: function( items ) {
		var ul = this.menu.element.empty();
		this._renderMenu( ul, items );
		this.isNewMenu = true;
		this.menu.refresh();

		// size and position menu
		ul.show();
		this._resizeMenu();
		ul.position( $.extend({
			of: this.options.positionOf ? this.options.positionOf : this.element
			//of: this.element
		}, this.options.position ) );

		if ( this.options.autoFocus ) {
			this.menu.next();
		}
	},

	// Override so we can make the menu the same width as its container
	_resizeMenu: function() {
		var ul = this.menu.element,
				refElement = this.options.positionOf;

		if (refElement) {
			refElement = $(refElement);
			if (!refElement.length) {
				refElement = this.element;
			}
		} else {
			refElement = this.element;
		}

		ul.outerWidth( Math.max(
				// Firefox wraps long text (possibly a rounding bug)
				// so we add 1px to avoid the wrapping (#7513)
				ul.width( "" ).outerWidth() + 1,
				refElement.outerWidth()
		) );
	}
});

})( jQuery );
