/**
 * Contains helper method for tests
 */

const config = require('config')
const helper = require('../../src/common/helper')

const client = helper.getESClient()

/**
 * Get elastic search data.
 * @param {String} index the Elastic search index name
 * @param {String} id the Elastic search data id
 * @returns {Object} the Elastic search data of given parameters
 */
async function getESData (index, id) {
  return client.getSource({
    index,
    type: index === config.ES.RESOURCE_INDEX ? config.ES.RESOURCE_TYPE : config.ES.RESOURCE_ROLE_TYPE,
    id
  })
}

module.exports = {
  getESData
}
