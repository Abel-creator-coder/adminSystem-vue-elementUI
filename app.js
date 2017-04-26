import proxy from '../model/proxy/proxy.js';

const MOCK = false;

var formateData = function (data, prefix) {
    var arr = [];
    for (let k in data) {
        if (typeof data[k] === 'object') {
            arr = arr.concat(formateData(data[k], k));
        } else {
            if (data[k] !== undefined && data[k] !== '') {
                if (prefix) {
                    arr.push(prefix + '-' + k + '=' + data[k]);
                } else {
                    arr.push(k + '=' + data[k]);
                }
            }
        }
    }
    return arr;
};

let app = {
    getApi: function (url, params, fn) {
        //if (MOCK || url === '/api/building-item.json') {
        if (MOCK) {
            url += '?' + formateData(params).join('&');
            fetch(url, {
                'method': 'GET'
            }).then(function (res) {
                if (res.ok) {
                    res.json().then(function (obj) {
                        fn(obj);
                    });
                }
            });
        } else {
            proxy(url, params, fn);
        }
    }
}

export default app;
