import { push } from '../main';

export const clearAllToasts = () => {
  push.clearAll();
};

export const destroyAllToasts = () => {
  push.destroyAll();
};

const messageObjectHandler = msgObj => {
  // set default duration to 0 if not provided
  msgObj.duration = msgObj.duration || 0;
};

export const successToast = msgObj => {
  messageObjectHandler(msgObj);
  push.success(msgObj);
};

export const errorToast = msgObj => {
  messageObjectHandler(msgObj);
  push.error(msgObj);
};

export const warningToast = msgObj => {
  messageObjectHandler(msgObj);
  push.warning(msgObj);
};

export const promiseToast = message => {
  return push.promise(message);
};
