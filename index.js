/*
  1. Promise 是一个类
  2. Promise 有三种状态
  3. resolve 和 reject 会更改状态
  4. then 方法内部会判断当前状态 如果是成功 调用成功的回调函数
    他被定义在 Promise 的原型对象上
  5. then 的成功回调有一个参数 失败回调也有一个参数
*/
const MyPromise = require("./myPromise.js")

// let promise = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     // throw new Error('executor error')
//     resolve("成功....")
//   }, 2000)

//   // reject('失败')
// })

// promise.then(
//   value => {
//     console.log(value)
//   },
//   error => {
//     console.log(error)
//   }
// )

// promise.then(value => console.log(value), error => console.log(error))
// promise.then(value => console.log(value), error => console.log(error))
// promise.then(value => console.log(value), error => console.log(error))

// promise.then(value => console.log(value))

// promise.then(value => console.log(value))

// function other() {
//   return new MyPromise((resolve, reject) => {
//     resolve('other')
//   })
// }

// let p1 = promise.then(value => {
//   console.log(value)
//   return p1
// })

// let p2 = p1.then(value => {
//   console.log(value)
// }, err => console.log(err))

// promise.then((value) => {
//   console.log(value);
//   // throw new Error('then error')
// }, (error) => {
//   console.log(error);
//   return 10000
// }).then((value) => {
//   console.log(value)
// })
function p1() {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve("p1")
    }, 2000);
  })
}


function p2() {
  return new MyPromise((resolve, reject) => {
    // resolve("p2")
    reject('fail')
  })
}

// MyPromise.all(['a', 'b', p1(), p2(), 'c']).then(result => console.log(result))
// p2().finally(() => {
//   console.log('finally');
//   return p1()
// }).then(value => {
//   console.log(value);
// }, reason => {
//   console.log(reason)
// })

p2().then((value) => {
  console.log(value)
}).cache(e => {
  console.log(e)
  return p2()
}).cache(value => {
  console.log(value);
})