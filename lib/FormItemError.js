// @flow
import React, { Component } from 'react';
import warning from './utils/warning';

export default class FormItemError extends Component<void, State> {
    static displayName = 'FormItemError';
    componentWillMount() {
        this._showErrKeyArr = this._getShowErrorKeyArr(this.props.onlyError);
    }

    componentWillReceiveProps(nextProps) {
        this._showErrKeyArr = this._getShowErrorKeyArr(nextProps.onlyError);
    }

    // 获取需要显示错误的key数组
    _getShowErrorKeyArr(onlyError: string | Array | void): Array {
        let errorKeyArr = [];
        if (onlyError && onlyError.length) {
            errorKeyArr = onlyError;
        } else if ('string' === typeof onlyError) {
            errorKeyArr.push(onlyError);
        } else {
            errorKeyArr = Object.keys(this.state.errors);
        }
        return errorKeyArr;
    }
    render() {
        const {
            errors,
            className,
            isError,
            onlyError,
        } = this.props;
        const errKeyArrLength = this._showErrKeyArr.length;
        let showedErrorStr = '';
        if (errors) {
            for (let i = 0; i < errKeyArrLength; i += 1) {
                const tmpErrInfo = errors[this._showErrKeyArr[i]];
                if ('undefined' === typeof tmpErrInfo) {
                    warning(`no validated rules '${this._showErrKeyArr[i]}' were found`);
                }
                if ('string' === typeof tmpErrInfo) {
                    showedErrorStr = tmpErrInfo;
                    break;
                }
            }
        }
        return isError && showedErrorStr ?
            (
                <div>
                    { showedErrorStr }
                </div>
            )
            : null;
    }
}

