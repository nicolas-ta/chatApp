const channelNameMaxMembers = 2;
const channelNameEllipsisLength = 32;
const maxUnreadMessageCount = 99;

/** Create an ellipsis if the count exceed len
 * @param s input string
 * @param len max char
 */
export const ellipsis = (s, len) => {
  return s.length > len ? s.substring(0, len) + '..' : s;
};

/** Generate a channel name with the channel members
 * @param channel the new channel created
 */
export const createChannelName = channel => {
  if (channel.name === 'Group Channel' || channel.name.length === 0) {
    const nicknames = channel.members.map(m => m.nickname);
    if (nicknames.length > channelNameMaxMembers) {
      return ellipsis(
        `${nicknames.slice(0, channelNameMaxMembers + 1).join(', ')} + ${
          nicknames.length - channelNameMaxMembers
        }`,
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
