#!/bin/bash
# IOS
echo "[CodePush - IOS]"

destDir="./release/"
bundleFile="${destDir}index.ios.jsbundle"
assetDir="${destDir}assets/app/"

# Begin
rm -rf "$destDir"
echo "Remove IOS cache [Done]"

mkdir "$destDir"

echo "Start bundle ..."
react-native bundle --platform ios --entry-file index.ios.js \
--bundle-output "$bundleFile" \
--assets-dest "$destDir" \
--dev false

# Check bundle file and asset directory
if [ -d "$assetDir" ] && [ -f "$bundleFile" ]; then
    echo "All done"
else
    echo "Error: bundle failed, please try again."
fi