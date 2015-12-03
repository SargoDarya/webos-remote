import Reflux from 'reflux';

const Actions = Reflux.createActions([
  'channelListUpdate',
  'appListUpdate',
  'setChannel',
  'currentChannelUpdate',
  'searchFilterUpdate',
  'programInfoUpdate',
  'currentProgramInfoUpdate'
]);

export default Actions;