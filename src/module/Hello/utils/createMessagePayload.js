import convertToImmutableJs from '../../../vala-base/utils/convertToImmutableJs';

const createMessagePayload = (parentId, messageId, message) => {
  const messages = {};
  const messageIds = [];
  if (message) {
    messageIds.push(messageId);
    messages[messageId] = message;
  }
  const messagePayload = {
    messages,
    helloIds: {
      [parentId]: {
        itemIds: messageIds,
      },
    },
  };
  return convertToImmutableJs(messagePayload);
};

export default createMessagePayload;
