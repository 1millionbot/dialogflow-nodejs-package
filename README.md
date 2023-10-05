# Dialogflow Node.js Package

This is a Node.js client for Dialogflow Webhooks.

## Installation

```
npm install git+https://github.com/1millionbot/dialogflow-nodejs-package.git
```

## Quick Start

```js
"use strict";

const { WebhookAdapter } = require("dialogflow-nodejs-package");

const intents = require("../intents");

const handler = async (req, res) => {
  console.info("Dialogflow Controller: receiveDialogflowMessage.");

  try {
    const webhookAdapter = new WebhookAdapter(req, res);

    let intentMap = new Map();

    intentMap.set("Intent Name", intents.intentFunction);

    webhookAdapter.handleResponse(intentMap);
  } catch (error) {
    console.error("Dialogflow Controller: error", error);
  }
};
```

## Samples

```js
"use strict";

module.exports = async (webhookAdapter) => {
    console.info('Intent: ...');

    try {

    const { outputContexts, queryText, parameters } =
            webhookAdapter;
            [...]
  } catch (error) {
    console.error("Dialogflow Controller: error", error);
  }
};
```

## License

Apache Version 2.0
