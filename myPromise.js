const PENDING = "pending" // 等待
const FULFILLED = "fulfilled" // 成功
const REJECTED = "rejected" //失败

class MyPromise {
  constructor(executor) {
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }

  // promise 状态
  status = PENDING
  // 成功后的值
  value = undefined
  // 失败后的原因
  reason = undefined
  // 成功回调
  successCallback = []
  // 失败回调
  failCallback = []

  resolve = value => {
    // 如果状态不是 pending 阻止程序执行
    // 将状态更改为成功
    if (this.status !== PENDING) return
    this.status = FULFILLED
    // 保存成功之后的值
    this.value = value
    // 判断成功回调是否存在 如果存在就调用
    // this.successCallback && this.successCallback(this.value)
    while (this.successCallback.length) this.successCallback.shift()()
  }

  reject = reason => {
    if (this.status !== PENDING) return
    // 将状态更改为失败
    this.status = REJECTED
    // 保存失败原因
    this.reason = reason
    // 判断成功回调是否存在 如果存在就调用
    // this.failCallback && this.failCallback(this.reason)
    while(this.failCallback.length) this.failCallback.shift()()
  }

  then(successCallback, failCallback) {
    successCallback = successCallback ? successCallback : value => value
    failCallback = failCallback ? failCallback : reason => {throw reason}
    let promise2 = new MyPromise((resolve, reject) => {
      // 判断状态
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = successCallback(this.value)
            // 判断 x 是普通值还是 promise 对象
            // 普通值直接调用 resolve
            // 如果是 promise 对象 查看 promise 对象返回的结果
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0);
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = failCallback(this.reason)
            // 判断 x 是普通值还是 promise 对象
            // 普通值直接调用 resolve
            // 如果是 promise 对象 查看 promise 对象返回的结果
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0);
      } else {
        // 等待
        // 将成功和失败的回调存储起来
        this.successCallback.push(() => {
          setTimeout(() => {
            try {
              let x = successCallback(this.value)
              // 判断 x 是普通值还是 promise 对象
              // 普通值直接调用 resolve
              // 如果是 promise 对象 查看 promise 对象返回的结果
              resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0);
        })
        this.failCallback.push(() => {
          setTimeout(() => {
            try {
              let x = failCallback(this.reason)
              // 判断 x 是普通值还是 promise 对象
              // 普通值直接调用 resolve
              // 如果是 promise 对象 查看 promise 对象返回的结果
              resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0);
        })
      }
    })

    return promise2
  }

  static all(array) {
    let result = []
    let index = 0
    return new MyPromise((resolve, reject) => {
      function addData(key, value) {
        result[key] = value
        index++
        if(index === array.length) {
          resolve(result)
        }
      }
      for(let i = 0; i < array.length; i++) {
        let current = array[i]
        if(current instanceof MyPromise) {
          current.then((value) => {addData(i, value)}, (reason) => reject(reason))
        } else {
          addData(i, array[i])
        }
      }
    })
  }

  static resolve(value) {
    if(value instanceof MyPromise) return value
    return new MyPromise(resolve => resolve(value))
  }

  finally(callback) {
    return this.then((value) => {
      return MyPromise.resolve(callback()).then(() => value)
    }, (reason) => {
      return MyPromise.resolve(callback()).then(() => {throw reason})
    })

  }

  cache(failCallback) {
    return this.then(undefined, failCallback)
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if(promise2 === x) return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  if(x instanceof MyPromise) {
    // promise 对象
    x.then(resolve, reject)
  } else {
    // 普通值
    resolve(x)
  }
}

module.exports = MyPromise
