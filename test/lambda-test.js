const mocha = require('mocha')
const assert = require('assert')
const Lambda = require('../index.js')
const aguid = require('aguid')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require("fs"));

describe('Lambda', () => {
  let lambdy = function lambdy () {
    process.send("Msg from child")
    console.log("Some log from child")
  }
  describe('#receiveLambda', () => {
    it('should save a lambda function and store it in the bucket', (done) => {
      Lambda.receiveLambda(lambdy)
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

  describe('#executeLambda', () => {
    it('should execute a lambda function from the bucket', (done) => {
      Lambda.executeLambda(lambdy)
      .then((code) => {
        assert.equal(code, 0)
        done()
      })
      .catch(() => {
        done()
      })
    })
  })

})