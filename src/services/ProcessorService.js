/**
 * Service for TC resource Elasticsearch processor.
 */

const Joi = require('joi')
const config = require('config')
const logger = require('../common/logger')
const helper = require('../common/helper')

const client = helper.getESClient()

/**
 * Handle create resource message. It will create resource in Elasticsearch.
 * @param {Object} message the create resource message
 */
async function createResource (message) {
  await client.create({
    index: config.ES.RESOURCE_INDEX,
    type: config.ES.RESOURCE_TYPE,
    id: message.payload.id,
    body: message.payload,
    refresh: 'true' // refresh ES so that it is visible for read operations instantly
  })
}

createResource.schema = {
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      id: Joi.string().uuid().required(),
      challengeId: Joi.string().required(),
      memberId: Joi.string().required(),
      memberHandle: Joi.string().required(),
      roleId: Joi.string().uuid().required()
    }).unknown(true).required()
  }).required()
}

/**
 * Handle delete resource message. It will delete resource in Elasticsearch.
 * @param {Object} message the delete resource message
 */
async function deleteResource (message) {
  await client.delete({
    index: config.ES.RESOURCE_INDEX,
    type: config.ES.RESOURCE_TYPE,
    id: message.payload.id,
    refresh: 'true' // refresh ES so that it is effective for read operations instantly
  })
}

deleteResource.schema = createResource.schema

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
  createResource,
  deleteResource,
  createResourceRole,
  updateResourceRole
}

logger.buildService(module.exports)
