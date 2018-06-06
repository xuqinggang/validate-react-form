// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import warning from './utils/warning';
import Emmiter from './utils/emmiter';

export default class ValidateForm extends Component<void, State, Context, ChildContext> {
    constructor(props) {
        // 一个表单实例化一个事件触发器
        super(props);
        this.emmiter = new Emmiter();
        this._formInfo = {};
        this.collectFormItemValAndErr = this.collectFormItemValAndErr.bind(this);
    }
    getChildContext() {
        return {
            emmiter: this.emmiter,
            validator: this.props.validator,
            collectFormItemValAndErr: this.collectFormItemValAndErr,
        };
    }
    collectFormItemValAndErr(formItemName: string, formItemValue: any, formItemError: Object | null) {
        !formItemName && warning("may be FormItem and FormElement Component miss 'name' prop");
        console.log('collectFormItemValAndErr', formItemName, formItemValue, formItemError, this._formInfo);
        if (formItemName) {
            this._formInfo[formItemName] = {
                value: formItemValue,
                errors: formItemError,
            };
        }
        if (this.props.onSubmit) {
            this.props.onSubmit(this._formInfo);
        }
    }
    render() {
        return (
            <div>
                { this.props.children }
            </div>
        );
    }
}

ValidateForm.childContextTypes = {
    emmiter: PropTypes.object,
    validator: PropTypes.object,
    collectFormItemValAndErr: PropTypes.func,
};
