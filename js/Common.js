/**
 * Common utility class
 */
class Common
{
    static Init()
    {
        const gui = require('nw.gui');
        const win = gui.Window.get();
        win.on( 'close', () => {
            Common.Exit();
        });
    }

    /**
     * Get avatar image using UserId
     * @access public
     * @param {String} UserId
     * @return {String}
     */
    static GetAvatar(UserId)
    {
        const prefix = '<img src="https://beam.pro/api/v1/users/';
        const suffix = '/avatar">';
        return prefix + UserId + suffix;
    }

    /**
     * Get time now.
     * @access public
     * @return {String}
     */
    static GetTime()
    {
        var date = new Date();
        var H = ('0' + date.getHours()).slice(-2);
        var M = ('0' + date.getMinutes()).slice(-2);
        var S = ('0' + date.getSeconds()).slice(-2);
        return H + ":" + M + ":" + S;
    }

    /**
     * Escape html strings
     * @access public
     * @param {String} string
     * @return {String} 
     */
    static EscapeHtml(string)
    {
        if( typeof string !== 'string' )
        {
            return string;
        }
        return string.replace(/[&'`"<>]/g, function(match)
        {
            return {
                '&': '&amp;',
                "'": '&#x27;',
                '`': '&#x60;',
                '"': '&quot;',
                '<': '&lt;',
                '>': '&gt;',
            }[match]
        });
    }

    /**
     * Extract directry from Fullpath
     * @access public
     * @param {String} FullPath 
     * @return {String}
     */
    static FullPath2Dir(FullPath)
    {
        var FilePath = FullPath.replace(/\//g, '\\');
        var FilePaths = FilePath.split('\\');
        FilePaths.pop();

        return FilePaths.join('\\');
    }

    /**
     * Extract filename from Fullpath
     * @access public
     * @param {String} FullPath
     * @return {String} 
     */
    static FullPath2FileName(FullPath)
    {
        var FilePath = FullPath.replace(/\//g, '\\');
        var FilePaths = FilePath.split('\\');

        return FilePaths.pop();
    }

    /**
     * Exit application
     * @access public
     */
    static Exit()
    {
        // save settings first
        Settings.Save();

        BeamManager.Disconnect();

        var Gui = require('nw.gui');
        Gui.App.closeAllWindows();
        Gui.App.quit();
    }

    /**
     * Check if file exists
     * @access public
     * @param {String} FilePath
     * @return {Boolean} 
     */
    static Exist(FilePath) {
        const fs = require('fs');
        try
        {
            fs.statSync(FilePath);
            return true
        }
        catch(err)
        {
            if(err.code === 'ENOENT')
            {
                return false
            }
        }
    }

    /**
     * Get MAC address
     * @access public
     * @return {String}
     */
    static GetMacAddress()
    {
        const macaddress = require('macaddress');
        const NI = macaddress.networkInterfaces();

        var Result = '';
        for (var i in NI) {
            Result += NI[i].mac;
        }

        return Result;
    }

    /**
     * Encrypt string using MAC address as a seed
     * @access public
     * @param {String} PlainText 
     * @return {String}
     */
    static Encrypt(PlainText)
    {
        const UniqueID = Common.GetMacAddress();
        const crypto = require("crypto");
        var cipher = crypto.createCipher('aes192', UniqueID);

        var Original = '' + PlainText;
        var Encrypted = '';

        Encrypted = cipher.update(Original, 'utf8', 'hex');
        Encrypted += cipher.final('hex');
        return Encrypted;
    }

    /**
     * Decrypt string using MAC address as a seed
     * @access public
     * @param {String} Encrypted 
     * @return {String}
     */
    static Decrypt(Encrypted)
    {
        const UniqueID = Common.GetMacAddress();
        const crypto = require("crypto");
        var decipher = crypto.createDecipher('aes192', UniqueID);

        var Original = '' + Encrypted;
        var Decrypted = '';

        Decrypted = decipher.update(Original, 'hex', 'utf8');
        Decrypted += decipher.final('utf8');
        return Decrypted;
    }

    /**
     * Open link url in default browser.
     * @access public
     * @param {String} url 
     */
    static OpenLink(url)
    {
        const gui = require('nw.gui');
        gui.Shell.openExternal(url);
    }

    /**
     * Exit completely.
     */
    static Exit()
    {
        Settings.Save();

        var gui = require('nw.gui');
        gui.App.closeAllWindows();
        gui.App.quit();
    }
}