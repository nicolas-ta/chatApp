import React, {useEffect, useState, useMemo} from 'react';
import {Box, Text} from 'native-base';
import {Image, TouchableOpacity} from 'react-native';
// import {} from 'react-native-gesture-handler';
import moment from 'moment';
import channelStyle from '../styles/channel.style';

import {withAppContext} from '../context';
import {
  createChannelName,
  createUnreadMessageCount,
  ellipsis,
} from '../misc/utils';

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
    <TouchableOpacity
      activeOpacity={0.8}
      style={channelStyle.channelContainer}
      onPress={() => onPress(channel)}>
      <Image
        source={
          channel.coverUrl
            ? {uri: channel.coverUrl}
            : require('../assets/logo-icon-purple.png')
        }
        style={channelStyle.profileImage}
      />
      <Box style={channelStyle.contentContainer}>
        <Text style={channelStyle.name}>{name}</Text>
        <Text style={channelStyle.lastMessage}>
          {ellipsis(lastMessage.replace(/\n/g, ' '), LAST_MESSAGE_ELLIPSIS)}
        </Text>
      </Box>
      <Box style={channelStyle.propertyContainer}>
        <Text style={channelStyle.updatedAt}>{updatedAt}</Text>
        {channel.unreadMessageCount > 0 ? (
          <Box style={channelStyle.unreadMessageCountContainer}>
            <Text style={channelStyle.unreadMessageCount}>
              {unreadMessageCount}
            </Text>
          </Box>
        ) : null}
      </Box>
    </TouchableOpacity>
  );
};

export default withAppContext(Channel);
