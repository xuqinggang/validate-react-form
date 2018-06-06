export function required(val: any, bool: boolean): boolean {
    val = (typeof val.value) !== 'undefined' ? val.value : val;
    if (!bool) return true;
    if(val.toString().trim() === '') {
        return false;
    }
    return true;
}
// export function secondeSelectValidate(val, bool: boolean) {
//     console.log('secondeSelectValidate', val, bool)
//     if (!bool) return true;
//     if (val.toString().trim() === '') {
//         return false;
//     }
//     if (val) {
//         let isLegal = !Object.keys(val).some((selName) => {
//             let selOption = val[selName];
//             if (selOption && selOption.value == 0) {
//                 return true;
//             } else return false;
//         });
//         return isLegal;
//     }
//     return false;
// }
// export function regTel(val, reg) {
//     val = typeof val.value !== 'undefined' ? val.value : val;
//     if(reg.test(val)) {
//         return true;
//     }
//     return false;
// }
// export function maxLen(val, len) {
//     val = typeof val.value !== 'undefined' ? val.value : val;
//     if(typeof val === 'number') {
//         val = val.toString();
//     }
//     if( typeof val === 'string' ) {
//         if (val.length <= len) {
//             return true;
//         } 
//     }
//     return false;
// }
