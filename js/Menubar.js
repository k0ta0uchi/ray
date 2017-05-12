class Menubar
{
    static Init()
    {
        var Gui = require('nw.gui');
        var Separator = new Gui.MenuItem({type: 'separator'});

        // short for i18n strings
        var s = Settings.i18n.Menu;
        
        this.ConnectMyButton = new Gui.MenuItem(
        {
            label: s.File.ConnectMyChannel,
            click: () => { Menubar.ConnectMyChannel(); }
        });
        this.ConnectButton = new Gui.MenuItem(
        {
            label: s.File.ConnectChannel,
            click: () => { Menubar.ConnectChannel(); }
        });
        this.DisconnectButton = new Gui.MenuItem(
        {
            label: s.File.DisconnectChannel,
            click: () => { Menubar.DisconnectChannel(); },
            enabled: false
        });
        this.ExitButton = new Gui.MenuItem(
        {
            label: s.File.Exit,
            click: () => { Menubar.Exit(); }
        });

        this.AlwaysOnTopButton = new Gui.MenuItem(
        {
            type: 'checkbox',
            label: s.Settings.AlwaysOnTop,
            click: () => { Menubar.ToggleAlwaysOnTop(); },
            checked: Settings.AlwaysOnTop ? true : false
        });
        this.SettingButton = new Gui.MenuItem(
        {
            label: s.Settings.Setting,
            click: () => { Menubar.OpenSettings(); }
        });
        
        this.File = new Gui.Menu();
        this.File.append(this.ConnectMyButton);
        this.File.append(this.ConnectButton);
        this.File.append(this.DisconnectButton);
        this.File.append(Separator);
        this.File.append(this.ExitButton);

        this.Settings = new Gui.Menu();
        this.Settings.append(this.AlwaysOnTopButton);
        this.Settings.append(this.SettingButton);

        this.Menus = new Gui.Menu({type: 'menubar'});
        this.Menus.append(new Gui.MenuItem({ label: s.File.File, submenu: this.File}));
        this.Menus.append(new Gui.MenuItem({ label: s.Settings.Setting, submenu: this.Settings}));

        Gui.Window.get().menu = this.Menus;
    }

    /**
     * Open settings menu.
     */
    static OpenSettings()
    {
        Settings.Open();
    }

    /**
     * Connect to my channel.
     * @return {Boolean}
     */
    static ConnectMyChannel()
    {
        if( Settings.UserName.length < 1 || Settings.Password.length < 1 )
        {
            alert(this.s.Status.NoUser);
        }
        else
        {
            // Menubar.ConnectButton.enabled = false;
            ToolbarArea.Loading();

            BeamManager.Disconnect();
            BeamManager.Connect( Settings.UserName, Settings.Password, Settings.UserName );
        }
    }

    /**
     * Connect to specific channel.
     * @return {Boolean}
     * @param {String}
     */
    static ConnectChannel()
    {
        if( Settings.UserName.length < 1 || Settings.Password.length < 1 )
        {
            alert(this.s.Status.NoUser);
        }
        else
        {
            // Menubar.ConnectButton.enabled = false;
            ToolbarArea.Loading();

            const ChannelName = this.GetChannelName($('#ChannelInput').val());

            BeamManager.Disconnect();
            
            try
            {
                BeamManager.Connect( Settings.UserName, Settings.Password, ChannelName );
            }
            catch (e)
            {
                console.log("aaaaaa");
                throw new Error(e);
            }
        }
    }

    static GetChannelName( str )
    {
        return str.split(' ')[0];
    }

    /**
     * Disconnect channel.
     */
    static DisconnectChannel()
    {
        Menubar.ConnectButton.enabled = true;
        Menubar.DisconnectButton.enabled = false;

        BeamManager.Disconnect();
    }

    /**
     * Exit windows.
     */
    static Exit()
    {
        Common.Exit();
    }

    static ToggleAlwaysOnTop()
    {
        var win = nw.Window.get();
        var flag = this.AlwaysOnTopButton.checked;
        Settings.AlwaysOnTop = flag;
        win.setAlwaysOnTop(flag);
    }

    static CheckboxUpdate()
    {
        // this.AlwaysOnTopButton.checked = Settings.AlwaysOnTop;
        // this.CallBouyomiChanButton.checked = Setting.CallBouyomiChan;
    }
}