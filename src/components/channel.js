/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useCallback, useState, useMemo} from 'react';
import {Box, Text} from 'native-base';
import {Image, TouchableOpacity} from 'react-native';
import moment from 'moment';
import {channelStyle} from '@styles';
import {withAppContext} from '@src/context';

import {
  createChannelName,
  createUnreadMessageCount,
  ellipsis,
} from '@misc/utils';
import {COLOR, VALUE} from '@constants';

const Channel = props => {
  const {sendbird, channel, onPress, isCurrentChannel, setUnreadChannel} =
    props;
  const [name, setName] = useState('');
  const [lastMessage, setLastMessage] = useState('');
  const [unreadMessageCount, setUnreadMessageCount] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');

  /** Channel handler */
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

  /** Format a channel name based on its members
   * @param newChannel the new channel created
   */
  const updateChannelName = newChannel => {
    setName(createChannelName(newChannel));
  };

  /** Update the last message displayed on the channel
   * @param newChannel the new channel created
   */
  const updateLastMessage = newChannel => {
    if (newChannel.lastMessage) {
      const message = newChannel.lastMessage;
      if (message.isUserMessage()) {
        setLastMessage(message.message);
      } else if (message.isFileMessage()) {
        setLastMessage(message.name);
      }
    }
  };

  /** Update the unread message count
   * @param newChannel the new channel created
   */
  const updateUnreadMessageCount = useCallback(
    newChannel => {
      setUnreadMessageCount(createUnreadMessageCount(newChannel));
      sendbird.getTotalUnreadChannelCount((error, count) => {
        if (error) {
          // Handle error.
        }
        if (channel.channelType === 'group') {
          setUnreadChannel(count);
        }
      });
    },
    [channel.channelType, sendbird, setUnreadChannel],
  );

  /** Update the date
   * @param newChannel the new channel created
   */
  const updateUpdatedAt = newChannel => {
    setUpdatedAt(
      moment(
        newChannel.lastMessage
          ? newChannel.lastMessage.createdAt
          : newChannel.createdAt,
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
  }, [channel, channelHandler, sendbird, updateUnreadMessageCount]);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        ...channelStyle.channelContainer,
        backgroundColor: isCurrentChannel ? '#203945' : COLOR.darkerBlue,
      }}
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
          {ellipsis(lastMessage.replace(/\n/g, ' '), VALUE.lastMessageEllipsis)}
        </Text>
        <Text style={channelStyle.updatedAt}>{updatedAt}</Text>
      </Box>
      <Box style={channelStyle.propertyContainer}>
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
