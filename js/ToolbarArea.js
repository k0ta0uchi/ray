class ToolbarArea
{
    static Init()
    {
        // Blur timer
        this.BlurTimeout;

        // Register all events
        this.RegisterEvent();

        if( Settings.AutoConnect )
        {
        }
    }

    /**
     * Register Events
     */
    static RegisterEvent()
    {
        $('#ConnectButton')
            .click(() =>
            {
                clearTimeout( this.BlurTimeout );
                this.Connect();
            });

        $('#ChannelInput').focus(() =>
        {
            BeamManager.PauseInterval();
            $('#ConnectButton')
                .text('power')
                .removeClass('loading')
                .off('click')
                .click(() =>
                {
                    clearTimeout( this.BlurTimeout );
                    this.Connect();
                });
        });

        $('#ChannelInput').blur(() =>
        {
            this.BlurTimeout = setTimeout(() =>
            { $('#ConnectButton')
                .text('do_not_disturb')
                .off('click')
                .click(() =>
                {
                    this.Disconnect();
                });
            }, 200);
            BeamManager.ResumeInterval();
        });
    }

    /**
     * Connect to channel
     */
    static Connect()
    {
        Menubar.ConnectChannel();
    }

    /**
     * On loading
     */
    static Loading()
    {
        $('#ConnectButton')
            .text('sync')
            .addClass('loading')
            .off('click');
    }

    /**
     * On connected
     */
    static Connected()
    {
        $('#ConnectButton')
            .text('do_not_disturb')
            .removeClass('loading')
            .click(() =>
            {
                this.Disconnect();
            })
        BeamManager.GetChannelInformation( Settings.UserName );
    }

    /**
     * Disconnect channel;
     */
    static Disconnect()
    {
        $('#ConnectButton')
            .text('power')
            .off('click')
            .click(() =>
            {
                this.Connect();
            })
        Menubar.DisconnectChannel();
    }

    /**
     * Update channel information
     * @param {Object} data
     */
    static UpdateInformation( data )
    {
        $('#ChannelInput').val( data.User.Name + ' / ' + data.Title );
    }

    /**
     * If Error occur on connect
     */
    static ErrorOnConnect()
    {
        $('#ConnectButton')
            .text('power')
            .off('click')
            .removeClass('loading')
            .click(() =>
            {
                this.Connect();
            });
    }
}