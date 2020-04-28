/**
 * Configuration file to be used while running tests
 */

module.exports = {
  ES: {
    RESOURCE_INDEX: process.env.RESOURCE_INDEX_TEST || 'resources_test',
    RESOURCE_ROLE_INDEX: process.env.RESOURCE_ROLE_INDEX_TEST || 'resource_roles_test'
  }
}
