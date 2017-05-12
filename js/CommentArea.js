class CommentArea
{
    static Init()
    {

    }

    /**
     * Create system message and put it
     * @param {String} message 
     */
    static SystemMessage(message)
    {
        var data = {
            'Icon': '<i class="material-icons blue-grey-text text-lighten-2">info</i>',
            'UserName': 'System',
            'Comment': message,
            'IsWhisper': false,
            'IsOwner': false,
            'IsSystem': true
        };
        this.PutComment(data);
    }

    /**
     * Put comment to comment area.
     * @param {Object} _data formated data using function Format 
     */
    static PutComment(_data)
    {
        var FirstLine = '';
        if( _data.IsWhisper )
        {
            FirstLine = '<div class="Row Whisper blue lighten-4">';
        }
        else if ( _data.IsOwner )
        {
            FirstLine = '<div class="Row Owner pink lighten-3">';
        }
        else if( _data.IsSystem )
        {
            FirstLine = '<div class="Row System yellow lighten-5">';
        }
        else
        {
            FirstLine = '<div class="Row">';
        }

        var Data =
        [
            FirstLine,
            '   <div class="Icon"><span>' + _data.Icon + '</span></div>',
            '   <div class="UserName"><span title="' + _data.UserName + '">' + _data.UserName + '</span></div>',
            '   <div class="Time"><span>' + Common.GetTime() + '</span></div>',
            '   <div class="Comment"><span>' + _data.Comment + '</span></div>',
            '</div>'
        ].join("");

        var ScrollBarIsBottom = false;
        var CommentArea = $('#CommentArea');
        if( CommentArea.scrollTop() + CommentArea.outerHeight() == CommentArea.get(0).scrollHeight )
        {
            ScrollBarIsBottom = true;
        }

        $("#Comment").before(Data);

        this.RemoveExceedComment();

        if( ScrollBarIsBottom )
        {
            CommentArea.scrollTop( CommentArea.get(0).scrollHeight );
        }
    }

    /**
     * Remove exceeded comment from Comment Area
     */
    static RemoveExceedComment()
    {
        const Max = Settings.MaxDisplayComment;
        if( Max > 0 )
        {
            while( $('#CommentArea #Body .Row').length > Max )
            {
                $('#ViewCommentArea #Body .Row:first-child').remove(); 
            }
        }
    }

    /**
     * Format data into ray specific format.
     * @access public
     * @param {Object} _data 
     * @return {Object}
     */
    static Format(_data)
    {
        var data = {
            Icon: undefined,
            UserName: undefined,
            Comment: undefined,
            IsWhisper: undefined,
            IsOwner: undefined,
            IsSystem: undefined
        };

        data.Icon = Common.GetAvatar(_data.user_id);
        data.UserName = _data.user_name;
        data.IsWhisper = _data.message.meta.whisper;
        data.IsOwner = _data.user_roles[0] == 'Owner' ? true : false;
        data.IsSystem = false;

        // Formating data here.
        let comment = '';
        for( var id in _data.message.message )
        {
            var m = _data.message.message[id];

            if( m.type == 'emoticon' )
            {
                comment += Emoticon.GetEmoticonTag( m.text );
            }
            else if( m.type == 'link' )
            {
                comment += CommentArea.InsertLinkTag( m.text );
            }
            else
            {
                comment += m.text;
            }
        }

        data.Comment = comment;

        return data;
    }

    /**
     * Insert link tag to easily open in view area.
     * @access public
     * @param {String} url
     * @return {String}
     */
    static InsertLinkTag(url)
    {
        return '<span class="Link" onclick="Common.OpenLink(\'' + URL + '\');">' + url + '</span>';
    }

    /**
     * Insert span tag class named Owner.
     * @param {String} text
     * @return {String} 
     */
    static InsertOwnerTag(text)
    {
        return '<span class="Owner">' + text + '</span>';
    }

}