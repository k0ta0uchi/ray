class BouyomiChanManager
{
    static Init()
    {
        this.Exec = require('child_process').exec;
    }

    /**
     * Call BouyomiChan to be read out
     * @param {Object} Message 
     */
    static Call(Message)
    {
        const BouyomiChan = Settings.BouyomiChanLocation;
        const BouyomiDir = Common.FullPath2Dir( BouyomiChan );
        const RemoteTalk = BouyomiDir + '\\' + Settings.RemoteTalkRelativePath;

        if( Common.Exist(RemoteTalk) )
        {
            this.Exec('"' + RemoteTalk + '"' + ' /talk ' + '"' + Message + '"' );
        }
    }

    /**
     * Format Data message whether read User Name or not
     * @param {Object} Data 
     * @return {String}
     */
    static Format(Data)
    {
        var Ret = '';

        if( Settings.CallUserName == Settings.CALL_USER_NAME_BEFORE )
        {
            Ret += Data.user_name + ' ';
        }

        for( const id in Data.message.message )
        {
            const mes = Data.message.message[id];
            if( mes.type == 'text' || mes.type == 'link' || mes.type == 'tag' )
            {
                Ret += mes.text;
            }
        }

        if( Settings.CallUserName == Settings.CALL_USER_NAME_AFTER )
        {
            Ret += ' ' + Data.user_name;
        }

        return Ret;
    }
}