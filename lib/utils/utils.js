const toString = Object.prototype.toString;

export function isPlainObject(obj) {
    if ('[object Object]' === toString.call(obj)) {
        return true;
    }
    return false;
}

export function isArray(arr) {
    if ('[object Array]' === toString.call(arr)) {
        return true;
    }
    return false;
}

export function isFunction(fun) {
    if ('[object Function]' === toString.call(fun)) {
        return true;
    }
    return false;
}

export function removeEleFromArray(arr, ele) {
    const pos = arr.indexOf(ele);
    if (-1 === pos) {
        return arr;
    }
    arr.splice(pos, 1);

    return arr.concat();
}
