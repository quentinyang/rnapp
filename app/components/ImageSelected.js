var ImagePicker = require('react-native-image-picker');

const CONFIGS = {
    title: '选择图片',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '从手机相册选择',
    mediaType: 'photo',
    maxWidth: 500,
    maxHeight: 500,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

export function imageSelected(ops) {
    let options = {...CONFIGS, ...ops.config};
    ImagePicker.showImagePicker(options, (response) => {
        console.log('Response = ', response);
        ops.res_cb && ops.res_cb();
        if (response.didCancel) {
            ops.cancel_cb && ops.cancel_cb();
        } else if (response.error) {
            if(ops.err_cb) {
                ops.err_cb(response.error);
            } else {
                console.log('ImagePicker Error: ', response.error);
            }
        } else {
            ops.suc_cb && ops.suc_cb(response);
        }
    });
}