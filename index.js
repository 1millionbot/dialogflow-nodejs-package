"use strict";

class WebhookRequest {
  constructor(request) {
    this.request = request;
  }

  get action() {
    return this.request.body.queryResult.action;
  }

  get parameters() {
    return this.request.body.queryResult.parameters;
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
}

module.exports = WebhookRequest;
