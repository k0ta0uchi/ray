class SendCommentArea
{
    static Init()
    {
        // key codes
        this.MINIMUM_INPUT_SIZE = 100;
        this.KEY_BACKSPACE = 8;
        this.KEY_ENTER = 13;
        this.KEY_DELETE = 46;
        this.KEY_LEFT = 37;
        this.KEY_RIGHT = 39;
        

        // whenever deleted all texts inside InputComment, set InputComment width to MINIMUM_INPUT_SIZE
        SendCommentArea.RegisterInputEvent();

        // brighten InputCommentArea if focused InputComment
        $('.InputComment').click(() =>
        {
            $('#InputCommentArea').css({ 'border': '1px solid #bbd2e2;' });
        });

        // unbrighten InputCommentArea if focused other than InputComment
        $('body div').not('#SendCommentArea').click(() =>
        {
            $('#InputCommentArea').css({ 'border': 'border: 1px solid #ccc;' });
        });
        
        // put focus on InputComment whereever clicked other than InputComment
        $('#InputCommentArea').not('.InputComment').click((e) =>
        {
            var offset = e.originalEvent.clientX;
            $('.InputComment').each((index, ele) =>
            {
                if( offset > ele.offsetLeft && offset < ele.offsetLeft + ele.offsetWidth ) 
                {
                    ele.focus();
                    return false;
                }
                $('.InputComment:last').focus();
            });
        });

        // toggle Emoticons
        $('#EmoticonButton').click(() => {
            Emoticon.ToggleEmoticon();
        });        
    }

    /**
     * Get string width using canvas
     * @param {String} str 
     */
    static GetStringWidth(str)
    {
        if( str != '' )
        {
            var canvas = $('#StringWidth')[0];
            var context = canvas.getContext('2d');
            context.font = "12px 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif";
            var metrics = context.measureText(str);

            return metrics.width;
        }
        else
        {
            if($('#InputCommentArea').children().length == 2){
                return this.MINIMUM_INPUT_SIZE;
            }
            else
            {
                return 10;
            }
        }
    }

    /**
     * Adjust all input width
     */
    static AdjustInputWidth()
    {
        $('.InputComment').each((index, ele) =>
        {
            $(ele).setWidth(SendCommentArea.GetStringWidth($(ele).val()));
        });
    }

    /**
     * Put icon on input area and add 1 more input
     * @param {Object} icon icon DOM
     */
    static PutIcon( icon )
    {
        // Adjust inputs first
        SendCommentArea.AdjustInputWidth();

        // Set first input width 1px in case of showing placeholder
        if( $('.InputComment').eq(0).val() == '' )
        {
            $('.InputComment').eq(0).setWidth(1);
        }

        // append text input after emoticon
        var input = $('<input type="text" class="InputComment"></input>');
        $('#InputCommentArea').append(icon);
        $('#InputCommentArea').append(input);
        input.focus();
        
        // regist input event again
        SendCommentArea.RegisterInputEvent();

        // get data and image
        var className = icon.attr('class');
        var data = icon.attr('data-image').split(',');
        var img = Emoticon.BeamEmoticons[data[0]].image;

        // draw emoticon
        var c = $('#InputCommentArea .' + className + ' > canvas')[0];
        var ctx = c.getContext('2d');
        ctx.drawImage(img, data[1], data[2], data[3], data[4], 0, 0, data[3], data[4]);
    }

    /**
     * Input event summary
     */
    static RegisterInputEvent()
    {
        SendCommentArea.InputKeypressEvent();
        SendCommentArea.InputKeydownEvent();
        SendCommentArea.InputKeyupEvent();
    }

    /**
     * Input keypress event
     */
    static InputKeypressEvent()
    {
        // clean keypress event
        $('.InputComment').off('keypress');
        $('.InputComment').keypress((e) =>
        {
            var self = e.target;
            if( e.keyCode && e.keyCode == this.KEY_ENTER )
            {
                // check whether connected to channel or not
                if( BeamManager.Socket )
                {
                    BeamManager.SendComment(SendCommentArea.SerializeInput());
                    SendCommentArea.ResetInput();
                    return false;
                }
            }

            $(self).setWidth( SendCommentArea.GetStringWidth(self.value) + 10);
        });
    }

    /**
     * Event for non-printable keys (e.g. Backspace, Delete, etc)
     */
    static InputKeydownEvent()
    {
        $('.InputComment').off('keydown');
        $('.InputComment').keydown((e) =>
        {
            var self = e.target;

            // Delete previous Emoticon and concat inputs
            if( e.keyCode && e.keyCode == this.KEY_BACKSPACE )
            {
                if( $(self).getCursorPosition() == 0)
                {
                    $('.InputComment').each((index, ele) =>
                    {
                        if( $(ele).is($(self)) )
                        {
                            if(index == 0) return;

                            // remove previousSibling
                            $(self.previousSibling).remove();

                            // get self
                            self = $('.InputComment').get(index);

                            // if self value is none, just delete self
                            if( $(self).val() == '' )
                            {
                                $(self).remove();
                            }
                            else 
                            {
                                // if self has some string remain, than mix width previous text input
                                var previous = $('.InputComment').get( index - 1 );
                                previous.value = previous.value + self.value;
                                
                                $(previous).setWidth( SendCommentArea.GetStringWidth(previous.value));
                                $(self).remove();
                            }

                            // focus
                            $('.InputComment:eq(' + (index - 1) + ')').focus();

                            return;
                        }
                    });
                }
            }
            // Delete Emoticon and concat inputs
            else if( e.keyCode && e.keyCode == this.KEY_DELETE )
            {
                if( $(self).getCursorPosition() == self.value.length )
                {
                    $('.InputComment').each((index, ele) =>
                    {
                        if( $(ele).is($(self)) )
                        {
                            $(self.nextSibling.nextSibling).remove();
                            var next = $('.InputComment').get( index + 1 );
                            if( next )
                            {
                                self.value += next.value;
                                $(self).setWidth( SendCommentArea.GetStringWidth(self.value) );
                                $(next).remove();
                            }
                            return;
                        }
                    });
                }
            }
            // focus next input when right key pressed cursor position is last
            else if( e.keyCode && e.keyCode == this.KEY_RIGHT )
            {
                if( $(self).getCursorPosition() == self.value.length )
                {
                    if( !$(self).is($('.InputComment:last')) )
                    {
                        $(self.nextSibling.nextSibling.nextSibling).focus();
                    }
                }
            }
            // focus previous input when left key pressed when cursor position is 0
            else if( e.keyCode && e.keyCode == this.KEY_LEFT )
            {
                if( $(self).getCursorPosition() == 0 )
                {
                    if( !$(self).is($('.InputComment:first')) )
                    {
                        $(self.previousSibling.previousSibling.previousSibling).focus();
                    }
                }
            }
            else
            {
                $(self).setWidth( SendCommentArea.GetStringWidth(self.value) + 20);
            }
        });
    }

    /**
     * Input keyup event
     */
    static InputKeyupEvent()
    {
        // clean keyup event
        $('.InputComment').off('keyup');
        $('.InputComment').keyup((e) =>
        {
            var self = e.target;

            // set MINIMUM_INPUT_SIZE to show placeholder
            if( self.value == '' && $('.InputComment').length == 1)
            {
                $(self).setWidth( this.MINIMUM_INPUT_SIZE );
            }
            else
            {
                $(self).setWidth( SendCommentArea.GetStringWidth(self.value) + 10);
            }
        });
    }

    /**
     * Serialize all inputs include Emoticons
     * @return {String} serialized text data
     */
    static SerializeInput()
    {
        var text = '';
        $('#InputCommentArea').children().each((index, ele) =>
        {
            if( $(ele).attr('data-tooltip') )
            {
                text += $(ele).attr('data-tooltip') + ' ';
            }
            else
            {
                text += ele.value + ' ';
            }
        });

        return text;
    }

    /**
     * Rest all input to initial state
     */
    static ResetInput()
    {
        $('#InputCommentArea').children().each((index, ele) =>
        {
            if( $(ele).is($('.InputComment:first')) )
            {
                $(ele).val('');
                $(ele).setWidth( SendCommentArea.MINIMUM_INPUT_SIZE );
                $(ele).focus();
            }
            else if( !$(ele).is($('#EmoticonButton')) )
            {
                $(ele).remove();
            }
        });
    }
}