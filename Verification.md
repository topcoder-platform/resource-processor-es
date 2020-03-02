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
