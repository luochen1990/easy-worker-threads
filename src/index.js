const { Worker, isMainThread, parentPort } = require('worker_threads');

// * make a service from a pure function
// makeServiceFrom :: (a -> b) -> Service a b
const makeServiceFrom = (pureFunc) => {
  if (!isMainThread) {
    parentPort.once('message', (arg_msg) => {
      let arg, rst
      try {
        arg = JSON.parse(arg_msg)
      } catch(e) {
        //console.log("fail message posted")
        parentPort.postMessage(JSON.stringify({success: false, error: e}))
        return
      }
      try {
        rst = pureFunc(arg)
      } catch(e) {
        //console.log("fail message posted")
        parentPort.postMessage(JSON.stringify({success: false, error: e}))
        return
      }
      //console.log("success message posted")
      parentPort.postMessage(JSON.stringify({success: true, data: rst}))
    })
  }
}

// * make a service from a pure async function
// makeServiceFromAsync :: (a -> Promise b) -> Service a b
const makeServiceFromAsync = (pureFunc) => {
  if (!isMainThread) {
    parentPort.once('message', (arg_msg) => {
      let arg, rstP
      try {
        arg = JSON.parse(arg_msg)
      } catch(e) {
        //console.log("fail message posted")
        parentPort.postMessage(JSON.stringify({success: false, error: e}))
        return
      }
      try {
        rstP = pureFunc(arg)
      } catch(e) {
        //console.log("fail message posted")
        parentPort.postMessage(JSON.stringify({success: false, error: e}))
        return
      }
      rstP.then((rst => {
        //console.log("success message posted")
        parentPort.postMessage(JSON.stringify({success: true, data: rst}))
      }), (err => {
        //console.log("fail message posted")
        parentPort.postMessage(JSON.stringify({success: false, error: err}))
      }))
    })
  }
}

// * use a service as a function which returns promise
// useService :: Path -> (a -> Promise b)
const useService = (servicePath) => {
  return (arg) => {
    const worker = new Worker(servicePath)
    return new Promise((resolve, reject) => {
      worker.once('message', (rst_msg) => {
        const resp = JSON.parse(rst_msg)
        if (resp.success) {
          resolve(resp.data)
        } else {
          reject({fail_reason: 'internal function error', error: resp.error})
        }
      })
      worker.once('error', (err_msg) => {
        reject({fail_reason: 'worker thread error', error: err_msg})
      })
      worker.postMessage(JSON.stringify(arg))
    })
  }
}

module.exports = {makeServiceFrom, makeServiceFromAsync, useService}

