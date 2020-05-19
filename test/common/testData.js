/*
 * Test data to be used in tests
 */

const uuid = require('uuid/v4')

const resourceId = uuid()
const roleId = uuid()
const notFoundId = uuid()

const createResourceMessage = {
  topic: 'challenge.action.resource.create',
  originator: 'resources-api',
  timestamp: '2019-02-03T01:01:00',
  'mime-type': 'application/json',
  payload: {
    id: resourceId,
    challengeId: uuid(),
    memberId: '123456',
    memberHandle: 'test',
    roleId
  }
}

const removeResourceMessage = {
  topic: 'challenge.action.resource.delete',
  originator: 'resources-api',
  timestamp: '2019-02-03T01:01:00',
  'mime-type': 'application/json',
  payload: {
    id: resourceId,
    challengeId: uuid(),
    memberId: '123123',
    memberHandle: 'test2',
    roleId
  }
}

const createResourceRoleMessage = {
  topic: 'challenge.action.resource.role.create',
  originator: 'resources-api',
  timestamp: '2019-02-03T01:01:00',
  'mime-type': 'application/json',
  payload: {
    id: roleId,
    name: 'test role',
    fullAccess: true,
    isActive: true,
    selfObtainable: false
  }
}

const updateResourceRoleMessage = {
  topic: 'challenge.action.resource.role.update',
  originator: 'resources-api',
  timestamp: '2019-02-03T01:01:00',
  'mime-type': 'application/json',
  payload: {
    id: roleId,
    name: 'test role 2',
    fullAccess: false,
    isActive: true,
    selfObtainable: true
  }
}

const requiredFields = ['topic', 'originator', 'timestamp', 'mime-type', 'payload.id', 'payload.challengeId',
  'payload.memberId', 'payload.memberHandle', 'payload.roleId', 'payload.name', 'payload.fullAccess',
  'payload.isActive', 'payload.selfObtainable']

const stringFields = ['topic', 'originator', 'mime-type', 'payload.id', 'payload.memberHandle',
  'payload.roleId', 'payload.name']

const guidFields = ['payload.id', 'payload.roleId']

const dateFields = ['timestamp']

const booleanFields = ['payload.fullAccess', 'payload.isActive', 'payload.selfObtainable']

module.exports = {
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
}
