"use strict";

const { structProtoToJson } = require("./structjson");

const DELETED_LIFESPAN_COUNT = 0;

class Contexts {
  constructor(contexts, projectId, sessionId) {
    this.contexts = contexts;
    this.projectId = projectId;
    this.sessionId = sessionId;
  }

  get(contextName) {
    let context = this.contexts.find((context) => {
      const parts = context.name.split("/");
      const name = parts[parts.length - 1];
      return name === contextName;
    });

    if (!context) {
      return null;
    }

    if (context?.parameters?.fields) {
      context.parameters = structProtoToJson(context.parameters);
    }

    context = {
      name: context.name,
      lifespanCount: context.lifespanCount,
      parameters: context.parameters,
    };

    return context;
  }

  set(contextName, lifespanCount, parameters = {}) {
    const contextPath = `projects/${this.projectId}/agent/sessions/${this.sessionId}/contexts/${contextName}`;

    const index = this.contexts.findIndex((item) => item.name === contextPath);

    if (index !== -1) {
      this.contexts[index] = {
        name: contextPath,
        lifespanCount,
        parameters,
      };
    } else {
      this.contexts.push({
        name: contextPath,
        lifespanCount,
        parameters,
      });
    }
    return this.contexts;
  }

  delete(contextName) {
    this.set(contextName, DELETED_LIFESPAN_COUNT, {});
  }
}

module.exports = { Contexts };
