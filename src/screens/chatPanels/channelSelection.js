import React, {
  useEffect,
  useState,
  useReducer,
  useCallback,
  useMemo,
} from 'react';
import {Box, Button, Spacer} from 'native-base';
import {channelsReducer} from '@reducers';
import {AppState, SafeAreaView} from 'react-native';
import {COLOR} from '@constants';
import {channelStyle, chatStyle} from '@styles';
import InviteModal from '@components/inviteModal';
import ChannelList from '@components/channelList';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ChannelSelection = props => {
  const {route, sendbird} = props;
  const {currentUser, channel} = route.params;
  const [queryGroupChannel, setQuery] = useState(null);
  const [queryOpenChannel, setQueryOpenChannel] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const [state, dispatch] = useReducer(channelsReducer, {
    sendbird,
    currentUser,
    userList: [],
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
    if (props.isCurrentScreen && !showInviteModal) {
      refresh();
    }
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
  channelHandler.onUserJoined = (currentChannel, user) => {
    if (user.userId === sendbird.currentUser.userId) {
      dispatch({type: 'join-channel', payload: {channel: currentChannel}});
    }
  };
  channelHandler.onUserLeft = (currentChannel, user) => {
    if (user.userId === sendbird.currentUser.userId) {
      dispatch({type: 'leave-channel', payload: {channel: currentChannel}});
    }
  };
  channelHandler.onChannelChanged = currentChannel => {
    dispatch({type: 'update-channel', payload: {channel: currentChannel}});
  };
  channelHandler.onChannelDeleted = currentChannel => {
    dispatch({type: 'delete-channel', payload: {channel: currentChannel}});
  };

  /** Handle reconnexion when the app return from background */
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
  const switchChannel = newChannel => {
    props.goToChat(newChannel);
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

  /** Dismiss the invitation modal, switch to the newly created channel
   *  and dismiss channel panel
   * @param newChannel the new chan created
   */
  const invitationDone = newChannel => {
    setShowInviteModal(false);
    if (newChannel) {
      switchChannel(newChannel);
    }
  };

  /** UI */
  const channelList = (
    <>
      <ChannelList
        currentChannel={channel}
        title="Public channels"
        channels={state.openChannels}
        loading={state.loading}
        refresh={refresh}
        error={state.error}
        empty={'No public channel'}
        next={fetchOpenChannel}
        switchChannel={switchChannel}
      />
      <ChannelList
        currentChannel={channel}
        title="Private channels"
        channels={state.channels}
        loading={state.loading}
        refresh={refresh}
        error={state.error}
        empty={'No private channel'}
        next={fetchGroupChannels}
        switchChannel={newChannel => switchChannel(newChannel)}
      />
    </>
  );

  const inviteModal = (
    <InviteModal
      {...props}
      title="Invite members"
      sendbird={sendbird}
      empty="No one to invite"
      showModal={showInviteModal}
      isCreating={true}
      onClose={newChan => invitationDone(newChan)}
    />
  );

  const inviteButton = (
    <Button
      onPress={() => setShowInviteModal(true)}
      backgroundColor={COLOR.blue}
      style={channelStyle.newButton}
      startIcon={<Icon name="add" color={'white'} size={24} />}>
      Create private channel
    </Button>
  );

  return (
    <Box
      // eslint-disable-next-line react-native/no-inline-styles
      style={[chatStyle.leftBox, {elevation: props.isCurrentScreen ? 3 : 1}]}>
      <SafeAreaView style={channelStyle.container}>
        {channelList}
        <Spacer />
        {inviteButton}
        {inviteModal}
      </SafeAreaView>
    </Box>
  );
};

export default ChannelSelection;
