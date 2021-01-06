Rem Variables
set version=1.4.2
set platforms=(linux-armv7l,linux-ia32,linux-x64,win32-ia32,win32-x64)

for %%x in %platforms% do (
    7z a "%cd%\release-builds\aqclassic_launcher-%%x_%version%.zip" "%cd%\release-builds\aqclassic_launcher-%%x" 
)