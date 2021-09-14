import React, {useEffect, useState, useMemo} from 'react';
import {Box, Text} from 'native-base';
import {Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import moment from 'moment';

import {withAppContext} from '../context';
import {
  createChannelName,
  createUnreadMessageCount,
  ellipsis,
} from '../misc/utils';
import {COLOR} from '../misc/constants';

const LAST_MESSAGE_ELLIPSIS = 23;

const Channel = props => {
  const {sendbird, channel, onPress} = props;
  const [name, setName] = useState('');
  const [lastMessage, setLastMessage] = useState('');
  const [unreadMessageCount, setUnreadMessageCount] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');

  const channelHandler = useMemo(
    () => new sendbird.ChannelHandler(),
    [sendbird.ChannelHandler],
  );
  channelHandler.onChannelChanged = updatedChannel => {
    if (updatedChannel.url === channel.url) {
      updateChannelName(updatedChannel);
      updateLastMessage(updatedChannel);
      updateUnreadMessageCount(updatedChannel);
      updateUpdatedAt(updatedChannel);
    }
  };
  channelHandler.onUserJoined = (updatedChannel, user) => {
    if (updatedChannel.url === channel.url) {
      if (user.userId !== sendbird.currentUser.userId) {
        updateChannelName(updatedChannel);
      }
    }
  };
  channelHandler.onUserLeft = (updatedChannel, user) => {
    if (updatedChannel.url === channel.url) {
      if (user.userId !== sendbird.currentUser.userId) {
        updateChannelName(updatedChannel);
      }
    }
  };

  const updateChannelName = newChan => {
    setName(createChannelName(newChan));
  };
  const updateLastMessage = newChan => {
    if (newChan.lastMessage) {
      const message = newChan.lastMessage;
      if (message.isUserMessage()) {
        setLastMessage(message.message);
      } else if (message.isFileMessage()) {
        setLastMessage(message.name);
      }
    }
  };
  const updateUnreadMessageCount = newChan => {
    setUnreadMessageCount(createUnreadMessageCount(newChan));
  };
  const updateUpdatedAt = newChan => {
    setUpdatedAt(
      moment(
        newChan.lastMessage ? newChan.lastMessage.createdAt : newChan.createdAt,
      ).fromNow(),
    );
  };

  useEffect(() => {
    // channel event listener
    sendbird.addChannelHandler(`channel_${channel.url}`, channelHandler);
    updateChannelName(channel);
    updateLastMessage(channel);
    updateUnreadMessageCount(channel);
    updateUpdatedAt(channel);
    return () => {
      sendbird.removeChannelHandler(`channel_${channel.url}`);
    };
  }, [channel, channelHandler, sendbird]);
  return (
    <TouchableOpacity style={style.container} onPress={() => onPress(channel)}>
      <Image
        source={
          channel.coverUrl
            ? {uri: channel.coverUrl}
            : require('../asset/logo-icon-purple.png')
        }
        style={style.profileImage}
      />
      <Box style={style.contentContainer}>
        <Text style={style.name}>{name}</Text>
        <Text style={style.lastMessage}>
          {ellipsis(lastMessage.replace(/\n/g, ' '), LAST_MESSAGE_ELLIPSIS)}
        </Text>
      </Box>
      <Box style={style.propertyContainer}>
        <Text style={style.updatedAt}>{updatedAt}</Text>
        {channel.unreadMessageCount > 0 ? (
          <Box style={style.unreadMessageCountContainer}>
            <Text style={style.unreadMessageCount}>{unreadMessageCount}</Text>
          </Box>
        ) : null}
      </Box>
    </TouchableOpacity>
  );
};

const style = {
  container: {
    elevation: 2,
    zIndex: 2,
    flexDirection: 'row',
    borderRadius: 5,
    backgroundColor: COLOR.darkerBlue,
    paddingHorizontal: 20,
    paddingVertical: 13,
    margin: 2,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 22,
    marginRight: 15,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
    alignSelf: 'center',
    paddingBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '100',
    color: '#fff',
    marginBottom: 2,
  },
  lastMessage: {
    fontSize: 14,
    color: '#999',
  },
  propertyContainer: {
    alignItems: 'center',
  },
  unreadMessageCountContainer: {
    minWidth: 20,
    padding: 3,
    borderRadius: 10,
    backgroundColor: COLOR.orange,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  unreadMessageCount: {
    fontSize: 12,
    color: '#fff',
  },
  updatedAt: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
    marginBottom: 4,
  },
};

export default withAppContext(Channel);
