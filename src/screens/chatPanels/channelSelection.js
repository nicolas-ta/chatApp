import React, {
  useEffect,
  useState,
  useReducer,
  useCallback,
  useMemo,
} from 'react';
import {Box, Button, Spacer} from 'native-base';
import chatStyle from '../../styles/chat.style';
import {channelsReducer} from '../../reducer/channels';
import ChannelList from '../../components/channelList';
import {AppState, SafeAreaView} from 'react-native';
import {COLOR} from '../../misc/constants';
import channelStyle from '../../styles/channel.style';

const ChannelSelection = props => {
  const {route, sendbird} = props;
  const {currentUser} = route.params;
  const [queryGroupChannel, setQuery] = useState(null);
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

  /** Refresh every time the userId change */
  useEffect(() => {
    sendbird.addConnectionHandler('channels', connectionHandler);
    sendbird.addChannelHandler('channels', channelHandler);
    const event = AppState.addEventListener('change', handleStateChange);
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
      event.remove();
    };
  }, [
    channelHandler,
    connectionHandler,
    currentUser.userId,
    handleStateChange,
    refresh,
    sendbird,
  ]);

  /** Refresh everytime the query for group or open channel change */
  useEffect(() => {
    if (queryGroupChannel) {
      fetchGroupChannels();
    }
    if (queryOpenChannel) {
      fetchOpenChannel();
    }
  }, [
    queryGroupChannel,
    queryOpenChannel,
    fetchGroupChannels,
    fetchOpenChannel,
  ]);

  /**  Connection Events */
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

  /** Channel events */
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

  /** Switch channel
   @param channel the selected channel in the channel selection panel
   */
  const switchChannel = channel => {
    props.goToChat(channel);
  };

  /** Refresh the channel panel */
  const refresh = useCallback(() => {
    setQueryOpenChannel(sendbird.OpenChannel.createOpenChannelListQuery());
    setQuery(sendbird.GroupChannel.createMyGroupChannelListQuery());
    dispatch({type: 'refresh'});
  }, [sendbird.GroupChannel, sendbird.OpenChannel]);

  /** Fetch all group channels with the user */
  const fetchGroupChannels = useCallback(() => {
    if (queryGroupChannel.hasNext) {
      dispatch({type: 'start-loading'});
      queryGroupChannel.limit = 10;
      queryGroupChannel.next((err, fetchedChannels) => {
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
  }, [queryGroupChannel]);

  /** Fetch all public channel */
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
      // eslint-disable-next-line react-native/no-inline-styles
      style={[chatStyle.leftBox, {elevation: props.isCurrentScreen ? 3 : 1}]}>
      <SafeAreaView style={channelStyle.container}>
        <ChannelList
          title="Public channels"
          channels={state.openChannels}
          loading={state.loading}
          refresh={refresh}
          error={state.error}
          empty={state.empty}
          next={fetchOpenChannel}
          switchChannel={switchChannel}
        />
        <ChannelList
          title="Private channels"
          channels={state.channels}
          loading={state.loading}
          refresh={refresh}
          error={state.error}
          empty={state.empty}
          next={fetchGroupChannels}
          switchChannel={channel => switchChannel(channel)}
        />
        <Spacer />
        <Button backgroundColor={COLOR.blue} style={channelStyle.newButton}>
          New conversation
        </Button>
      </SafeAreaView>
    </Box>
  );
};

export default ChannelSelection;
