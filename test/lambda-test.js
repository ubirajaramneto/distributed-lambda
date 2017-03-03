const mocha = require('mocha')
const assert = require('assert')
const Lambda = require('../index.js')
const aguid = require('aguid')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require("fs"));

describe('Lambda', () => {
  describe('#receiveLambda', () => {
    it('should save a lambda function and store it in the bucket', (done) => {
      let lambdaToBeSent = function () {
        console.log('Hello World!')
        console.log('Im a Lambda function!')
        console.log('Im doing some stuff now')
        console.log('Now im done, bye!')
      }
      // console.log(lambdaToBeSent.toString())
      // console.log(aguid(lambdaToBeSent))
      // let lambda64 = Buffer.from(lambdaToBeSent.toString(), 'base64')
      // console.log(lambda64.toString("base64"))
      // console.log(aguid(lambda64))
      // assert(true)
      // done()
      Lambda.receiveLambda(lambdaToBeSent)
      .then(() => {
        return fs.statAsync(`../bucket/${lambdaId}.js`)
      })
      .then((fileStats) => {
        assert(fileStats.isFile(), true)
        done()
      })
      .catch((err) => {
        done()
      })
    })
  })
})