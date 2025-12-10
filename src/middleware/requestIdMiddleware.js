import { requestContext } from "../context/requestContext";


export function requestIdMiddleware(req, res, next) {
  requestContext.run(() => {
    next();
  }); 
}