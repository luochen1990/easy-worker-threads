const { Worker, isMainThread, parentPort } = require('worker_threads')
const { list, range } = require("lazy-list")
const easyWorker = require('../src/index')

if (isMainThread) {
  console.log("isMainThread")
  srv = easyWorker.useService(__filename)
  Promise.all(list(range(10)).map(srv)).then((rs) => {
    console.log(rs)
  })
} else {
  console.log("not isMainThread")
  const fib = (n) => {
    if (n < 2) { return n } else { return fib(n-1) + fib(n-2) }
  }
  easyWorker.makeServiceFrom(fib)
}
