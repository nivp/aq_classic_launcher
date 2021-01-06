Echo "Removing extra files."
Rem LinuxARM
del "%cd%\release-builds\aqclassic_launcher-linux-armv7l\resources\app.asar.unpacked\resources\pepflashplayer32_32_0_0_453.dll"
del "%cd%\release-builds\aqclassic_launcher-linux-armv7l\resources\app.asar.unpacked\resources\pepflashplayer64_32_0_0_453.dll"
del "%cd%\release-builds\aqclassic_launcher-linux-armv7l\resources\app.asar.unpacked\resources\libpepflashplayer_32.so"
del "%cd%\release-builds\aqclassic_launcher-linux-armv7l\resources\app.asar.unpacked\resources\libpepflashplayer_64.so"
del "%cd%\release-builds\aqclassic_launcher-linux-armv7l\resources\app.asar.unpacked\resources\PepperFlashPlayer.plugin"

Rem Linux32
del "%cd%\release-builds\aqclassic_launcher-linux-ia32\resources\app.asar.unpacked\resources\libpepflashplayer_armv7l.so"
del "%cd%\release-builds\aqclassic_launcher-linux-ia32\resources\app.asar.unpacked\resources\pepflashplayer32_32_0_0_453.dll"
del "%cd%\release-builds\aqclassic_launcher-linux-ia32\resources\app.asar.unpacked\resources\pepflashplayer64_32_0_0_453.dll"
del "%cd%\release-builds\aqclassic_launcher-linux-ia32\resources\app.asar.unpacked\resources\libpepflashplayer_64.so"
del "%cd%\release-builds\aqclassic_launcher-linux-ia32\resources\app.asar.unpacked\resources\PepperFlashPlayer.plugin"

Rem Linux64
del "%cd%\release-builds\aqclassic_launcher-linux-x64\resources\app.asar.unpacked\resources\libpepflashplayer_armv7l.so"
del "%cd%\release-builds\aqclassic_launcher-linux-x64\resources\app.asar.unpacked\resources\pepflashplayer32_32_0_0_453.dll"
del "%cd%\release-builds\aqclassic_launcher-linux-x64\resources\app.asar.unpacked\resources\pepflashplayer64_32_0_0_453.dll"
del "%cd%\release-builds\aqclassic_launcher-linux-x64\resources\app.asar.unpacked\resources\libpepflashplayer_32.so"
del "%cd%\release-builds\aqclassic_launcher-linux-x64\resources\app.asar.unpacked\resources\PepperFlashPlayer.plugin"

Rem Win32
del "%cd%\release-builds\aqclassic_launcher-win32-ia32\resources\app.asar.unpacked\resources\libpepflashplayer_armv7l.so"
del "%cd%\release-builds\aqclassic_launcher-win32-ia32\resources\app.asar.unpacked\resources\pepflashplayer64_32_0_0_453.dll"
del "%cd%\release-builds\aqclassic_launcher-win32-ia32\resources\app.asar.unpacked\resources\libpepflashplayer_32.so"
del "%cd%\release-builds\aqclassic_launcher-win32-ia32\resources\app.asar.unpacked\resources\libpepflashplayer_64.so"
del "%cd%\release-builds\aqclassic_launcher-win32-ia32\resources\app.asar.unpacked\resources\PepperFlashPlayer.plugin"

Rem Win64
del "%cd%\release-builds\aqclassic_launcher-win32-x64\resources\app.asar.unpacked\resources\libpepflashplayer_armv7l.so"
del "%cd%\release-builds\aqclassic_launcher-win32-x64\resources\app.asar.unpacked\resources\pepflashplayer32_32_0_0_453.dll"
del "%cd%\release-builds\aqclassic_launcher-win32-x64\resources\app.asar.unpacked\resources\libpepflashplayer_32.so"
del "%cd%\release-builds\aqclassic_launcher-win32-x64\resources\app.asar.unpacked\resources\libpepflashplayer_64.so"
del "%cd%\release-builds\aqclassic_launcher-win32-x64\resources\app.asar.unpacked\resources\PepperFlashPlayer.plugin"

Echo "Done."