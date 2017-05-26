class I18n
{
    static Init()
    {
        
    }

    /**
     * Update all strings in application
     */
    static UpdateStrings()
    {
        var s = Settings.i18n;
        var settingsWindow = Settings.settingsWindow;
        
        // add placeholder string
        $('.InputComment:first').attr({ 'Placeholder': s.SendComment.Placeholder });

        // add header strings 
        $("#Header .UserName span").text( s.Header.UserName );
        $("#Header .Time span").text( s.Header.Time );
        $("#Header .Comment span").text( s.Header.Comment );

        Menubar.Init();
        InformationArea.Init();

        if( settingsWindow )
        {
            I18n.UpdateSettingsStrings( settingsWindow.window );
        }
    }

    /**
     * Update all strings in settings window
     * @param {Object} win settings window 
     */
    static UpdateSettingsStrings(win)
    {
        var s = Settings.i18n.Settings;
        var $ = win.$;
    
        // Tabs
        $("ul.tabs li:first-child a").text( s.Tabs.Tab1 );
        $("ul.tabs li:nth-child(2) a").text( s.Tabs.Tab2 );
        $("ul.tabs li:nth-child(3) a").text( s.Tabs.Tab3 );

        // Mixer account related
        $("#MixerAccount legend").text( s.MixerAccount.Legend );
        $("#UserNameInput").attr({placeholder: s.MixerAccount.UserNamePlaceholder});
        $("#PasswordInput").attr({placeholder: s.MixerAccount.PasswordPlaceholder});
        $("#AutoConnect label").text( s.MixerAccount.AutoConnect );

        // Whisper related
        $('#Whisper legend').text( s.Whisper.Legend );
        $('#ShowWhisper label').text( s.Whisper.ShowWhisper );
        $('#CallWhisper label').text( s.Whisper.CallWhisper );

        // Language related
        $('#Language legend').text( s.Language );

        // Bouyomichan related
        $('#BouyomiChan legend').text( s.BouyomiChan.Legend );
        $('#CallBouyomiChan label').text( s.BouyomiChan.EnableLink );
        $('#BouyomiChanLocationFileText').text( s.BouyomiChan.File );
        $('#BouyomiChanLocationInput').attr({placeholder: s.BouyomiChan.Location });
        $('#CallUserNameRadio legend').text( s.BouyomiChan.CallUserName.Legend );
        $('#CallUserNameOff label').text( s.BouyomiChan.CallUserName.Off );
        $('#CallUserNameBefore label').text( s.BouyomiChan.CallUserName.Before );
        $('#CallUserNameAfter label').text( s.BouyomiChan.CallUserName.After );

        // Other
        $('#Other legend').text( s.Other.Legend );
        $('#MaxDisplayComment span:first').text( s.Other.MaxDisplayComment );
        $('#MaxDisplayComment span:last').text( s.Other.AltDescription );
        $('#CheckUpdate label').text( s.Other.CheckUpdate );
    }
}