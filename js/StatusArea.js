class StatusArea
{
    static Init()
    {
        this.s = Settings.i18n;
        
        // login check interval in ms
        this.LOGIN_CHECK_INTERVAL = 6000;
        
        // set interval for periodic login check
        setInterval(StatusArea.LoginCheck(), this.LOGIN_CHECK_INTERVAL);
    }

    /**
     * Login check
     */
    static LoginCheck()
    {
        $('#Login span').replaceWith('<span>' + this.s.Status.CheckUser + '</span>');
        if( Settings.UserName )
        {
            BeamManager.LoginCheck( Settings.UserName, Settings.Password );
        }
        else
        {
            $('#Login span').replaceWith('<span class="Error">' + this.s.Status.NoUser + '</span>');
        }
    }

    /**
     * Update login status message
     * @param {String} Message 
     * @param {String} Err optional 
     */
    static UpdateLoginStatus(Message, Err)
    {
        if( Err )
        {
            Message = '<span class="Error">' + Message + Err.message.statusMessage + '</span>';
        }
        else
        {
            Message = '<span>' + Message + '</span>';
        }
        $('#Login span').replaceWith(Message);
    }
}