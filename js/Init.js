/**
 * Initialize all.
 */
// manual jQuery plugins
(function( $, undefined ){
    /**
     * Set not only width but min-width
     */
    $.fn.setWidth = function(width) {
        return this.each(() =>
        {
            $(this).css({
                "width": width,
                "min-width": width
            });
        });
    };
    
    /**
     * Get cursor position of input area
     */
    $.fn.getCursorPosition = function() {
        var el = $(this).get(0);
        var pos = 0;
        if('selectionStart' in el) {
            pos = el.selectionStart;
        } else if('selection' in document) {
            el.focus();
            var Sel = document.selection.createRange();
            var SelLength = document.selection.createRange().text.length;
            Sel.moveStart('character', -el.value.length);
            pos = Sel.text.length - SelLength;
        }
        return pos;
    }
})( jQuery );

// Inits
Settings.Init();
Common.Init();
Menubar.Init();
ToolbarArea.Init();
CommentArea.Init();
SendCommentArea.Init();
InformationArea.Init();
BeamManager.Init();
BouyomiChanManager.Init();
StatusArea.Init();
Emoticon.Init();