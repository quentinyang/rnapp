var DeviceInfo = require('react-native-device-info');
import { DeviceId } from 'nuke'

var deviceInfo = {
    // * note this is IDFV on iOS so it will change if all apps from the current apps vendor have been previously uninstalled
    uniqueId: DeviceInfo.getUniqueID(),  // e.g. FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9
    manufacturer: DeviceInfo.getManufacturer(),  // e.g. Apple
    model: DeviceInfo.getModel(),  // e.g. iPhone 6
    deviceId: DeviceId.getDeviceId(),
    systemName: DeviceInfo.getSystemName(),  // e.g. iPhone OS
    systemVersion: DeviceInfo.getSystemVersion(),  // e.g. 9.0
    bundleId: DeviceInfo.getBundleId(),  // e.g. com.learnium.mobile
    buildNum: DeviceInfo.getBuildNumber(),  // e.g. 89
    version: DeviceInfo.getVersion(),  // e.g. 1.1.0
    readableVersion: DeviceInfo.getReadableVersion(),  // e.g. 1.1.0.89
    deviceName: DeviceInfo.getDeviceName(),  // e.g. Becca's iPhone 6
    userAgent: DeviceInfo.getUserAgent(), // e.g. Dalvik/2.1.0 (Linux; U; Android 5.1; Google Nexus 4 - 5.1.0
    deviceLocale: DeviceInfo.getDeviceLocale(), // e.g en-US
    deviceCountry: DeviceInfo.getDeviceCountry(), // e.g US
};

export default deviceInfo;