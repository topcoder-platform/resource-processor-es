/**
 * This is used to view Elasticsearch data of given index and id.
 * Usage:
 * node src/view-data {elasticsearch-index} {elasticsearch-id}
 */
const HttpStatus = require('http-status-codes')
const config = require('config')
const logger = require('./common/logger')
const helper = require('./common/helper')

if (process.argv.length !== 4) {
  logger.error('Usage: node src/view-data {elasticsearch-index} {elasticsearch-id}')
  process.exit(1)
}

/**
 * Get Elasticsearch data.
 * @param {String} index the Elasticsearch index name
 * @param {String} id the Elasticsearch data id
 * @returns {Object} the elastic search data of given index and id
 */
async function getESData (index, id) {
  const client = helper.getESClient()

  let type
  if (index === config.ES.RESOURCE_INDEX) {
    type = config.ES.RESOURCE_TYPE
  } else if (index === config.ES.RESOURCE_ROLE_INDEX) {
    type = config.ES.RESOURCE_ROLE_TYPE
  } else {
    throw new Error(`Invalid index: ${index}`)
  }

  return client.getSource({
    index,
    type,
    id
  })
}

// view data of given command line arguments
const viewData = async () => {
  const data = await getESData(process.argv[2], process.argv[3])
  logger.info('Elasticsearch data:')
  logger.info(JSON.stringify(data, null, 4))
}

viewData().then(() => {
  logger.info('Done!')
  process.exit()
}).catch((e) => {
  if (e.statusCode === HttpStatus.NOT_FOUND) {
    logger.info('The data is not found.')
    process.exit()
  } else {
    logger.logFullError(e)
    process.exit(1)
  }
})
