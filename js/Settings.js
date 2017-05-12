class Settings
{
    static Init()
    {
        var fs = require("fs");
        this.settingsWindow;

        this.Defaults = 
        {
            UserName:   "",
            Password:   "",
            AutoConnect: false,
            AlwaysOnTop: false,
            ShowWhisper: false,
            CallWhisper: false,
            CallBouyomiChan: false,
            BouyomiChanLocation: '',
            CallUserName: 0,
            MaxDisplayComment: 100,
            CheckUpdate: true,
            Language:   "EN",
            i18n: JSON.parse(fs.readFileSync("./i18n/EN.json", "utf8"))
        }

        this.CALL_USER_NAME_OFF = 0;
        this.CALL_USER_NAME_BEFORE = 1;
        this.CALL_USER_NAME_AFTER = 2;
        this.RemoteTalkRelativePath = 'RemoteTalk\\RemoteTalk.exe';
        this.LanguageList = Settings.GetLanguageList();

        this.Load();

        Menubar.CheckboxUpdate();

        var win = nw.Window.get();
        win.setAlwaysOnTop( this.AlwaysOnTop );
    }

    /**
     * Save settings.
     */
    static Save()
    {
        var t = this;
        var ls = localStorage;
        var un = undefined;
        var st = JSON.stringify;

        if( t.UserName != un ) { ls.UserName = st( t.UserName ); }
        if( t.Password != un ) { ls.Password = st( Common.Encrypt( t.Password) ); }
        if( t.AutoConnect != un ) { ls.AutoConnect = st( t.AutoConnect ); }
        if( t.AlwaysOnTop != un ) { ls.AlwaysOnTop = st( t.AlwaysOnTop ); }
        if( t.ShowWhisper != un ) { ls.ShowWhisper= st(t.ShowWhisper); }
        if( t.CallWhisper != un ) { ls.CallWhisper= st(t.CallWhisper); }
        if( t.CallBouyomiChan != un ) { ls.CallBouyomiChan = st(t.CallBouyomiChan); }
        if( t.BouyomiChanLocation != un ) { ls.BouyomiChanLocation = st(t.BouyomiChanLocation); }
        if( t.CallUserName != un ) { ls.CallUserName = st(t.CallUserName); }
        if( t.MaxDisplayComment	!= un ) { ls.MaxDisplayComment = st(t.MaxDisplayComment); }
        if( t.Language != un ) { ls.Language = st( t.Language ); }
        if( t.i18n != un ) { ls.i18n = st( t.i18n ); }
    }

    /**
     * Load settings.
     */
    static Load()
    {
        var t = this;
        var ls = localStorage;
        var un = undefined;
        var p = JSON.parse;

        t.UserName = ls.UserName != un ? p( ls.UserName ) : t.Defaults.UserName;
        t.Password = ls.Password != un ? Common.Decrypt( p( ls.Password ) ) : t.Defaults.Password;
        t.AutoConnect = ls.AutoConnect != un ? p( ls.AutoConnect ) : t.Defaults.AutoConnect;
        t.AlwaysOnTop = ls.AlwaysOnTop != un ? p( ls.AlwaysOnTop ) : t.Defaults.AlwaysOnTop;
        t.ShowWhisper = ls.ShowWhisper != un ? p(ls.ShowWhisper) : t.Defaults.ShowWhisper;
        t.CallWhisper = ls.CallWhisper != un ? p(ls.CallWhisper) : t.Defaults.CallWhisper;
        t.CallBouyomiChan = ls.CallBouyomiChan != un ? p(ls.CallBouyomiChan) : t.Defaults.CallBouyomiChan;
        t.BouyomiChanLocation = ls.BouyomiChanLocation != un ? p(ls.BouyomiChanLocation) : t.Defaults.BouyomiChanLocation;
        t.CallUserName = ls.CallUserName != un ? p(ls.CallUserName) : t.Defaults.CallUserName;
        t.MaxDisplayComment = ls.MaxDisplayComment != un ? p(ls.MaxDisplayComment) : t.Defaults.MaxDisplayComment;
        t.Language = ls.Language != un ? p( ls.Language ) : t.Defaults.Language;
        t.i18n = ls.i18n != un ? p( ls.i18n ) : t.Defaults.i18n;
    }

    /**
     * Open settings window
     */
    static Open()
    {
        var currentWin = nw.Window.get();

        nw.Window.open('./settings.html', (settingsWin) => {
            // initial window height
            settingsWin.height = 480;
            // set to not resize setting window
            settingsWin.setResizable(false);
            
            // set if always on top setting on
            if( Settings.AlwaysOnTop ) { settingsWin.setAlwaysOnTop(true); }

            // set this to not able to click main window
            currentWin.on('focus', () => {
                settingsWin.focus();
            });

            // remove all listeners and exit
            settingsWin.on('closed', () => {
                Settings.Save();
                currentWin.focus();
                currentWin.removeAllListeners('focus');
                
                settingsWin.hide();
                settingsWin = null;
            });

            // add events when loaded
            settingsWin.window.onload = (e) => { Settings.AddEvents(e); }

            this.settingsWindow = settingsWin;
            
        });
    }

    /**
     * add events to settings view gui.
     * @param {Object} e for event when settings view is open 
     */
    static AddEvents(e)
    {
        var win = e.currentTarget;
        var $ = win.$;

        $("ul.tabs").tabs();

        I18n.UpdateSettingsStrings(win);

        // Sync with settings
        $('#UserNameInput').val(Settings.UserName);
        $('#PasswordInput').val(Settings.Password);
        $('#AutoConnectCheckbox').prop('checked', Settings.AutoConnect);
        $('#ShowWhisperCheckbox').prop('checked', Settings.ShowWhisper);
        $('#CallWhisperCheckbox').prop('checked', Settings.CallWhisper);
        $('#CallBouyomiChanCheckbox').prop('checked', Settings.CallBouyomiChan);
        $('#BouyomiChanLocationInput').val(Settings.BouyomiChanLocation);
        $('[name=CallUserNameRadio]').val([Settings.CallUserName]);
        $('#MaxDisplayCommentInput').val(Settings.MaxDisplayComment);
        $('#CheckUpdateCheckbox').prop('checked', Settings.CheckUpdate);

        // if OK pressed, save properties to Settings
        $('#OKButton').click(() =>
        {
            Settings.UserName = $('#UserNameInput').val();
            Settings.Password = $('#PasswordInput').val();
            Settings.AutoConnect = $('#AutoConnectCheckbox').prop('checked');
            Settings.ShowWhisper = $('#ShowWhisperCheckbox').prop('checked');
            Settings.CallWhisper = $('#CallWhisperCheckbox').prop('checked');
            Settings.CallBouyomiChan= $('#CallBouyomiChanCheckbox').prop('checked');
            Settings.BouyomiChanLocation= $('#BouyomiChanLocationInput').val();
            Settings.CallUserName = $('[name=CallUserNameRadio]:checked').val();
            Settings.MaxDisplayComment= $('#MaxDisplayCommentInput').val();
            Settings.CheckUpdate = $('#CheckUpdateCheckbox').prop('checked');
            // update the menubar
            Menubar.CheckboxUpdate();
            // remove exceeded comment
            CommentArea.RemoveExceedComment();
            // update login status
            setTimeout(() => StatusArea.LoginCheck(), 10);

            // close settings view
            win.close();
        });

        // close settings view if cancel button pressed
        $('#CancelButton').click(() =>
        {
            win.close();
        });

        // setting button of Bouyomichan pressed
        $('#BouyomiChanLocationInput').click(() =>
        {
            $('#BouyomiChanLocationFile').click();
        });
        // path for Bouyomichan set
        $('#BouyomiChanLocationFile').change(() =>
        {
            // get directory from targeted exe file
            var FilePath = $('#BouyomiChanLocationFile').val();
            var FileDir = Common.FullPath2Dir(FilePath);
            // if file selected
            if( FilePath != '')
            {
                // check if remotetalk available in the directory
                var RemoteTalkExists = FileDir+'\\'+Settings.RemoteTalkRelativePath
                if( Common.Exist(RemoteTalkExists) )
                {
                    $('#BouyomiChanLocationInput').val(FilePath);
                }
                else
                {
                    $('#BouyomiChanLocationFile').val('');
                    alert( Settings.i18n.Settings.NoRemoteTalk );
                }
            }
        });

        this.LanguageList.forEach((l, index, array) => {
            $("#Language select").append('<option value="' + l.Code + '">' + l.Name + '</option>');
        });

        $("#Language select").change(() => {
            var fs = require('fs');
            var code = $("#Language select").val();
            Settings.Language = code;
            Settings.i18n = JSON.parse(fs.readFileSync("./i18n/" + code + ".json", "utf8"));

            I18n.UpdateStrings();
        });

        $("#Language select").val( Settings.Language );

        $('select').material_select();

        // ignore some keys on MaxDisplayComment
        $('#MaxDisplayCommentInput').keydown((e) =>
        {
            // ignore keys other than specific keys
            var k = e.keyCode;
            if
            (
                !(k >= 37 && k <= 40) &&
                // arrow keys
                !(k == 8) &&
                // BackSpace
                !(k == 46) &&
                // Delete
                !(k >= 48 && k <= 57) &&
                // 0-9
                !(k >= 96 && k <= 105)
                // ten keys 0-9
            )
            {
                return false;
            }
        });
        $('#MaxDisplayCommentInput').on('input', () =>
        {
            // Adjust number of digits to fit in MaxLength
            if ($(this).val().length > $(this).attr('maxlength'))
            {
                $(this).val($(this).val().slice(0, $(this).attr('maxlength')));
            }
            // restore within allowable numerical value
            var Min = parseInt($(this).attr('min'));
            var Max = parseInt($(this).attr('max'));
            var Value = parseInt($(this).val());
            Value = Math.min(Max, Math.max(Min, Value));
            $(this).val(Value);
            // restore with 0 when deleted whole
            var Value = parseInt($(this).val());
            if( $(this).val().length <= 0 )
            {
                $(this).val(0);
            }
        });
    }

    /**
     * Get language list
     * @return {Object} language list
     */
    static GetLanguageList()
    {
        var fs = require('fs');
        var ll = new Array();

        var list = fs.readdirSync('./i18n/');
        try {
            list.forEach((val, index, array) => {
                var temp = JSON.parse(fs.readFileSync('./i18n/' + val));
                var l = {
                    "Code": temp.Meta.Code,
                    "Name": temp.Meta.Name
                };
                ll.push(l);
            });
        }
        catch (err) {
            console.error(err);
        }
        
        console.log(ll);
        return ll;
    }
}