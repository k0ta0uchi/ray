class BeamManager
{
    static Init()
    {
        const Beam = require('beam-client-node');

        this.Socket;
        this.InformationPolling;
        this.ChannelName;
        this.Client = new Beam();
        this.s = Settings.i18n;
        this.INFORMATION_POLLING_INTERVAL = 3000;
    }

    /**
     * Connect to channel and get socket.
     * @param {String} _UserName 
     * @param {String} _Password 
     * @param {String} _ChannelName 
     */
    static Connect(_UserName, _Password, _ChannelName)
    {
        const BeamSocket = require('beam-client-node/lib/ws');

        if( this.Socket != undefined )
        {
            if( this.Socket.isConnected() )
            {
                this.Socket.close();
            }
        }

        let userInfo;
        let ChannelId;
        let ChannelName;
        if( typeof _ChannelName == 'string' && _ChannelName.length > 0 )
        {
            ChannelName = _ChannelName;
        }
        else
        {
            ChannelName = Settings.UserName;
        }

        if( Settings.Language == 'EN' )
        {
            CommentArea.SystemMessage(this.s.SystemMessage.ConnectingTo + ChannelName);
        }
        else
        {
            CommentArea.SystemMessage(ChannelName + this.s.SystemMessage.ConnectingTo);
        }
        
        this.Client.request('GET', 'channels/' + ChannelName)
        .then(res => {
            ChannelId = res.body.id;

            if( ChannelId == undefined )
            {
                Menubar.ConnectButton.enabled = true;
                ToolbarArea.ErrorOnConnect();
                CommentArea.SystemMessage(this.s.ErrorMessage.ChannelNotFound);

                this.Error(this.s.ErrorMessage.ChannelNotFound);
                throw new Error(ErrorMessage);
            } else {
                // console.log('The ID from '+ChannelName+' is '+ChannelId);
                
                this.Client.use('password', {
                    username: _UserName,
                    password: _Password,
                })
                .attempt()
                .then(res => {
                    userInfo = res.body;

                    return this.Client.chat.join(ChannelId);
                })
                .then(res => {
                    const body = res.body;
                    this.Socket = this.CreateChatSocket(userInfo.id, ChannelId, body.endpoints, body.authkey, ChannelName);

                    this.InformationPolling = setInterval(() => { BeamManager.GetChannelInformation(ChannelName); }, this.INFORMATION_POLLING_INTERVAL);

                    this.ChannelName = ChannelName;

                    return this.Socket;
                })
                .catch(err => {
                    Menubar.ConnectButton.enabled = true;

                    this.Error(err.message.statusMessage, error.message.statusCode);
                });
            }
        })
        .catch(err => {
            Menubar.ConnectButton.enabled = true;
            this.Error(err.message.statusMessage, error.message.statusCode);
        });
    }

    /**
     * Disconnect channel.
     */
    static Disconnect()
    {
        if( this.Socket != undefined )
        {
            if( this.Socket.isConnected() )
            {
                this.Socket.close();

                clearInterval(this.InformationPolling);
                this.InformationPolling = null;
                InformationArea.ClearInformation();

                CommentArea.SystemMessage(this.s.SystemMessage.Disconnected);
            }
        }
    }

    static PauseInterval()
    {
        clearInterval( this.InformationPolling );
    }

    static ResumeInterval()
    {
        this.InformationPolling = setInterval(() => { BeamManager.GetChannelInformation(this.ChannelName); }, this.INFORMATION_POLLING_INTERVAL);
    }

    /**
     * Login check with user set User Name and Password
     * @param {String} _UserName 
     * @param {String} _Password 
     */
    static LoginCheck(_UserName, _Password)
    {
        const st = JSON.stringify;
        this.Client.use('password', {
            username: _UserName,
            password: _Password,
        })
        .attempt()
        .then(res => {
            if( _UserName.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) )
            {
                Settings.UserName = res.body.username;
                localStorage.UserName = st( res.body.username );
            }
            StatusArea.UpdateLoginStatus(this.s.Status.LoggedInAs + res.body.username);
        })
        .catch(err =>{
            StatusArea.UpdateLoginStatus(this.s.ErrorMessage.StatusError, err);
        });
    }

    /**
     * Put error message and error code.
     * @param {String} ErrorMessage 
     * @param {Integer} ErrorCode 
     */
    static Error(ErrorMessage, ErrorCode)
    {
        // console.log(ErrorMessage);
        
        if( this.Socket != undefind )
        {
            if( this.Socket.isConnected() )
            {
                this.Socket.close();
            }
        }
    }

    /**
     * Create socket connecting to beam service.
     * @param {String} userId 
     * @param {String} channelId 
     * @param {Array} endpoints 
     * @param {String} authkey 
     * @param {String} channelName 
     */
    static CreateChatSocket(userId, channelId, endpoints, authkey, channelName)
    {
        const BeamSocket = require('beam-client-node/lib/ws');
        const socket = new BeamSocket(endpoints).boot();

        socket.auth(channelId, userId, authkey)
        .then(() =>{
            // console.log(this.Client);
            Menubar.DisconnectButton.enabled = true;
            ToolbarArea.Connected();
            
            CommentArea.SystemMessage(this.s.SystemMessage.ConnectedSuccessfully);

            this.ChatEvent();

            return;
        })
        .catch(err => {
            this.Error(err.message.statusMessage, err.message.statusCode);
        })
        return socket;
    }

    /**
     * Register chat events.
     */
    static ChatEvent()
    {
        this.Socket.on('ChatMessage', _data => {
            // console.log(_data);

            const IsWhisper = _data.message.meta.whisper;
            
            const Data = CommentArea.Format(_data);
            if( !IsWhisper || ( IsWhisper && Settings.PutWhisper ) )
            {
                CommentArea.PutComment(Data);
            }

            if( Settings.CallBouyomiChan )
            {
                if( !IsWhisper || ( IsWhisper && Setting.CallWhisper ) )
                {
                    const CallMessage = BouyomiChanManager.Format(_data);
                    BouyomiChanManager.Call( CallMessage );
                }
            }
        })
    }

    /**
     * Get channel information and update information area
     * @param {String} channelName 
     */
    static GetChannelInformation(channelName)
    {
        this.Client.request( 'GET', 'channels/' + channelName)
        .then( res => {
            const b = res.body;
            const data = {
                'Title': b.name,
                'ViewersCurrent': b.viewersCurrent,
                'ViewersTotal': b.viewersTotal,
                'User': {
                    'Id': b.user.id,
                    'Level': b.user.level,
                    'Name': b.user.username,
                    'Thumnail': b.user.avatarUrl
                }
            };
            console.log(data);
            ToolbarArea.UpdateInformation(data);
            InformationArea.UpdateInformation(data);
        });
    }

    /**
     * Send comment
     * @param {String} Message 
     */
   	static SendComment(Message)
    {
        if( this.Socket != undefined )
        {
            if( this.Socket.isConnected() )
            {
                this.Socket.call('msg', [Message]);
            }
        }
    };
}