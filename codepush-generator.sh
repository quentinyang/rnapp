#!/bin/bash


# IOS
echo "[Codepush - IOS]"
echo " - Remove IOS cache"
rm -rf ./release/index.ios.jsbundle ./release/assets/app/

echo " - Bundle index.ios.js"
react-native bundle --platform ios --entry-file index.ios.js \
--bundle-output ./release/index.ios.jsbundle \
--assets-dest ./release \
--dev false

# Android
echo "[Codepush - Android]"
echo " - Remove IOS cache"
rm -rf ./release/index.android.jsbundle ./release/drawable-mdpi

echo " - Bundle index.android.js"
react-native bundle --platform android --entry-file index.android.js  \
--bundle-output ./release/index.android.jsbundle \
--assets-dest ./release \
--dev false
echo "Finished"

