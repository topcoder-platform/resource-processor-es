/**
 * Contains generic helper methods
 */

const AWS = require('aws-sdk')
const config = require('config')
const elasticsearch = require('elasticsearch')

// Elasticsearch client
let esClient

AWS.config.update({
  region: config.ES.AWS_REGION
})

/**
 * Get ES Client
 * @return {Object} Elasticsearch Client Instance
 */
function getESClient () {
  if (esClient) {
    return esClient
  }
  const hosts = config.ES.HOST
  const apiVersion = config.ES.API_VERSION
  // AWS ES configuration is different from other providers
  if (/.*amazonaws.*/.test(hosts)) {
    esClient = elasticsearch.Client({
      apiVersion,
      hosts,
      connectionClass: require('http-aws-es'), // eslint-disable-line global-require
      amazonES: {
        region: config.ES.AWS_REGION,
        credentials: new AWS.EnvironmentCredentials('AWS')
      }
    })
  } else {
    esClient = new elasticsearch.Client({
      apiVersion,
      hosts
    })
  }
  return esClient
}

/**
 * Create Elasticsearch index, it will be deleted and re-created if present.
 * @param {String} indexName the ES index name
 */
async function createESIndex (indexName) {
  const client = getESClient()
  // delete index if present
  try {
    await client.indices.delete({ index: indexName })
  } catch (err) {
    // ignore
  }
  // create index
  const body = {}
  if (indexName === config.ES.RESOURCE_ROLE_INDEX) {
    body.mappings = {
      _doc: {
        properties: {
          isActive: {
            type: 'keyword'
          },
          name: {
            type: 'keyword'
          }
        }
      }
    }
  } else if (indexName === config.ES.RESOURCE_INDEX) {
    body.mappings = {
      _doc: {
        properties: {
          challengeId: {
            type: 'keyword'
          },
          memberId: {
            type: 'keyword'
          },
          roleId: {
            type: 'keyword'
          }
        }
      }
    }
  }
  await client.indices.create({ index: indexName, body })
}

module.exports = {
  getESClient,
  createESIndex
}
