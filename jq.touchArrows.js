/**
 * jQuery touchArrows - v1.0 - 5/23/2012
 * https://github.com/pesblog/jq.touchArrows/
 *
 * Copyright (c) 2012 "pesblog" Noritak Baba
 * Licensed under the MIT licenses.
 */

/**
 * Examples:
 *
 * <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
 * <script src="//pesblog.github.com/jq.touchArrows/jq.touchArrows.min.js"></scirpt>
 * <script>
 * touchArrows({
 *     textarea: 'selector',
 *     topBtn: 'selector',
 *     btmBtn: 'selector',
 *     moving: 'className' // optional
 * });
 * </script>
 * 
 * Demo:
 * http://pesblog.github.com/jq.touchArrows/
 */

;function touchArrows( args ){
    var opt = $.extend({
        textarea: '.textarea',
        topBtn: '.up',
        btmBtn: '.down',
        moving: 'moving'
    }, args == undefined ? {}:args );

    var $textarea = $( opt.textarea ),
        height = $textarea.height(),
        lineHeight = parseInt( $textarea.css('line-height').slice(0, -2) ),
        lineCharNum = 10,
        allLineNum = ( height / lineHeight ) - 1;

    function _touchstart( self, direction ) {
        if ( self.scrollTimer != undefined ) {
            clearInterval( self.scrollTimer );
        }
        if ( self.clickTimer != undefined ) {
            clearTimeout( self.clickTimer );
        }
        self.nowScroll = $textarea.scrollTop();
        self.selectionPoint = $textarea[0].selectionStart;
        self.scrollTimer = undefined;
        self.i = 0;
        self.clickTimer = setTimeout( function() {
            self.scrollTimer = setInterval( function() {
                if ( direction == 'bottom' ) {
                    $textarea.scrollTop( self.nowScroll + ( lineHeight * self.i / 3 ) );
                    _moveSelectionPoit( $textarea[0], lineCharNum );
                }
                else if ( direction == 'top' ) {
                    $textarea.scrollTop( self.nowScroll - ( lineHeight * self.i / 3 ) );
                    _moveSelectionPoit( $textarea[0], ( (-1) * lineCharNum ) );
                }
                self.i++;
            }, 25 );
        }, 400 );

        $( self ).addClass( opt.moving );
    }

    function _touchend( self, direction ) {
        $( self ).removeClass( opt.moving );

        if ( self.scrollTimer != undefined ) {
            clearInterval( self.scrollTimer );
            return;
        }

        var charmovepoint = ( lineCharNum * allLineNum );
        if ( direction == 'bottom' ) {
            $textarea.stop().animate({scrollTop: self.nowScroll + height - lineHeight}, 'slow');
            _moveSelectionPoit( $textarea[0], charmovepoint );
        }
        else if ( direction == 'top' ) {
            $textarea.stop().animate({scrollTop: self.nowScroll - height + lineHeight}, 'slow');
            _moveSelectionPoit( $textarea[0], ( -1 * charmovepoint ) );
        }
        clearTimeout( self.clickTimer );
    }

    function _moveSelectionPoit( elem, move ) {
        var point = elem.selectionStart + move;
        elem.selectionStart = point;
        elem.selectionEnd = point;
        return point;
    }

    $( opt.topBtn +','+ opt.btmBtn ).click( function(e) {
        e.preventDefault();
        e.stopPropagation();
    });

    $( opt.topBtn ).bind( 'touchstart mousedown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        _touchstart( this, 'top' );
    });
    $( opt.topBtn ).bind( 'touchend mouseup', function(e) {
        _touchend( this, 'top' );
    });

    $( opt.btmBtn ).bind( 'touchstart mousedown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        _touchstart( this, 'bottom' );
    });
    $( opt.btmBtn ).bind( 'touchend mouseup', function(e) {
        _touchend( this, 'bottom' );
    });

    setTimeout(function(){$textarea.trigger('focus');},0);
}