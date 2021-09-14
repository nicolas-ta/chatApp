import AsyncStorage from '@react-native-community/async-storage';

const channelNameMaxMembers = 3;
const channelNameEllipsisLength = 32;
const maxUnreadMessageCount = 99;

export const ellipsis = (s, len) => {
  return s.length > len ? s.substring(0, len) + '..' : s;
};
export const createChannelName = channel => {
  if (channel.name === 'Group Channel' || channel.name.length === 0) {
    const nicknames = channel.members.map(m => m.nickname);
    if (nicknames.length > channelNameMaxMembers) {
      return ellipsis(
        `${nicknames.slice(0, channelNameMaxMembers + 1).join(', ')} and ${
          nicknames.length - channelNameMaxMembers
        } others`,
        channelNameEllipsisLength,
      );
    } else {
      return ellipsis(`${nicknames.join(', ')}`, channelNameEllipsisLength);
    }
  }
  return ellipsis(channel.name, channelNameEllipsisLength);
};
export const createUnreadMessageCount = channel => {
  if (channel.unreadMessageCount > maxUnreadMessageCount) {
    return `${maxUnreadMessageCount}+`;
  } else {
    return `${channel.unreadMessageCount}`;
  }
};
