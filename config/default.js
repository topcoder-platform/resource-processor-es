/**
 * The default configuration file.
 */

module.exports = {
  DISABLE_LOGGING: process.env.DISABLE_LOGGING ? process.env.DISABLE_LOGGING === 'true' : false, // If true, logging will be disabled
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',

  KAFKA_URL: process.env.KAFKA_URL || 'localhost:9092',
  KAFKA_GROUP_ID: process.env.KAFKA_GROUP_ID || 'resource-processor-es',
  // below are used for secure Kafka connection, they are optional
  // for the local Kafka, they are not needed
  KAFKA_CLIENT_CERT: process.env.KAFKA_CLIENT_CERT,
  KAFKA_CLIENT_CERT_KEY: process.env.KAFKA_CLIENT_CERT_KEY,

  RESOURCE_ROLE_CREATE_TOPIC: process.env.RESOURCE_ROLE_CREATE_TOPIC || 'challenge.action.resource.role.create',
  RESOURCE_ROLE_UPDATE_TOPIC: process.env.RESOURCE_ROLE_UPDATE_TOPIC || 'challenge.action.resource.role.update',

  ES: {
    HOST: process.env.ES_HOST || 'localhost:9200',
    AWS_REGION: process.env.AWS_REGION || 'us-east-1', // AWS Region to be used if we use AWS ES
    API_VERSION: process.env.ES_API_VERSION || '6.8',
    RESOURCE_INDEX: process.env.RESOURCE_INDEX || 'resources',
    RESOURCE_TYPE: process.env.RESOURCE_TYPE || '_doc',
    RESOURCE_ROLE_INDEX: process.env.RESOURCE_ROLE_INDEX || 'resource_roles',
    RESOURCE_ROLE_TYPE: process.env.RESOURCE_ROLE_TYPE || '_doc'
  }
}
