class InformationArea
{
    static Init()
    {
        this.s = Settings.i18n.Information;
    }

    /**
     * Update information area.
     * @param {Object} data including user datas and channel information. 
     */
    static UpdateInformation(data)
    {
        var Data = [
            '<div id="InformationArea">',
            '   <div class="Row">',
            '       <div class="Icon">',
            '           <span><img src="' + data.User.Thumnail + '"></span>',
            '       </div>',
            '       <div class="Col">',
            '           <div class="Title"><div>' + this.s.Title + '</div><div><span>' + data.Title + '</span></div></div>',
            '           <div class="UserName"><div>' + this.s.UserName + '</div><div><span>' + data.User.Name + '</span></div></div>',
            '           <div class="UserID"><div>' + this.s.UserId + '</div><div><span>' + data.User.Id + '</span></div></div>',
            '           <div class="UserLevel"><div>' + this.s.UserLevel + '</div><div><span>' + data.User.Level + '</span></div></div>',
            '       </div>',
            '       <div class="Col">',
            '           <div class="ViewersCurrnt"><div>' + this.s.ViewersCurrent + '</div><div><span>' + data.ViewersCurrent + '</span></div></div>',
            '           <div class="ViewersTotal"><div>' + this.s.ViewersTotal + '</div><div><span>'  + data.ViewersTotal + '</span></div></div>',
            '       </div>',
            '   </div>',
            '</div>',
        ].join('');

        $('#InformationArea').replaceWith(Data);
    }

    /**
     * Clear information area
     */
    static ClearInformation()
    {
        var Data = [
            '<div id="InformationArea">',
            '    <div class="Row">',
            '        <div class="Icon">',
            '           <span><img src=""></span>',
            '        </div>',
            '        <div class="Col"></div>',
            '    </div>',
            '</div>'
        ].join('');

        $('#InformationArea').replaceWith(Data);
    }
}