@echo off

Echo "Compiling."
Rem compile
npm run package-win & npm run package-win64 & npm run package-linux & npm run package-linux64 & npm run package-linuxarmv7l & call remove_extra.bat & call zip_files.bat