import {AsyncLocalStorage} from 'async_hooks';
import crypto from 'crypto';

const storage = new AsyncLocalStorage();

export const requestContext = {
  run(callback) {
    const requestId = crypto.randomUUID();
    storage.run({ requestId }, callback);
  },
  
  getRequestId() {
    const store = storage.getStore();
    return store ? store.requestId : null;
  },

  getRequestContext() {
    return storage.getStore() || {};
  }

}