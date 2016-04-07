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
        let { service, data, success, error } = options

        let successFn = oData => {
            success(oData)
        }

        let errorFn = oData => {
            if (oData && oData.codeStatus == 401) {
                dispatch(actions.webAuthentication(false))
            }
            error(oData);
        }

        service({
            data: data,
            success: successFn,
            error: errorFn
        })

        service(data).then((oData) => {
            successFn(oData)
        }).catch((error) => {
            debugger
            errorFn(error);
        });

    }
}