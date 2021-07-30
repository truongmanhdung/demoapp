export const UPDATE_OBJECT_TYPE = {
  OVERWRITE: 'UPDATE_OBJECT_TYPE_OVERWRITE',
  MERGE_DEEP: 'UPDATE_OBJECT_TYPE_MERGE_DEEP',
};

export const GET_LIST_TYPE = {
  FIRST: 'FIRST', // get lần đầu:> minScore : 0, maxScore : 0,
  NEWER: 'NEWER', // get mới hơn gần nhất. minScore : maxScore_current.
  NEWEST: 'NEWEST', // get mới hơn MỚI NHẤT : newest : 1.
  OLDER: 'OLDER', // get cũ hơn liền tiếp. maxScore : minScore_current.
  MID: 'MID', // get mới hơn và cũ hơn của một objectId: objectId.
};

export const UPDATE_BRANCH_TYPE = {
  UPDATE_AT_STATE_KEY: 'UPDATE_AT_STATE_KEY',
  UPDATE_AT_ID_KEY: 'UPDATE_AT_ID_KEY',
  UPDATE_AT_DATA: 'UPDATE_AT_DATA',
};

export class ACTION_TYPE {}
