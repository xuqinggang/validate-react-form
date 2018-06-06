function required(formItemValue: string) {
    if (formItemValue.length === 0) {
        return false;
    }
    return true; 
};
function maxLen(formItemValue: string) {
    if (formItemValue.length > 5) {
        console.log('formItemValue.length', formItemValue.length)
        return false;
    } else {
        return true;
    }
}
