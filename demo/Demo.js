import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { TextField } from 'material-ui';
import { ValidateForm, FormItem, FormItemError } from '../lib';

export default class Demo extends Component {
    onInputChange = (e) => {

    }
    onFormSubmit = (formInfo) => {

    }
    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <ValidateForm
                        validator={
                            {
                                required: (formItemValue) => {
                                    if (0 === formItemValue.length) {
                                        return false;
                                    }
                                    return true;
                                },
                                maxLen: (formItemValue) => {
                                    console.log(formItemValue, 'maxLen formItemValue');
                                    if (5 < formItemValue.length) {
                                        console.log('formItemValue.length', formItemValue.length);
                                        return false;
                                    }
                                    return true;
                                },
                            }
                        }
                        onSubmit={this.onFormSubmit}
                    >
                        <FormItem
                            name="test"
                            defaultValue="xxxx"
                            value="123123"
                            extractValueByTrigger={
                                (params) => {
                                    console.log('extractValueByTrigger', params);
                                    return params[1];
                                }
                            }
                            validate={[
                                {
                                    trigger: 'onChange',
                                    rules: [
                                        {
                                            maxLen: 15,
                                            message: '输入字数超过限制',
                                        },
                                        {
                                            required: true,
                                            message: '必填',
                                        },
                                    ],
                                },
                            ]}
                        >
                            <TextField name="test" onChange={this.onInputChange} />
                            <FormItemError onlyError={['required', 'maxLen']} />
                        </FormItem>
                    </ValidateForm>
                </div>
            </MuiThemeProvider>
        );
    }
}
