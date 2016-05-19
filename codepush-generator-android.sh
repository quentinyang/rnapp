#!/bin/bash
# IOS
echo "[CodePush - Android]"

destDir="./release/"
bundleFile="${destDir}index.android.jsbundle"
assetDir="${destDir}drawable-mdpi"

# Begin
rm -rf "$destDir"
echo "Remove Android cache [Done]"

mkdir "$destDir"

echo "Start bundle ..."
react-native bundle --platform android --entry-file index.android.js \
--bundle-output "$bundleFile" \
--assets-dest "$destDir" \
--dev false

# Check bundle file and asset directory
if [ -d "$assetDir" ] && [ -f "$bundleFile" ]; then
    echo "All done"
else
    echo "Error: bundle failed, please try again."
fi
