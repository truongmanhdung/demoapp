const createMessageObject = function* createMessageObject(text) {
  const message = {
    version: 1,
    // fetchStatus: 'posting', // posting, putting, deleting, postFailed, putFailed, deleteFailed, normal (hoac khong co thuoc tinh objectStatus luon)
    // temporary: true/false,
    temporary: true,
    data: {
      id: 1,
      offlineId: 'abc',
      content: text,
    },
  };
  return message;
};

export default createMessageObject;
