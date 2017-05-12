/**
 * Event when window loaded.
 */
window.onload = () =>
{
    var win = nw.Window.get();

    // default window size
    win.height = 640;
    win.width = 640;

    I18n.UpdateStrings();

    if( Settings.AutoConnect )
    {
        setTimeout(() => { Menubar.ConnectMyChannel(); }, 200);
    }
}

window.onunload = () => 
{
    Settings.Save();
}