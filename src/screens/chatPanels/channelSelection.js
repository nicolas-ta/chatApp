import React, {
  useEffect,
  useState,
  useReducer,
  useCallback,
  useMemo,
} from 'react';
import {Box, Button} from 'native-base';
import chatStyle from '../../styles/chatStyle';
import {channelsReducer} from '../../reducer/channels';
import ChannelList from '../../components/channelList';
import {AppState, SafeAreaView} from 'react-native';
import {COLOR} from '../../misc/constants';
const ChannelSelection = props => {
  const {route, sendbird} = props;
  const {currentUser} = route.params;
  const [query, setQuery] = useState(null);
  const [queryOpenChannel, setQueryOpenChannel] = useState(null);

  const [state, dispatch] = useReducer(channelsReducer, {
    sendbird,
    currentUser,
    channels: [],
    channelMap: {},
    openChannels: [],
    loading: false,
    empty: '',
    error: null,
  });

  // on state change
  useEffect(() => {
    sendbird.addConnectionHandler('channels', connectionHandler);
    sendbird.addChannelHandler('channels', channelHandler);
    AppState.addEventListener('change', handleStateChange);
    if (!sendbird.currentUser) {
      sendbird.connect(currentUser.userId, (err, _) => {
        if (!err) {
          refresh();
        } else {
          dispatch({
            type: 'end-loading',
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
      dispatch({type: 'end-loading'});
      sendbird.removeConnectionHandler('channels');
      sendbird.removeChannelHandler('channels');
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

  // useEffect(() => {
  //   if (route.params && route.params.action) {
  //     const {action, data} = route.params;
  //     switch (action) {
  //       case 'leave':
  //         data.channel.leave(err => {
  //           if (err) {
  //             dispatch({
  //               type: 'error',
  //               payload: {
  //                 error: 'Failed to leave the channel.',
  //               },
  //             });
  //           }
  //         });
  //         break;
  //     }
  //   }
  // }, [route.params]);

  useEffect(() => {
    if (query) {
      next();
    }
    if (queryOpenChannel) {
      fetchOpenChannel();
    }
  }, [query, queryOpenChannel, next, fetchOpenChannel]);

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
    dispatch({type: 'error', payload: {error: null}});
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
  channelHandler.onUserJoined = (channel, user) => {
    if (user.userId === sendbird.currentUser.userId) {
      dispatch({type: 'join-channel', payload: {channel}});
    }
  };
  channelHandler.onUserLeft = (channel, user) => {
    if (user.userId === sendbird.currentUser.userId) {
      dispatch({type: 'leave-channel', payload: {channel}});
    }
  };
  channelHandler.onChannelChanged = channel => {
    dispatch({type: 'update-channel', payload: {channel}});
  };
  channelHandler.onChannelDeleted = channel => {
    dispatch({type: 'delete-channel', payload: {channel}});
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

  const switchChannel = channel => {
    // Call the instance method of the result object in the "openChannel" parameter of the callback function.

    // The current user successfully enters the open channel,
    // and can chat with other users in the channel by using APIs.
    props.goToChat(channel);
  };

  const refresh = useCallback(() => {
    setQueryOpenChannel(sendbird.OpenChannel.createOpenChannelListQuery());
    setQuery(sendbird.GroupChannel.createMyGroupChannelListQuery());
    dispatch({type: 'refresh'});
  }, [sendbird.GroupChannel, sendbird.OpenChannel]);
  const next = useCallback(() => {
    if (query.hasNext) {
      dispatch({type: 'start-loading'});
      query.limit = 20;
      query.next((err, fetchedChannels) => {
        dispatch({type: 'end-loading'});
        if (!err) {
          dispatch({
            type: 'fetch-channels',
            payload: {channels: fetchedChannels},
          });
        } else {
          dispatch({
            type: 'error',
            payload: {
              error: 'Failed to get the channels.',
            },
          });
        }
      });
    }
  }, [query]);

  const fetchOpenChannel = useCallback(() => {
    if (queryOpenChannel.hasNext) {
      dispatch({type: 'start-loading'});
      queryOpenChannel.limit = 20;
      queryOpenChannel.next((err, fetchedChannels) => {
        dispatch({type: 'end-loading'});
        if (!err) {
          dispatch({
            type: 'fetch-open-channels',
            payload: {channels: fetchedChannels},
          });
        } else {
          dispatch({
            type: 'error',
            payload: {
              error: 'Failed to get the channels.',
            },
          });
        }
      });
    }
  }, [queryOpenChannel]);

  return (
    <Box
      style={[chatStyle.leftBox, {elevation: props.isCurrentScreen ? 3 : 1}]}>
      <SafeAreaView style={style.container}>
        <ChannelList
          title="Public channels"
          channels={state.openChannels}
          loading={state.loading}
          refresh={refresh}
          error={state.error}
          empty={state.empty}
          next={next}
          switchChannel={switchChannel}
        />
        <ChannelList
          title="Private channels"
          channels={state.channels}
          loading={state.loading}
          refresh={refresh}
          error={state.error}
          empty={state.empty}
          next={next}
          switchChannel={channel => switchChannel(channel)}
        />

        <Button backgroundColor={COLOR.blue}>New conversation</Button>
      </SafeAreaView>
    </Box>
  );
};

const style = {
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    color: 'white',
    alignSelf: 'center',
    margin: 10,
  },
  errorContainer: {
    backgroundColor: '#333',
    opacity: 0.8,
    padding: 10,
  },
  error: {
    color: '#fff',
  },
  loading: {
    position: 'absolute',
    right: 20,
    bottom: 20,
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
};

export default ChannelSelection;
