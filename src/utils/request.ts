import axios from 'axios'

// 请求超时 TODO 性能优化后 修改至 30000
axios.defaults.timeout = 600000;
//axios.defaults.withCredentials=true;
// 添加一个请求拦截器
axios.interceptors.request.use(
    res => {
        // res.baseURL = baseUrl || '',
        res.params = res.params || {};
        if (res.headers['Content-Type'] == 'application/json' && res.method == 'post') {
            res.params = res.data || {};
        } else {
            res.params = res.params || {};
        }
        return res;
    },
    err => {
        return Promise.reject(err);
    }
);

// 添加一个响应拦截器
axios.interceptors.response.use(
    res => {
        //loading.close()
        if (res.data.code) {
            if (res.data.code == "0") {
                return res.data;
            } else if (res.data.code == "200") {
                return res.data;
            }
        } else {
            return res.data;
        }
    },
    error => {
        return Promise.reject(error);
    }
);


export const postHeaderJson = (url, params) => {
    return new Promise((resolve, reject) => {
        axios.post(url, params, { headers: { 'Content-Type': 'application/json' } }).then(res => {
            resolve(res);
        }, err => {
            reject(err)
        })
    })
}
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 *
 */
export const get = (url, params?: any, config = {}) => {
    return axios.get(url, {
        params: params,
        ...config
    })
};

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export const post = (url, params, obj = {}) => {
    //以x-www-form-urlencoded 格式post数据的时候，需要使用qs.stringify()
    return new Promise((resolve, reject) => {
        axios
            .post(url, params, obj)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
    });
};
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export const postFile = (url, params) => {
    return new Promise((resolve, reject) => {
        axios
            .post(url, params, {
                headers: {
                    "Content-Type": "multipart/form-data;charset=utf-8"
                }
            })
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
    });
};
/**
 * postForm  
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export const postForm = (url, params) => {
    //以x-www-form-urlencoded 格式post数据的时候，需要使用qs.stringify()
    return new Promise((resolve, reject) => {
        axios({
            url: url,
            method: "post",
            data: params,
            transformRequest: [
                function (data) {
                    // Do whatever you want to transform the data
                    let ret = "";
                    for (let it in data) {
                        const value = data[it] !== undefined ? data[it] : ''
                        ret += `&${encodeURIComponent(it)}=${encodeURIComponent(value)}`
                    }
                    return ret.slice(1)
                }
            ],
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
                //   'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
    });
};
/**
 * put 对应put请求
 * @param {String} url
 * @param {Object} data
 */
export const put = (url, params) => {
    return new Promise((resolve, reject) => {
        axios
            .put(url, params, { headers: { "Content-Type": "application/json" } })
            .then(
                response => {
                    resolve(response);
                },
                err => {
                    reject(err);
                }
            );
    });
};
/**
 * delete方法，delete请求
 * @param {String} url
 * @param {Object} params
 */

export const delet = (url, params = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .delete(url, {
                params: params
            })
            .then(response => {
                resolve(response);
            })
            .catch(err => {
                reject(err);
            });
    });
};