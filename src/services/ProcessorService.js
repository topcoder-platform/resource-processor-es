/**
 * Service for TC resource Elasticsearch processor.
 */

const Joi = require('joi')
const config = require('config')
const logger = require('../common/logger')
const helper = require('../common/helper')

const client = helper.getESClient()

/**
 * Handle create resource role message. It will create resource role in Elasticsearch.
 * @param {Object} message the create resource role message
 */
async function createResourceRole (message) {
  await client.create({
    index: config.ES.RESOURCE_ROLE_INDEX,
    type: config.ES.RESOURCE_ROLE_TYPE,
    id: message.payload.id,
    body: message.payload,
    refresh: 'true' // refresh ES so that it is visible for read operations instantly
  })
}

createResourceRole.schema = {
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      id: Joi.string().uuid().required(),
      name: Joi.string().required(),
      fullAccess: Joi.boolean().required(),
      isActive: Joi.boolean().required(),
      selfObtainable: Joi.boolean().required()
    }).unknown(true).required()
  }).required()
}

/**
 * Handle update resource role message. It will update resource role in Elasticsearch.
 * @param {Object} message the update resource role message
 */
async function updateResourceRole (message) {
  await client.update({
    index: config.ES.RESOURCE_ROLE_INDEX,
    type: config.ES.RESOURCE_ROLE_TYPE,
    id: message.payload.id,
    body: { doc: message.payload },
    refresh: 'true' // refresh ES so that it is visible for read operations instantly
  })
}

updateResourceRole.schema = createResourceRole.schema

// Exports
module.exports = {
  createResourceRole,
  updateResourceRole
}

logger.buildService(module.exports)
