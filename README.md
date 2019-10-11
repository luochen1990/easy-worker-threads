Easy Worker Threads
===================

A lightweight & promise style wrapper of nodejs worker_threads.

Usage
-----

install:
```
npm i easy-worker-threads
```

index.js:
```
const easyWorker = require('easy-worker-threads')

srv = easyWorker.useService('path/to/my-service.js')
Promise.all(list(range(10)).map(srv)).then((rs) => {
  console.log(rs)
})
```

my-service.js:
```
const easyWorker = require('easy-worker-threads')

const fib = (n) => {
  if (n < 2) { return n } else { return fib(n-1) + fib(n-2) }
}
easyWorker.makeServiceFrom(fib)
```
