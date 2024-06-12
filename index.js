"use strict";

const { Contexts } = require("./src/contexts");
const { structProtoToJson } = require("./src/structjson");

class WebhookAdapter {
  constructor(request, response) {
    if (request.body?.queryResult?.intent?.fulfillmentMessages) {
      request.body.queryResult.fulfillmentMessages =
        request.body.queryResult.fulfillmentMessages.map((message) => {
          if (!message.platform) {
            message.platform = "PLATFORM_UNSPECIFIED";
          }
          return message;
        });
    }

    this.request = request;
    this.response = response;

    this._fulfillmentMessages = [];
    this._outputContexts = [];
    this._followupEventInput = {};
  }

  get action() {
    return this.request.body.queryResult.action;
  }

  get parameters() {
    if (this.request.body.queryResult.parameters.fields) {
      return structProtoToJson(this.request.body.queryResult.parameters);
    } else {
      return this.request.body.queryResult.parameters;
    }
  }

  get session() {
    return this.request.body.session;
  }

  get responseId() {
    return this.request.body.responseId;
  }

  get queryText() {
    return this.request.body.queryResult.queryText;
  }

  get intent() {
    return this.request.body.queryResult.intent;
  }

  get intentDetectionConfidence() {
    return this.request.body.queryResult.intentDetectionConfidence;
  }

  get languageCode() {
    return this.request.body.queryResult.languageCode;
  }

  get fulfillmentText() {
    return this.request.body.queryResult.fulfillmentText;
  }

  get fulfillmentMessages() {
    return this.request.body.queryResult.fulfillmentMessages;
  }

  get outputContexts() {
    let projectId = "";
    let sessionId = "";
    if (this.request.body.session) {
      projectId = this.request.body.session.split("/")[1];
      sessionId = this.request.body.session.split("/")[4];
    } else {
      projectId = this.request.body.queryResult.intent.name.split("/")[1];
      sessionId = this.request.body.queryResult.intent.name.split("/")[4];
    }
    const outputContexts = new Contexts(
      this.request.body.queryResult.outputContexts,
      projectId,
      sessionId
    );

    this._outputContexts = outputContexts.contexts;

    return outputContexts;
  }

  get sentimentAnalysisResult() {
    return this.request.body.queryResult.sentimentAnalysisResult;
  }

  sendEvent(name, parameters, languageCode) {
    this._followupEventInput = {
      name,
      parameters,
      languageCode,
    };

    return this._followupEventInput;
  }

  addMessage(responses) {
    let fulfillmentMessages = [];

    for (const response of responses) {
      const { type, message } = response;
      const showUserFeedback = response.showUserFeedback || false;

      if (type === "Text") {
        fulfillmentMessages.push({
          text: {
            text: [message],
          },
          platform: "PLATFORM_UNSPECIFIED",
          message: "text",
          showUserFeedback,
        });
      }

      if (type === "Payload") {
        fulfillmentMessages.push({
          payload: message,
          platform: "PLATFORM_UNSPECIFIED",
          message: "payload",
          showUserFeedback,
        });
      }
    }

    this._fulfillmentMessages = fulfillmentMessages;

    return this._fulfillmentMessages;
  }

  createCardsButtons(items, itemTextValue, numberOfButtonsPerCard) {
    let cards = [];
    let buttons = [];

    for (let i = 1; i <= items.length; i++) {
      const item = items[i - 1];
      const itemName = item[itemTextValue];
      const button = {
        type: "text",
        text: itemName,
        value: itemName,
      };

      buttons.push(button);

      if (i % numberOfButtonsPerCard === 0 || i === items.length) {
        cards.push({
          buttons: buttons,
        });
        buttons = [];
      }
    }

    return cards;
  }

  handleResponse(intentMap) {
    let intentName = this.request.body.queryResult.intent.displayName;

    if (!intentMap.get(intentName)) {
      intentName = null;
    }

    let intentFunction = intentMap.get(intentName)(this);
    let promise = Promise.resolve(intentFunction);
    return promise.then(() => {
      const responsePayload = {
        fulfillmentMessages: this._fulfillmentMessages,
        outputContexts: this._outputContexts,
        followupEventInput: this._followupEventInput,
      };
      this.response.send(responsePayload);

      return responsePayload;
    });
  }
}

module.exports = { WebhookAdapter };
