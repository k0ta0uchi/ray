class Emoticon
{
    static Init()
    {
        // get manifest.json for emoticon replacement
        const https = require('https');
        const ManifestUrl = 'https://beam.pro/_latest/emoticons/manifest.json';
        this.BeamEmoticons = undefined;
        https.get(ManifestUrl, (res) => {
            var Body = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                Body += chunk;
            });
            res.on('end', () => {
                Emoticon.BeamEmoticons = JSON.parse(Body);
                console.log('Successful Get Emoticons manifest.json');
                console.log( Emoticon.BeamEmoticons );
                Emoticon.LoadEmoticonImages();
                setTimeout(Emoticon.GenerateEmoticonHtml, 1000);
            });
        }).on('error', (e) => {
            console.log('Failed to Emoticons manifest.json: ' + e.message);
        });

        $('#EmoticonClose > i').click(() =>
        {
            Emoticon.ToggleEmoticon();
        });
    }
    
    /**
     * Get emoticon tag
     * @param {String} _Emoticon
     * @return {String}
     */
    static GetEmoticonTag(_Emoticon)
    {
        var Ret = _Emoticon;

        var EmoticonData = {
            Category: '', // Category
            X: 0, // X coordinate
            Y: 0, // Y coordinate
            W: 0, // width
            H: 0, // height
            Alt: '' // description
        };

        var Found = false;

        // find correspondended emoticon from manifest.json
        for( var Category in this.BeamEmoticons )
        {
            var Contents = this.BeamEmoticons[Category];
            for( var Emoticon in Contents.emoticons )
            {
                // if emoticon found
                if( _Emoticon == Emoticon )
                {
                    var Data = Contents.emoticons[Emoticon];
                    EmoticonData.Category = Category;
                    EmoticonData.X = Data.x;
                    EmoticonData.Y = Data.y;
                    EmoticonData.W = Data.width;
                    EmoticonData.H = Data.height;
                    EmoticonData.Alt = Data.alt.en;
                    Found = true;
                    break;
                }
            }

            // if found exit loop
            if( Found )
            {
                break;
            }
        }

        // if corresponded emoticon found, generate emoticon tag
        if( Found )
        {
            var ImageURL = 'https://beam.pro/_latest/emoticons/' + EmoticonData.Category + '.png'

            var Tag =
            [
                '<div class="Emoticon" style="width: ' + EmoticonData.W + 'px; height: ' + EmoticonData.H + 'px;">',
                '<img src="' + ImageURL + '" style="transform: translate(-' + EmoticonData.X + 'px, -' + EmoticonData.Y + 'px);" alt="' + EmoticonData.Alt + '" />',
                '</div>',
            ].join("");

            Ret = Tag;
        }

        return Ret;
    }

    /**
     * Load Emoticon png files to cache
     */
    static LoadEmoticonImages()
    {
        for( var Category in this.BeamEmoticons)
        {
            var img = new Image();
            img.src = 'https://beam.pro/_latest/emoticons/' + Category + '.png';
            this.BeamEmoticons[Category].image = img;
        }
    }

    /**
     * Generate Emoticon HTML
     */
    static GenerateEmoticonHtml()
    {
        var MAX_ICONS_IN_A_ROW = 7; // max icons in a row
        var icon_num = 0;

        for( var Category in Emoticon.BeamEmoticons )
        {    
            var Contents = Emoticon.BeamEmoticons[Category];
            var LastClassName = ''; // to ignore same icons

            for( var emoticon in Contents.emoticons )
            {
                var Data = Contents.emoticons[emoticon];
                var ClassName = Emoticon.GetClassName(Data.alt.en);
                if( ClassName != LastClassName )
                {
                    if(icon_num % MAX_ICONS_IN_A_ROW == 0)
                    {
                        $('#Emoticon').append('<div class="icon_row"></div>');
                    }

                    var canvas = $('<div><canvas width="24" height="24"></canvas></div>');
                    canvas.attr({
                        "class": "tooltipped icon_" + ClassName,
                        "data-position": "top",
                        "data-delay": 200,
                        "data-tooltip": emoticon,
                        "data-image": [Category, Data.x, Data.y, Data.width, Data.height].join(',')
                    })
                    $('#Emoticon .icon_row').eq( Math.floor(icon_num / MAX_ICONS_IN_A_ROW) ).append( canvas );

                    var c = $('.icon_' + ClassName + ' > canvas')[0];
                    var ctx = c.getContext('2d');
                    ctx.drawImage(Contents.image, Data.x, Data.y, Data.width, Data.height, 0, 0, Data.width, Data.height);
            
                    $('.icon_' + ClassName).click((e) =>
                    {
                        var Icon = $(e.currentTarget).clone(true);
                        Icon.off('click')
                            .removeClass('tooltipped')
                            .tooltip('remove');
                            

                        SendCommentArea.PutIcon(Icon);
                        
                        Emoticon.ToggleEmoticon();
                    });
                    icon_num++;
                    LastClassName = ClassName;
                }
            }
        }
        $('.tooltipped').tooltip();
    }

    /**
     * Get ID name from alt.en
     * @access public
     * @param {String} str alt.en
     * @return {String}
     */
    static GetClassName(str)
    {
        var code = str.codePointAt(0);
        if( code >= 128512 && code <= 128591)
        {
            return code.toString(16);
        }
        
        return str.replace(/ /g, '_');
    }

    /**
     * Toggle Emoticon list on/off
     */
    static ToggleEmoticon()
    {
        $("#Emoticon").toggle();
    }
}