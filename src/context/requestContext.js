
import { AsyncLocalStorage } from "async_hooks";

const storage = new AsyncLocalStorage();

export const requestContext = {
  run(callback) {
    // start an empty context; middleware will set correlationId
    storage.run(Object.create(null), callback);
  },

  setCorrelationId(id) {
    const store = storage.getStore();
    if (store) store.correlationId = id;
  },

  set(key, value) {
    const store = storage.getStore();
    if (store) store[key] = value;
  },

  getCorrelationId() {
    const store = storage.getStore();
    return store?.correlationId || null;
  },

  get() {
    return storage.getStore() || {};
  }
};
