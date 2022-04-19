# <img src="assets/image.png" alt="drawing" style="width:24px;"/> LittleBigMouse Manager

Are you facing issues while using borderless fullscreen applications with LittleBigMouse ?

Do you have to Alt+Tab to disable it every time you want to play games ?

This is a third-party tool for [LittleBigMouse](https://github.com/mgth/LittleBigMouse) that gives the possibility to enable or disable the LBM daemon depending on the active window.

## Installation

### Basic

- Go to the [releases](https://github.com/VinceBT/LBMM/releases) page and download the latest release's `LBMM.zip` and extract it to your favorite location
- Double-click the `LBMM_run.vbs` script, now you should have a new icon inside taskbar notification area
- When focusing a window that is specified in the settings, the LBM icon should turn grey and turn back green when focusing a regular one, like this
  ![eZmF3Np9Co](https://user-images.githubusercontent.com/1362505/151820434-05772094-632d-4884-8828-8f4b275ebee4.gif)

You can edit the `settings.json` to add a program of your choice (you just need to specify the game executable), or to adjust some other settings.
Every change will apply instantly.

### Automatic

The first time you will run the program, it will create a shortcut inside `%AppData%\Microsoft\Windows\Start Menu\Programs\Startup\` so it can launch itself automatically at startup, you can disable it in the settings.

## Settings

All these settings can be changed inside `settings.json`, they will be applied instantly.

- `daemon`: Where the LittleBigMouse_Daemon.exe file is located on your system
- `interval`: The interval in milliseconds between each time the process will check the name of your current focused window, default is 1000ms
- `debounce`: The debounced time before turning on/off LBM when Alt+Tab-ing from a blacklisted application, default is 10000ms
- `startup`: If this program should launch at Windows startup, default is true
- `blacklist`: The list of programs that should turn OFF LBM, feel free to add your own

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
