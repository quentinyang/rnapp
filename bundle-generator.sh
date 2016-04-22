#!/bin/bash
# IOS
echo "[IOS]"
echo " - Remove IOS cache"
rm -rf index.ios.jsbundle assets/app/

echo " - Bundle index.ios.js"
react-native bundle --platform ios --entry-file index.ios.js \
--bundle-output ./index.ios.jsbundle \
--assets-dest ./ \
--dev false

# Android
echo "[Android]"
echo " - Remove IOS cache"
rm -rf android/app/src/main/assets/index.android.jsbundle android/app/src/main/res/drawable-mdpi

echo " - Bundle index.android.js"
react-native bundle --platform android --entry-file index.android.js \
--bundle-output ./android/app/src/main/assets/index.android.jsbundle \
--assets-dest ./android/app/src/main/res/ \
--dev false

echo "Finished"

