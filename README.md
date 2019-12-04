# Topcoder - Resources Elasticsearch Processor

## Dependencies

- nodejs https://nodejs.org/en/ (v10)
- Kafka
- Elasticsearch 6.8.4
- Docker, Docker Compose

## Configuration

Configuration for the processor is at `config/default.js`.
The following parameters can be set in config files or in env variables:

- DISABLE_LOGGING: whether to disable logging; default value is false
- LOG_LEVEL: the log level; default value: 'debug'
- KAFKA_URL: comma separated Kafka hosts; default value: 'localhost:9092'
- KAFKA_GROUP_ID: the Kafka group id; default value: 'resource-processor-es'
- KAFKA_CLIENT_CERT: Kafka connection certificate, optional; default value is undefined;
    if not provided, then SSL connection is not used, direct insecure connection is used;
    if provided, it can be either path to certificate file or certificate content
- KAFKA_CLIENT_CERT_KEY: Kafka connection private key, optional; default value is undefined;
    if not provided, then SSL connection is not used, direct insecure connection is used;
    if provided, it can be either path to private key file or private key content
- RESOURCE_CREATE_TOPIC: create resource Kafka topic, default value is 'challenge.action.resource.create'
- RESOURCE_DELETE_TOPIC: delete resource Kafka topic, default value is 'challenge.action.resource.delete'
- RESOURCE_ROLE_CREATE_TOPIC: create resource role Kafka topic, default value is 'challenge.action.resource.role.create'
- RESOURCE_ROLE_UPDATE_TOPIC: update resource role Kafka topic, default value is 'challenge.action.resource.role.update'
- ES.HOST: Elasticsearch host, default value is 'localhost:9200'
- ES.AWS_REGION: AWS Region to be used if we use AWS ES, default value is 'us-east-1'
- ES.API_VERSION: Elasticsearch API version, default value is '6.8'
- ES.RESOURCE_INDEX: Elasticsearch index name for resources, default value is 'resources'
- ES.RESOURCE_TYPE: Elasticsearch index type for resources, default value is '_doc'
- ES.RESOURCE_ROLE_INDEX: Elasticsearch index name for resource roles, default value is 'resource_roles'
- ES.RESOURCE_ROLE_TYPE: Elasticsearch index type for resource roles, default value is '_doc'

Also note that there is a `/health` endpoint that checks for the health of the app.
This sets up an expressjs server and listens on the environment variable `PORT`.
It's not part of the configuration file and needs to be passed as an environment variable.
Default health check port is 3000 if not set.


## Local Kafka setup

- `http://kafka.apache.org/quickstart` contains details to setup and manage Kafka server,
  below provides details to setup Kafka server in Mac, Windows will use bat commands in bin/windows instead
- download kafka at `https://www.apache.org/dyn/closer.cgi?path=/kafka/1.1.0/kafka_2.11-1.1.0.tgz`
- extract out the doanlowded tgz file
- go to extracted directory kafka_2.11-0.11.0.1
- start ZooKeeper server:
  `bin/zookeeper-server-start.sh config/zookeeper.properties`
- use another terminal, go to same directory, start the Kafka server:
  `bin/kafka-server-start.sh config/server.properties`
- note that the zookeeper server is at localhost:2181, and Kafka server is at localhost:9092
- use another terminal, go to same directory, create some topics:
  `bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic challenge.action.resource.create`
  `bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic challenge.action.resource.delete`
  `bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic challenge.action.resource.role.create`
  `bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic challenge.action.resource.role.update`
- verify that the topics are created:
  `bin/kafka-topics.sh --list --zookeeper localhost:2181`,
  it should list out the created topics
- run the producer and then write some message into the console to send to the `challenge.action.resource.create` topic:
  `bin/kafka-console-producer.sh --broker-list localhost:9092 --topic challenge.action.resource.create`
  in the console, write message, one message per line:
  `{ "topic": "challenge.action.resource.create", "originator": "topcoder-resources-api", "timestamp": "2019-02-16T00:00:00", "mime-type": "application/json", "payload": { "id": "173803d3-019e-4033-b1cf-d7205c7f774c", "challengeId": "123", "memberId": "456", "memberHandle": "tester", "roleId": "172803d3-019e-4033-b1cf-d7205c7f774a" } }`
- optionally, use another terminal, go to same directory, start a consumer to view the messages:
  `bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic challenge.action.resource.create --from-beginning`
- writing/reading messages to/from other topics are similar


## Elasticsearch setup

Just run `docker-compose up` in `local` folder.


## Local deployment

- install dependencies `npm i`
- run code lint check `npm run lint`
- fix some code lint errors `npm run lint:fix`
- initialize Elasticsearch, create (recreate if present) configured Elasticsearch indices: `npm run init-es`
- start processor app `npm start`

## Local Deployment with Docker

To run the Resources ES Processor using docker, follow the below steps

1. Navigate to the directory `docker`

2. Rename the file `sample.api.env` to `api.env`

3. Set the required AWS credentials in the file `api.env`

4. Once that is done, run the following command

```
docker-compose up
```

5. When you are running the application for the first time, It will take some time initially to download the image and install the dependencies


## Verification

- setup kafka server, start elasticsearch, initialize Elasticsearch, start processor app
- start kafka-console-producer to write messages to `challenge.action.resource.create` topic:
  `bin/kafka-console-producer.sh --broker-list localhost:9092 --topic challenge.action.resource.create`
- write message:
  `{ "topic": "challenge.action.resource.create", "originator": "topcoder-resources-api", "timestamp": "2019-02-16T00:00:00", "mime-type": "application/json", "payload": { "id": "173803d3-019e-4033-b1cf-d7205c7f774c", "challengeId": "123", "memberId": "456", "memberHandle": "tester", "roleId": "172803d3-019e-4033-b1cf-d7205c7f774a" } }`
- run command `npm run view-data resources 173803d3-019e-4033-b1cf-d7205c7f774c` to view the created data, you will see the data are properly created:

```bash
info: Elasticsearch data:
info: {
    "id": "173803d3-019e-4033-b1cf-d7205c7f774c",
    "challengeId": "123",
    "memberId": "456",
    "memberHandle": "tester",
    "roleId": "172803d3-019e-4033-b1cf-d7205c7f774a"
}
info: Done!
```

- you may write invalid message like:
  `{ "topic": "challenge.action.resource.create", "originator": "topcoder-resources-api", "timestamp": "2019-02-16T00:00:00", "mime-type": "application/json", "payload": { "challengeId": "123", "memberId": "456", "memberHandle": "tester", "roleId": "172803d3-019e-4033-b1cf-d7205c7f774a" } }`

  `{ "topic": "challenge.action.resource.create", "originator": "topcoder-resources-api", "timestamp": "abc", "mime-type": "application/json", "payload": { "id": "173803d3-019e-4033-b1cf-d7205c7f774c", "challengeId": "123", "memberId": "456", "memberHandle": "tester", "roleId": "172803d3-019e-4033-b1cf-d7205c7f774a" } }`

  `{ [ { abc`
- then in the app console, you will see error messages

- start kafka-console-producer to write messages to `challenge.action.resource.delete` topic:
  `bin/kafka-console-producer.sh --broker-list localhost:9092 --topic challenge.action.resource.delete`

- write message to delete data:
  `{ "topic": "challenge.action.resource.delete", "originator": "topcoder-resources-api", "timestamp": "2019-02-16T00:00:00", "mime-type": "application/json", "payload": { "id": "173803d3-019e-4033-b1cf-d7205c7f774c", "challengeId": "123", "memberId": "456", "memberHandle": "tester", "roleId": "172803d3-019e-4033-b1cf-d7205c7f774a" } }`
- run command `npm run view-data resources 173803d3-019e-4033-b1cf-d7205c7f774c` to view the deleted data, you will see the data are properly deleted:

```bash
info: The data is not found.
```


- start kafka-console-producer to write messages to `challenge.action.resource.role.create` topic:
  `bin/kafka-console-producer.sh --broker-list localhost:9092 --topic challenge.action.resource.role.create`

- write message to create data:
  `{ "topic": "challenge.action.resource.role.create", "originator": "topcoder-resources-api", "timestamp": "2019-02-16T00:00:00", "mime-type": "application/json", "payload": { "id": "171803d3-019e-4033-b1cf-d7215c7f123a", "name": "role1", "fullAccess": true, "isActive": true, "selfObtainable": false } }`
- run command `npm run view-data resource_roles 171803d3-019e-4033-b1cf-d7215c7f123a` to view the created data, you will see the data are properly created:

```bash
info: Elasticsearch data:
info: {
    "id": "171803d3-019e-4033-b1cf-d7215c7f123a",
    "name": "role1",
    "fullAccess": true,
    "isActive": true,
    "selfObtainable": false
}
info: Done!
```

- start kafka-console-producer to write messages to `challenge.action.resource.role.update` topic:
  `bin/kafka-console-producer.sh --broker-list localhost:9092 --topic challenge.action.resource.role.update`

- write message to update data:
  `{ "topic": "challenge.action.resource.role.update", "originator": "topcoder-resources-api", "timestamp": "2019-02-16T00:00:00", "mime-type": "application/json", "payload": { "id": "171803d3-019e-4033-b1cf-d7215c7f123a", "name": "role2", "fullAccess": false, "isActive": true, "selfObtainable": true } }`
- run command `npm run view-data resource_roles 171803d3-019e-4033-b1cf-d7215c7f123a` to view the updated data, you will see the data are properly updated:

```bash
info: Elasticsearch data:
info: {
    "id": "171803d3-019e-4033-b1cf-d7215c7f123a",
    "name": "role2",
    "fullAccess": false,
    "isActive": true,
    "selfObtainable": true
}
info: Done!
```

- to test the health check API,
  run `export PORT=5000` (default port is 3000 if not set),
  start the processor,
  then browse `http://localhost:5000/health` in a browser,
  and you will see result `{"checksRun":1}`

