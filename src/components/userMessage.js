/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {Spacer, Spinner} from 'native-base';
import {Text, Image, TouchableOpacity, View} from 'react-native';
import moment from 'moment';

import {withAppContext} from '../context';
import {COLOR} from '../misc/constants';

const noImage = require('../assets/no-avatar.png');

const UserMessage = props => {
  const {sendbird, message} = props;
  const isMyMessage = message.sender.userId === sendbird.currentUser.userId;
  const [showDate, setShowDate] = useState(false);

  useEffect(() => {
    const channelHandler = new sendbird.ChannelHandler();

    sendbird.addChannelHandler(`message-${message.reqId}`, channelHandler);
    return () => {
      sendbird.removeChannelHandler(`message-${message.reqId}`);
    };
  }, [message.reqId, sendbird]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => setShowDate(!showDate)}
      style={{
        ...style.container,
        flexDirection: isMyMessage ? 'row-reverse' : 'row',
      }}>
      <View style={style.profileImageContainer}>
        {!message.hasSameSenderAbove && (
          <Image
            source={
              message.sender.plainProfileUrl !== ''
                ? {
                    uri: message.sender.plainProfileUrl,
                  }
                : noImage
            }
            style={style.profileImage}
          />
        )}
      </View>
      <View
        style={{
          ...style.content,
          alignItems: isMyMessage ? 'flex-end' : 'flex-start',
        }}>
        {!message.hasSameSenderAbove && (
          <Text style={style.nickname}>{message.sender.nickname}</Text>
        )}
        <View
          style={{
            ...style.messageBubble,
            backgroundColor: isMyMessage ? COLOR.blue : COLOR.darkerBlue,
          }}>
          <Text
            style={{
              ...style.message,
              color: isMyMessage ? 'white' : '#fff',
            }}>
            {message.message + '  '}
            <Spacer />
            <Text
              style={{
                ...style.updatedAt,
                color: isMyMessage ? COLOR.darkBlue : '#999',
              }}>
              {showDate
                ? moment(message.createdAt).fromNow() === 'in a few seconds'
                  ? 'Now'
                  : moment(message.createdAt).fromNow()
                : ''}
            </Text>
          </Text>
        </View>
      </View>
      <View
        style={{
          ...style.status,
          alignItems: isMyMessage ? 'flex-end' : 'flex-start',
        }}>
        {message.sendingStatus === 'pending' && (
          <Spinner
            size={10}
            indeterminate={true}
            indeterminateAnimationDuration={800}
            color={COLOR.yellow}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const style = {
  container: {
    paddingHorizontal: 4,
    marginVertical: 2,
  },
  profileImageContainer: {
    width: 32,
    height: 32,
    marginHorizontal: 8,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderWidth: 0,
    borderRadius: 16,
    marginTop: 30,
    backgroundColor: COLOR.darkerBlue,
  },
  content: {
    alignSelf: 'center',
    marginHorizontal: 4,
  },
  nickname: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#888',
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: '90%',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 2,
    backgroundColor: COLOR.blue,
  },
  message: {
    opacity: 1,
    fontSize: 17,
  },
  status: {
    alignSelf: 'flex-end',
    marginHorizontal: 3,
    marginBottom: 3,
  },
  readReceipt: {
    fontSize: 12,
    color: '#f89',
  },
  updatedAt: {
    fontSize: 12,
  },
};

export default withAppContext(UserMessage);
