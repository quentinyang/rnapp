#!/bin/bash
# Android
echo "[Android]"

destDir="./android/app/src/main/res/"
bundleFile="./android/app/src/main/assets/index.android.jsbundle"
assetDir="${destDir}/drawable-mdpi"

# Begin
rm -rf "$bundleFile" "$assetDir"
echo "Remove Android cache [Done]"

echo "Start bundle ..."
sudo /usr/local/node/node_global/lib/node_modules/react-native-cli/index.js bundle --platform android --entry-file index.android.js \
--bundle-output "$bundleFile" \
--assets-dest "$destDir" \
--dev false

# Check bundle file and asset directory
if [ -d "$assetDir" ] && [ -f "$bundleFile" ]; then
    echo "All done"
else
    echo "Error: bundle failed, please try again."
fi
