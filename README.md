# AQ Classic Launcher
<img src="https://i.imgur.com/hbVZDap.png" width="300" />

A launcher for AdventureQuest Classic including some Quality of Life improvements.

## Features
Feature List:
- Automatically fetches most recent AQ version.
- Tabbed interface: load up several characters at the same time
- Multiscreen support: Open several AQ instances on the same tab
- Character page loader: Input a character ID and press "Go" to open it in new tab.
- Keyboard Shortcuts:
  - F4 to clear cache
  - F5 to refresh
  - Ctrl+F5 to refresh and clear cache
  - F11 toggle full screen
  - Ctrl+Shift+I to open the Developer Console
- Menu icon for various AQ resources that open in a draggable window.
- Change the current tab's server to play on multiple servers or accounts.


Screenshots:
https://imgur.com/a/QrbBoN2

## Architecture
- [Node.js](https://nodejs.org/en/)
- [Electron](https://www.electronjs.org/)
- [electron-tabs](https://github.com/brrd/electron-tabs/)
- [dragula](https://www.npmjs.com/package/dragula)
- [electron-is-dev](https://www.npmjs.com/package/electron-is-dev)
- [electron-packager](https://github.com/electron/electron-packager)

## Building from source
### Install Requirements
  ```shell
  npm install
  ```

### Include Flash Player plugin
  Do note that per the Adobe Flash Player license agreement I can't distribute it, and you are therefore required to include it yourself in the resources folder.
  The most recent Flash version that doesn't include the Killswitch is 32.0.0.371.
  The plugins should be renamed as follows:

  Linux 32-bit:
  ```libpepflashplayer_32.so```

  Linux 64-bit:
  ```libpepflashplayer_64.so```

  Windows 32-bit:
  ```pepflashplayer_32.dll```

  Windows 64-bit:
  ```pepflashplayer_64.dll```

  OS X:
  ```PepperFlashPlayer.plugin```

  ARM Linux:
  ```libpepflashplayer_armv7l.so```

### Package

  #### Windows:
  
  Windows has a script to automatically build for all available platforms:
  
  ```batch
  ./build.bat [version]
  ```
  
  **For example**:
  ```batch
  ./build.bat 1.4.4
  ```
  
  Otherwise run the same command as Linux for manually building for each platform.
  
  #### Linux:
  ```terminal
  npm run package-[platform]
  ```
  
  **Platforms**: mac, win, win64, linux, linux64, linuxarmv7l
  
  **For example**, building to Windows 64-bit would be:
  ```terminal
  npm run package-win64
  ```
