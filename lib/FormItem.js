// @flow
import React, { Component, cloneElement } from 'react';
import type { ElementType } from 'react';
import PropTypes from 'prop-types';
import { isPlainObject, isArray, isFunction, removeEleFromArray } from './utils/utils';

type State = {
    isError: boolean,
    errors: JSONObject | null,
};
export default class FormItem extends Component<void, State> {
    /**
     * 对props.validate做处理
     * @param {type} name description
     * @param {type} name description
     * @return {Array}
     * [{
     *   trigger: ['onChange', ...]
     *   rules: [
     *   {
     *      required: true,
     *      message: '',
     *   },
     *   {
     *      maxLen: 15,
     *      message: '',
     *   }
     *   ]
     * }]
     */
    static _handleValidate(validateArr: JSONArray): JSONArray {
        const newValidateArr: JSONArray = isArray(validateArr) ? validateArr : [];
        if (isPlainObject(validateArr)) {
            newValidateArr.push(validateArr);
        }
        if (!isArray(newValidateArr)) {
            throw new Error("prop: validate need to 'PlainObject' or 'Array' type");
        }
        return newValidateArr.map((validate) => {
            const oldTrigger = validate.trigger;
            validate.trigger = ('string' === typeof oldTrigger) ? [oldTrigger] : oldTrigger;
            const oldRules = validate.rules;
            validate.rules = isPlainObject(oldRules) ? [oldRules] : oldRules;
            return validate;
        });
    }

    // return: 获取表单元素值，触发的trigger
    // _handleGetValueTrigger(validateArr: JSONArray): string {
    //     const getValueTriggerProp = this.props.getValueTrigger;
    //     if (getValueTriggerProp) {
    //         if (typeof getValueTriggerProp === 'string') {
    //             return getValueTriggerProp;
    //         } else {
    //             throw new Error(`prop: getValueTrigger need to 'String' type`);
    //         }
    //     } else {
    //         if (validateArr && validateArr.length) {
    //             let firstBatchTriggerArr = validateArr[0].trigger;
    //             if (trigger && trigger.length) {
    //                 return trigger[0]
    //             }
    //         } else {
    //             throw new Error(`Not found trigger value in the prop of validate `)
    //         }
    //     }
    // }
    // 按照指定的trigger提取表单元素值的处理函数
    static _handleExtractValueByTrigger(extractValueFun: Function | void): Function {
        return isFunction(extractValueFun) ? extractValueFun : (...params) => params;
    }

    constructor(props) {
        // 一个表单实例化一个事件触发器
        super(props);
        if ('string' !== typeof props.name) {
            throw new Error(`FormItem Component must need a 'name' prop and 
            corresponds to the 'name' prop on the flowing form element`);
        }
        // 每一个表单元素管理的状态信息
        // isError: boolean,
        // errors: { required: '必填', maxLen: null}
        this.state = {
            isError: false,
            errors: null,
        };
        // 定义的验证器函数
        this._validatesArr = FormItem._handleValidate(this.props.validate);
        // // this._getValueTrigger = this._handleGetValueTrigger(this._validatesArr);
        this._extractValueByTrigger = FormItem._handleExtractValueByTrigger(this.props.extractValueByTrigger);
    }

    // 处理表单元素的值和错误信息
    _handleFormItemValAndErr(formItemName: string, triggerEvent: string, definedRules: JSONArray, params: JSONArray) {
        if (isFunction(this._extractValueByTrigger)) {
            this._formItemVal = this._extractValueByTrigger(params);
            // 根据验证规则，来验证指定的值
            this._executeRulesValidate(formItemName, definedRules, this._formItemVal);
        } else if (isPlainObject(this._extractValueByTrigger)) {
            if ('string' !== typeof this._extractValueByTrigger.getFormItemValueTrigger) {
                throw new Error(`if prop 'extractValueByTrigger' is object, 
                    it must declare 'getFormItemValueTrigger' props. 
                    And prop 'extractValueByTrigger' its value must to be 'string' type`);
            }
            if (!isFunction(this._extractValueByTrigger[triggerEvent])) {
                throw new Error(` the value of prop 'extractValueByTrigger' need to has ${triggerEvent} prop, 
                    and the value of key '${triggerEvent}' must be 'function' type `);
            }
            // 通过某种trigger指定的提取函数获得的值
            const valueByTrigger = this._extractValueByTrigger[triggerEvent](params);
            if (triggerEvent === this._extractValueByTrigger.getFormItemValueTrigger) {
                this._formItemVal = valueByTrigger;
            }
            this._executeRulesValidate(formItemName, definedRules, valueByTrigger);
        }
    }

    _executeValidate(definedRules: JSONArray, validteValue: any) {
        const rulePromiseArr = definedRules.map((rule) => {
            const ruleKeyArr: JSONArray = Object.keys(rule);
            if (2 !== ruleKeyArr.length) {
                throw new Error(`each custom rule item must has two key-value pairs, one of them is key 'message',
                    the other is key 'custom rule', ex: { required: true, message: '必填' }`);
            }
            // 从数组中移除message，剩下规则验证函数名. ex: required
            const validateRuleFunName: string = removeEleFromArray(ruleKeyArr, 'message')[0];
            // 验证后的错误信息对象. ex: 表单验证错误: { required: '必填'} or
            // 表单验证正确: { maxLen: null }
            const validateErrorsObj: JSONObject = {
                [validateRuleFunName]: null,
            };
            if (!isFunction(this.context.validator[validateRuleFunName])) {
                throw new Error(`not found cusotom validator function ${validateRuleFunName} 
                from ValidateForm Component's validator props`);
            }
            return new Promise((resolve) => {
                // 验证结果, Promise | boolean
                const validateRt = this.context.validator[validateRuleFunName](validteValue, rule[validateRuleFunName]);
                if ('function' === typeof validateRt.then) {
                    validateRt
                        .catch((errInfo) => {
                            if (false === errInfo) {
                                validateErrorsObj[validateRuleFunName] = rule.message;
                            } else if ('string' === typeof errInfo) {
                                validateErrorsObj[validateRuleFunName] = errInfo;
                            } else {
                                throw new Error('验证器函数如果是一个promise，reject的值可以是false或者错误信息');
                            }
                            resolve(validateErrorsObj);
                        });
                } else if ('boolean' === typeof validateRt) {
                    if (!validateRt) {
                        validateErrorsObj[validateRuleFunName] = rule.message;
                    }
                }
                resolve(validateErrorsObj);
            });
        });

        return Promise.all(rulePromiseArr);
    }

    _executeRulesValidate(formItemName: string, definedRules: JSONArray, validteValue: any) {
        this._executeValidate(definedRules, validteValue)
        // errorArr: [{ required: '必填' }, { maxLen: null }]
            .then((errorArr) => {
                // 处理验证后的错误信息
                const errorsObj: JSONObject = {};
                // 将数组转换为对象
                errorArr.forEach((error) => {
                    Object.assign(errorsObj, error);
                });
                // 表单的整个错误状态
                let isError = false;
                const errorsKey = Object.keys(errorsObj);
                const errorsLength = errorsKey.length;
                for (let i = 0; i < errorsLength; i += 1) {
                    // 只要含有一个错误message，那么表单的错误状态isError为true
                    if ('string' === typeof errorsObj[errorsKey[i]]) {
                        isError = true;
                        break;
                    }
                }
                this.setState({
                    errors: errorsObj,
                    isError,
                });

                // 向ValidateForm顶层组件传递表单的值和错误信息
                if (this.context.collectFormItemValAndErr) {
                    this.context.collectFormItemValAndErr(formItemName, this._formItemVal, errorsObj);
                }
            });
    }

    // 装饰表单错误元素组件
    _decorateFormItemErr(formItemErr: ElementType): ElementType {
        const { isError, errors } = this.state;
        const extraProps = {
            isError,
            errors,
        };

        return cloneElement(formItemErr, extraProps);
    }

    // 装饰表单元素组件
    _decorateFormItemEle(formItemEle: ElementType): ElementType {
        const { name } = formItemEle.props;
        const extraProps = {};
        this._validatesArr.forEach((validate) => {
            // triggerEventArr: ['onChange', 'onBlur']
            const triggerEventArr: JSONArray = validate.trigger;
            const definedRules: JSONArray = validate.rules;
            // 遍历自定义的触发验证的回调函数
            triggerEventArr.forEach((triggerEvent) => {
                if ('function' !== typeof formItemEle.props[triggerEvent]) {
                    throw new Error('表单组件需要有相应的回调函数');
                }
                extraProps[triggerEvent] = (...params) => {
                    this._handleFormItemValAndErr(name, triggerEvent, definedRules, params);
                    // 调用原本绑定到表单组件的回调函数
                    if (formItemEle.props[triggerEvent]) {
                        formItemEle.props[triggerEvent](...params);
                    }
                };
            });
        });

        return cloneElement(formItemEle, extraProps);
    }

    render() {
        let isThrowErr = true;
        const { children, className, name } = this.props;
        const newChildren = React.Children.map(children, (child) => {
            if (child.props.name === name) {
                isThrowErr = false;
                return this._decorateFormItemEle(child);
            } else if ('FormItemError' === child.type.displayName) {
                return this._decorateFormItemErr(child);
            }
        });
        if (isThrowErr) {
            throw new Error(`FormItem Component, among its children, one of them must be formItem element 
            and must have a 'name' prop`);
        }

        return (
            <div className="test">
                { newChildren }
            </div>
        );
    }
}

const name: string = 123;
console.log('name', name);

FormItem.contextTypes = {
    emmiter: PropTypes.object,
    validator: PropTypes.object,
    collectFormItemValAndErr: PropTypes.func,
};
