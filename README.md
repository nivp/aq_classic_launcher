# AQ Classic Launcher
A launcher for AdventureQuest Classic including some Quality of Life improvements.
# Building
## Install Requirements
  ```npm install```

## Include Flash Player plugin
  Do note that per the Adobe Flash Player license agreement I can't distribute it, and you are therefore required to include it yourself in the resources folder.
  The plugins should be renamed as follows:

  Linux 32-bit:
  ```libpepflashplayer_32.so```

  Linux 64-bit:
  ```libpepflashplayer_64.so```

  Windows 32-bit:
  ```pepflashplayer32_32_0_0_453.dll```

  Windows 64-bit:
  ```pepflashplayer64_32_0_0_453.dll```

  OS X:
  ```PepperFlashPlayer.plugin```

  ARM Linux:
  ```libpepflashplayer_armv7l.so```

## Build

  ### Windows:
  ```./build.bat```
  
  ### Linux:
  ```npm run package-[platform]```
  
  **Platforms**: mac, win, win64, linux, linux64, linuxarmv7l
  
  **For example**, building to Windows 64-bit would be:
  ```npm run package-win64```
