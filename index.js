'use strict';

let fork = require('child_process').fork
const Promise = require('bluebird')
const aguid = require('aguid')
const fs = Promise.promisifyAll(require("fs"));


function executeLambda(lambda, cb) {
  let lambdaString = _prepareLambda(lambda)
  let lambda64 = Buffer.from(lambdaString.toString(), 'base64')
  let exec = fork(`./bucket/${aguid(lambda64.toString("base64"))}.js`, [], {
    silent: true
  })

  exec.on('message', (m) => {
    console.log('******* INFO > Lambda execution output: *******')
    console.log(m)
  })

  exec.stdout.on('data', (data) => {
    console.log('******* LOG > Lambda execution log: *******')
    console.log(data.toString())
  })

  exec.on('close', (code) => {
    console.log(`******* INFO > Lambda exited with code: ${code} *******`)
    cb(null, code)
  })

  exec.on('error', (err) => {
    console.log('******* ERROR > Lambda execution failed with error: *******')
    console.log(err)
    cb(err)
  })

}

// Due to the nature of child_process.fork, we need to get the lambda function
// and store it somewhere in the file system we can execute.
function receiveLambda(lambda, cb) {
  // store the lambda into the bucket folder
  console.log(lambda.toString())
  let lambdaString = _prepareLambda(lambda)
  let lambda64 = Buffer.from(lambdaString.toString(), 'base64')
  fs.writeFileAsync(`bucket/${aguid(lambda64.toString("base64"))}.js`, lambdaString)
  .then(() => {
    console.log(`******* INFO > Lambda saved at bucket: ${aguid(lambda64.toString("base64"))} *******`)
    cb(null, null)
  })
  .catch((e) => {
    console.log('******* ERROR > Lambda write could not be executed *******')
    cb(err)
  })
}

function _prepareLambda(lambda) {
  let lambdaString = lambda.toString()
  lambdaString = lambdaString.slice(lambdaString.indexOf("{") + 1, lambdaString.lastIndexOf("}"))
  return lambdaString
}

const Lambda = {
  receiveLambda: Promise.promisify(receiveLambda),
  executeLambda: Promise.promisify(executeLambda)
}

module.exports = Lambda