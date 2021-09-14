import React, {
  useEffect,
  useCallback,
  useState,
  useReducer,
  useMemo,
} from 'react';
import {
  Box,
  Button,
  Text,
  HamburgerIcon,
  Input,
  KeyboardAvoidingView,
  Spacer,
  FlatList,
  Spinner,
  Flex,
} from 'native-base';
import {Platform, AppState} from 'react-native';
import chatStyle from '../../styles/chatStyle';
import {COLOR} from '../../misc/constants';
import {chatReducer} from '../../reducer/chat';
import Message from '../../components/message';
import {withAppContext} from '../../context';

const CurrentChat = props => {
  const {route, sendbird} = props;
  const {currentUser, channel} = route.params;

  const [query, setQuery] = useState(null);
  const [state, dispatch] = useReducer(chatReducer, {
    sendbird,
    messages: [],
    messageMap: {},
    loading: false,
    input: '',
    empty: '',
    error: '',
  });

  // on state change
  useEffect(() => {
    sendbird.addConnectionHandler('chat', connectionHandler);
    sendbird.addChannelHandler('chat', channelHandler);
    AppState.addEventListener('change', handleStateChange);

    if (!sendbird.currentUser) {
      sendbird.connect(currentUser.userId, (err, _) => {
        if (!err) {
          refresh();
        } else {
          dispatch({
            type: 'error',
            payload: {
              error: 'Connection failed. Please check the network status.',
            },
          });
        }
      });
    } else {
      refresh();
    }

    return () => {
      sendbird.removeConnectionHandler('chat');
      sendbird.removeChannelHandler('chat');
      AppState.removeEventListener('change', handleStateChange);
    };
  }, [
    channelHandler,
    connectionHandler,
    currentUser.userId,
    handleStateChange,
    refresh,
    sendbird,
  ]);

  /// on query refresh
  useEffect(() => {
    if (query) {
      next();
    }
  }, [next, query]);

  useEffect(() => {
    refresh();
  }, [route.params.channel, refresh]);

  /// on connection event
  const connectionHandler = useMemo(
    () => new sendbird.ConnectionHandler(),
    [sendbird.ConnectionHandler],
  );
  connectionHandler.onReconnectStarted = () => {
    dispatch({
      type: 'error',
      payload: {
        error: 'Connecting..',
      },
    });
  };
  connectionHandler.onReconnectSucceeded = () => {
    dispatch({
      type: 'error',
      payload: {
        error: '',
      },
    });
    refresh();
  };
  connectionHandler.onReconnectFailed = () => {
    dispatch({
      type: 'error',
      payload: {
        error: 'Connection failed. Please check the network status.',
      },
    });
  };

  /// on channel event
  const channelHandler = useMemo(
    () => new sendbird.ChannelHandler(),
    [sendbird.ChannelHandler],
  );
  channelHandler.onMessageReceived = (targetChannel, message) => {
    if (targetChannel.url === channel.url) {
      dispatch({type: 'receive-message', payload: {message}});
      channel.markAsRead();
    }
  };

  const handleStateChange = useCallback(
    newState => {
      if (newState === 'active') {
        sendbird.setForegroundState();
      } else {
        sendbird.setBackgroundState();
      }
    },
    [sendbird],
  );

  const refresh = useCallback(() => {
    if (channel.channelType === 'group') {
      channel.markAsRead();
    }
    setQuery(channel.createPreviousMessageListQuery());
    dispatch({type: 'refresh'});
  }, [channel]);

  const next = useCallback(() => {
    if (query.hasMore) {
      dispatch({type: 'error', payload: {error: ''}});
      query.limit = 25;
      query.reverse = true;
      query.load((err, fetchedMessages) => {
        if (!err) {
          dispatch({
            type: 'fetch-messages',
            payload: {messages: fetchedMessages},
          });
        } else {
          dispatch({
            type: 'error',
            payload: {error: 'Failed to get the messages.'},
          });
        }
      });
    }
  }, [query]);

  const sendUserMessage = () => {
    if (state.input.length > 0) {
      const params = new sendbird.UserMessageParams();
      params.message = state.input;

      const pendingMessage = channel.sendUserMessage(params, (err, message) => {
        if (!err) {
          dispatch({type: 'send-message', payload: {message}});
        } else {
          setTimeout(() => {
            dispatch({
              type: 'error',
              payload: {error: 'Failed to send a message.'},
            });
            dispatch({
              type: 'delete-message',
              payload: {reqId: pendingMessage.reqId},
            });
          }, 500);
        }
      });
      dispatch({
        type: 'send-message',
        payload: {message: pendingMessage, clearInput: true},
      });
    }
  };

  const header = (
    <Box style={chatStyle.header}>
      <Button
        variant="link"
        style={chatStyle.headerButton}
        onPress={props.openMenu}>
        <HamburgerIcon color={COLOR.red} />
      </Button>
      <Text style={chatStyle.headerName}>{channel.name}</Text>
      <Spacer />
      <Button
        variant="filled"
        size="xs"
        style={chatStyle.headerButton}
        onPress={props.openOnlineMember}>
        <Text color={COLOR.red}>User</Text>
      </Button>
    </Box>
  );

  const input = (
    <Input
      type="text"
      borderColor={COLOR.blue}
      value={state.input}
      onChangeText={content => {
        dispatch({type: 'typing', payload: {input: content}});
      }}
      borderWidth={0}
      roundedRight={0}
      mt={10}
      textAlignVertical="top"
      underlineColorAndroid="transparent"
      style={chatStyle.input}
      InputRightElement={
        <Button
          ml={0}
          style={chatStyle.sendButton}
          onPress={sendUserMessage}
          borderWidth={2}
          borderColor={COLOR.red}
          roundedLeft={0}
          roundedRight="md">
          Send
        </Button>
      }
      placeholder="Type your message here"
    />
  );

  const messageList = (
    <FlatList
      data={state.messages}
      inverted={true}
      initialNumToRender={25}
      renderItem={({item}) => (
        <Message {...props} key={item.reqId} channel={channel} message={item} />
      )}
      keyExtractor={item => `${item.messageId}` || item.reqId}
      contentContainerStyle={{
        padding: 0,
        flexGrow: 1,
      }}
      ListHeaderComponent={
        state.error && (
          <Box style={style.errorContainer}>
            <Text style={style.error}>{state.error}</Text>
          </Box>
        )
      }
      ListEmptyComponent={
        <Box style={style.emptyContainer}>
          <Text style={style.empty}>{state.empty}</Text>
        </Box>
      }
      onEndReached={() => next()}
      onEndReachedThreshold={0.5}
    />
  );
  return (
    <KeyboardAvoidingView
      height="100%"
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 30}>
      {header}
      {!state.loading ? (
        messageList
      ) : (
        <Flex>
          <Spacer />
          <Spinner size="large" color={COLOR.yellow} />
          <Spacer />
        </Flex>
      )}
      {input}
      {props.overlay}
    </KeyboardAvoidingView>
  );
};

const style = {
  container: {
    flex: 1,
  },
  headerRightContainer: {
    flexDirection: 'row',
  },
  headerRightButton: {
    marginRight: 10,
  },
  errorContainer: {
    backgroundColor: '#333',
    opacity: 0.8,
    padding: 10,
  },
  error: {
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    fontSize: 24,
    color: '#999',
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 20,
    color: '#555',
  },
  uploadButton: {
    marginRight: 10,
  },
  sendButton: {
    marginLeft: 10,
  },
};

export default withAppContext(CurrentChat);
