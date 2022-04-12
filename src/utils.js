export function button_click (self, func) {
    return {
        "button_click": [{
            execute: (_obj, _data) => func.call(self)
        }]
    }
}

export function split_to_columns(arr, n){
    let res = [];
    let i, j;
    for(i=0;i<n;i++){
        res.push([]);
    }
    j = 0;
    for(i=0;i<arr.length;i++){
        res[j].push(arr[i]);
        j += 1;
        if(j >= n){
            j = 0;
        }
    }
    return res;
}
