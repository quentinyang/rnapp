import * as actions from './app'

export function makeActionCreator(type, ...argNames) {
    return function (...args) {
        let action = {type};
        argNames.forEach((arg, index) => {
            action[argNames[index]] = args[index];
        });
        return action;
    }
}

export function serviceAction(dispatch) {
    return function(options) {
        let { service, data, loading, success, error } = options;

        loading && dispatch(actions.appLoadingChanged(true));

        let successFn = oData => {
            loading && dispatch(actions.appLoadingChanged(false));
            console.log('[AjaxResponse]', oData)
            success(oData)
        }

        let errorFn = oData => {
            loading && dispatch(actions.appLoadingChanged(false));
            if (oData && oData.codeStatus == 401) {
                oData.visible = true;
                dispatch(actions.webAuthentication(oData));
            }

            if (oData && oData.codeStatus != 401) {
                if(error) {
                    error(oData);
                } else {
                    dispatch(actions.webNetWorkError(oData.msg));
                }
            }
            console.log('[AjaxResponse]', oData)
        }

        service(data).then((oData) => {
            successFn(oData)
        }).catch((error) => {
            errorFn(error);
        });
    }
}