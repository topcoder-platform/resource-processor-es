/**
 * The E2E test cases for TC resources and resource roles processor.
 * Configured Elasticsearch services are used.
 */

// During tests the node env is set to test
process.env.NODE_ENV = 'test'

const _ = require('lodash')
const config = require('config')
const expect = require('chai').expect
const ProcessorService = require('../../src/services/ProcessorService')
const testHelper = require('../common/testHelper')
const helper = require('../../src/common/helper')
const {
  resourceId,
  roleId,
  notFoundId,
  createResourceMessage,
  removeResourceMessage,
  createResourceRoleMessage,
  updateResourceRoleMessage,
  requiredFields,
  stringFields,
  guidFields,
  dateFields,
  booleanFields
} = require('../common/testData')

const client = helper.getESClient()

describe('TC Resources and Resource Roles Processor E2E Tests', () => {
  // clear ES data if any
  const clearData = async () => {
    try {
      await client.delete({
        index: config.ES.RESOURCE_INDEX,
        type: config.ES.RESOURCE_TYPE,
        id: resourceId,
        refresh: 'true'
      })
    } catch (e) {
      // ignore
    }
    try {
      await client.delete({
        index: config.ES.RESOURCE_ROLE_INDEX,
        type: config.ES.RESOURCE_ROLE_TYPE,
        id: roleId,
        refresh: 'true'
      })
    } catch (e) {
      // ignore
    }
  }

  // run before all tests
  before(async () => {
    await clearData()
  })

  // run after all tests
  after(async () => {
    await clearData()
  })

  it('create resource role successfully', async () => {
    await ProcessorService.createResourceRole(createResourceRoleMessage)
    const data = await testHelper.getESData(config.ES.RESOURCE_ROLE_INDEX, roleId)
    expect(_.isEqual(data, createResourceRoleMessage.payload))
  })

  it('create resource role - already exists', async () => {
    try {
      await ProcessorService.createResourceRole(createResourceRoleMessage)
    } catch (err) {
      expect(err.statusCode).to.equal(409)
      expect(err.message.indexOf('document already exists') >= 0).to.equal(true)
      return
    }
    throw new Error('There should be conflict error.')
  })

  it('update resource role successfully', async () => {
    await ProcessorService.updateResourceRole(updateResourceRoleMessage)
    const data = await testHelper.getESData(config.ES.RESOURCE_ROLE_INDEX, roleId)
    expect(_.isEqual(data, updateResourceRoleMessage.payload))
  })

  it('update resource role - not found', async () => {
    const message = _.cloneDeep(updateResourceRoleMessage)
    message.payload.id = notFoundId
    try {
      await ProcessorService.updateResourceRole(message)
    } catch (err) {
      expect(err.statusCode).to.equal(404)
      expect(err.message.indexOf('document_missing_exception') >= 0).to.equal(true)
      return
    }
    throw new Error('There should be not found error.')
  })

  it('create resource successfully', async () => {
    await ProcessorService.createResource(createResourceMessage)
    const data = await testHelper.getESData(config.ES.RESOURCE_INDEX, resourceId)
    expect(_.isEqual(data, createResourceMessage.payload))
  })

  it('create resource - already exists', async () => {
    try {
      await ProcessorService.createResource(createResourceMessage)
    } catch (err) {
      expect(err.statusCode).to.equal(409)
      expect(err.message.indexOf('document already exists') >= 0).to.equal(true)
      return
    }
    throw new Error('There should be conflict error.')
  })

  it('remove resource successfully', async () => {
    await ProcessorService.deleteResource(removeResourceMessage)
    try {
      await testHelper.getESData(config.ES.RESOURCE_INDEX, resourceId)
    } catch (err) {
      expect(err.statusCode).to.equal(404)
      expect(err.message.indexOf('resource_not_found_exception') >= 0).to.equal(true)
      return
    }
    throw new Error('Removed resource should not be found.')
  })

  it('remove resource - removed resource can not be removed again', async () => {
    try {
      await ProcessorService.deleteResource(removeResourceMessage)
    } catch (err) {
      expect(err.statusCode).to.equal(404)
      expect(err.message).to.equal('Not Found')
      return
    }
    throw new Error('There should be not found error.')
  })

  it('remove resource - not found', async () => {
    const message = _.cloneDeep(removeResourceMessage)
    message.payload.id = notFoundId
    try {
      await ProcessorService.deleteResource(message)
    } catch (err) {
      expect(err.statusCode).to.equal(404)
      expect(err.message).to.equal('Not Found')
      return
    }
    throw new Error('There should be not found error.')
  })

  const ops = ['createResource', 'deleteResource', 'createResourceRole', 'updateResourceRole']
  const messages = [createResourceMessage, removeResourceMessage, createResourceRoleMessage, updateResourceRoleMessage]

  for (let i = 0; i < ops.length; i += 1) {
    const op = ops[i]
    const testMessage = messages[i]

    for (const requiredField of requiredFields) {
      if (_.get(testMessage, requiredField)) {
        it(`${op}, missing ${requiredField}`, async () => {
          let message = _.cloneDeep(testMessage)
          message = _.omit(message, requiredField)
          try {
            await ProcessorService[op](message)
          } catch (err) {
            expect(err.name).to.equal('ValidationError')
            const msg = `"${_.last(requiredField.split('.'))}" is required`
            expect(err.message.indexOf(msg) >= 0).to.equal(true)
            return
          }
          throw new Error('should not throw error here')
        })
      }
    }

    for (const stringField of stringFields) {
      if (_.get(testMessage, stringField)) {
        it(`${op}, invalid string type field ${stringField}`, async () => {
          const message = _.cloneDeep(testMessage)
          _.set(message, stringField, 123)
          try {
            await ProcessorService[op](message)
          } catch (err) {
            expect(err.name).to.equal('ValidationError')
            const msg = `"${_.last(stringField.split('.'))}" must be a string`
            expect(err.message.indexOf(msg) >= 0).to.equal(true)
            return
          }
          throw new Error('should not throw error here')
        })

        it(`${op}, empty string field ${stringField}`, async () => {
          const message = _.cloneDeep(testMessage)
          _.set(message, stringField, '')
          try {
            await ProcessorService[op](message)
          } catch (err) {
            expect(err.name).to.equal('ValidationError')
            const msg = `"${_.last(stringField.split('.'))}" is not allowed to be empty`
            expect(err.message.indexOf(msg) >= 0).to.equal(true)
            return
          }
          throw new Error('should not throw error here')
        })
      }
    }

    for (const dateField of dateFields) {
      if (_.get(testMessage, dateField)) {
        it(`${op}, invalid date type field ${dateField}`, async () => {
          const message = _.cloneDeep(testMessage)
          _.set(message, dateField, 'abc')
          try {
            await ProcessorService[op](message)
          } catch (err) {
            expect(err.name).to.equal('ValidationError')
            const msg = `"${_.last(dateField.split('.'))}" must be a number of milliseconds or valid date string`
            expect(err.message.indexOf(msg) >= 0).to.equal(true)
            return
          }
          throw new Error('should not throw error here')
        })
      }
    }

    for (const guidField of guidFields) {
      if (_.get(testMessage, guidField)) {
        it(`${op}, invalid GUID type field ${guidField}`, async () => {
          const message = _.cloneDeep(testMessage)
          _.set(message, guidField, '12345')
          try {
            await ProcessorService[op](message)
          } catch (err) {
            expect(err.name).to.equal('ValidationError')
            const msg = `"${_.last(guidField.split('.'))}" must be a valid GUID`
            expect(err.message.indexOf(msg) >= 0).to.equal(true)
            return
          }
          throw new Error('should not throw error here')
        })
      }
    }

    for (const booleanField of booleanFields) {
      if (!_.isNil(_.get(testMessage, booleanField))) {
        it(`${op}, invalid boolean type field ${booleanField}`, async () => {
          const message = _.cloneDeep(testMessage)
          _.set(message, booleanField, 'abc')
          try {
            await ProcessorService[op](message)
          } catch (err) {
            expect(err.name).to.equal('ValidationError')
            const msg = `"${_.last(booleanField.split('.'))}" must be a boolean`
            expect(err.message.indexOf(msg) >= 0).to.equal(true)
            return
          }
          throw new Error('should not throw error here')
        })
      }
    }
  }
})
