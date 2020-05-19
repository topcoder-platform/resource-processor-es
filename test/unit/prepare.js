/*
 * Setting up Mock for unit tests
 */

// During tests the node env is set to test
process.env.NODE_ENV = 'test'

const _ = require('lodash')
const nock = require('nock')
const prepare = require('mocha-prepare')

const { resourceId, roleId } = require('../common/testData')

// mock ES data
let resource
let role

const getLastTwoParts = (path) => {
  const parts = path.split('/')
  const op = parts.pop() || ''
  const id = parts.pop() || ''
  return `${id}/${op}`
}

prepare(function (done) {
  // called before loading of test cases
  nock(/.com|localhost/)
    .persist()
    .filteringPath((path) => getLastTwoParts(path))
    .get(`${resourceId}/_source`)
    .query(true)
    .reply(() => {
      if (resource) {
        return [200, resource]
      } else {
        return [404, {}]
      }
    })
    .post(`${resourceId}/_create`)
    .query(true)
    .reply((uri, requestBody) => {
      if (resource) {
        return [409, {}]
      } else {
        resource = requestBody
        return [200, resource]
      }
    })
    .post(`${resourceId}/_update`)
    .query(true)
    .reply((uri, requestBody) => {
      if (resource) {
        _.assignIn(resource, requestBody.doc)
        return [200, resource]
      } else {
        return [404, {}]
      }
    })
    .delete(`_doc/${resourceId}`)
    .query(true)
    .reply((uri, requestBody) => {
      if (resource) {
        resource = null
        return [200, {}]
      } else {
        return [404, {}]
      }
    })
    .get(`${roleId}/_source`)
    .query(true)
    .reply(() => {
      if (role) {
        return [200, role]
      } else {
        return [404, {}]
      }
    })
    .post(`${roleId}/_create`)
    .query(true)
    .reply((uri, requestBody) => {
      if (role) {
        return [409, {}]
      } else {
        role = requestBody
        return [200, role]
      }
    })
    .post(`${roleId}/_update`)
    .query(true)
    .reply((uri, requestBody) => {
      if (role) {
        _.assignIn(role, requestBody.doc)
        return [200, role]
      } else {
        return [404, {}]
      }
    })
    .delete(`_doc/${roleId}`)
    .query(true)
    .reply((uri, requestBody) => {
      if (role) {
        role = null
        return [200, {}]
      } else {
        return [404, {}]
      }
    })
    .get(() => true)
    .query(true)
    .reply(404)
    .post(() => true)
    .query(true)
    .reply(404)
    .put(() => true)
    .query(true)
    .reply(404)
    .delete(() => true)
    .query(true)
    .reply(404)
  done()
}, function (done) {
  // called after all test completes (regardless of errors)
  nock.cleanAll()
  done()
})
