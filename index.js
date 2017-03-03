'use strict';

let fork = require('child_process').fork
const Promise = require('bluebird')
const aguid = require('aguid')
const fs = Promise.promisifyAll(require("fs"));


function executeLambda(lambda, cb) {
  let exec = fork(`./bucket/${aguid(lambda)}`)
  
  exec.stdout.on('data', (data) => {
    console.log('******* INFO > Lambda execution output: *******')
    console.log(data)
  })

  exec.on('close', (code) => {
    console.log(`******* INFO > Lambda exited with code: ${code} *******`)
    cb(null)
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
  let lambda64 = Buffer.from(lambda.toString(), 'base64')
  fs.writeFileAsync(`bucket/${aguid(lambda64.toString("base64"))}.js`, lambda)
  .then(() => {
    console.log(`******* INFO > Lambda saved at bucket: ${aguid(lambda64.toString("base64"))} *******`)
    cb(null, null)
  })
  .catch((e) => {
    console.log('******* ERROR > Lambda write could not be executed *******')
    cb(err)
  })
}

const Lambda = {
  receiveLambda: Promise.promisify(receiveLambda),
  executeLambda: Promise.promisify(executeLambda)
}

module.exports = Lambda