"use strict";

const DELETED_LIFESPAN_COUNT = 0;

class Contexts {
  constructor(contexts, projectId, sessionId) {
    this.contexts = contexts;
    this.projectId = projectId;
    this.sessionId = sessionId;
  }

  get(contextName) {
    return this.contexts.find((context) => {
      const name = context.name.split("/")[6];
      return name === contextName;
    });
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
