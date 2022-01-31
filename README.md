# LittleBigMouse Manager

Are you facing issues while using borderless fullscreen applications with LittleBigMouse ?

Do you have to Alt+Tab to disable it every time you want to play games ?

This is a third-party tool for [LittleBigMouse](https://github.com/mgth/LittleBigMouse) that gives the possibility to enable or disable the LBM daemon depending on the active window.

## Installation

### Basic
- Go to the [releases](https://github.com/VinceBT/LBMM/releases) page and download the latest release's `LBMM.zip` and extract it to your favorite location
- Double-click the `LBMM.vbs` script, now you should have a running `Node.js Javascript Runtime` process inside Task Manager
- When focusing a window that is specified in the settings, the LBM icon should turn grey and turn back green when focusing a regular one, like this
  ![eZmF3Np9Co](https://user-images.githubusercontent.com/1362505/151820434-05772094-632d-4884-8828-8f4b275ebee4.gif)

You can edit the `settings.json` to add a program of your choice (you just need to specify the game executable), or to adjust some other settings.
Just remember to kill the `Node.js Javascript Runtime` process and run again the `LBMM.vbs` script.

### Automatic
If you want to make it run automatically on every startup (this method is from [this article](https://keestalkstech.com/2016/07/start-nodejs-app-windowless-windows/#vbs-to-the-rescue)).

- Make sure you followed the Basic steps first
- Open Explorer and paste `%AppData%\Microsoft\Windows\Start Menu\Programs\Startup\` into the address bar, like this
![image](https://user-images.githubusercontent.com/1362505/151819930-d2028edb-c6f0-422a-b3a1-2631f6d2fccb.png)
- Create a new shortcut and point it to the `LBMM.vbs` file inside the LBMM folder
- Next time your computer will start, it should run automatically

## Settings

All these settings can be changed inside `settings.json`, you will have to kill the Node process and restart it apply the changes.

- `daemon`: Where the LittleBigMouse_Daemon.exe file is located on your system
- `arguments`: Arguments passed to the daemon to turn it on or off, you should not have to touch this
- `programs`: The list of programs that should turn OFF LittleBigMouse, feel free to add your own
- `default`: If LBM is enabled by default on your computer, default is true
- `interval`: The interval in milliseconds between each time the process will check the name of your current focused window, default is 500ms

## Dependencies

https://github.com/mgth/LittleBigMouse

## Development

Feel free to create a PR, I know this program is not optimal and could be improved:

- Use NVM or Node 14
- Install dependencies with `npm install`
- Run in development mode with `npm run dev`

## Supports

Windows 10 (11 to be confirmed)

## Donation

Feel free to buy me a coffee :)

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/donate/?hosted_button_id=KKDV8JRNNRDAN)
