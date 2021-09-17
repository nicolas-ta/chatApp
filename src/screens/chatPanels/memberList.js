import React, {
  useEffect,
  useState,
  useReducer,
  useMemo,
  useCallback,
} from 'react';
import {Box, Text, FlatList, Button} from 'native-base';
import {AppState, SafeAreaView, RefreshControl} from 'react-native';
import {withAppContext} from '@src/context';
import {memberReducer} from '@reducers';
import InviteModal from '@components/inviteModal';
import User from '@components/user';
import {chatStyle, memberStyle} from '@styles';
import {COLOR} from '@constants';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MemberList = props => {
  const {route, navigation, sendbird} = props;
  const {currentUser, channel} = route.params;
  const [state, dispatch] = useReducer(memberReducer, {
    members:
      channel.channelType === 'group' ? channel.members : channel.participants,
    loading: false,
    error: '',
  });
  const [showInviteModal, setShowInviteModal] = useState(false);

  // on state change
  useEffect(() => {
    sendbird.addConnectionHandler('member', connectionHandler);
    sendbird.addChannelHandler('member', channelHandler);
    const event = AppState.addEventListener('change', handleStateChange);

    // Callback of Sendbird.connect
    const connectCallback = (err, _) => {
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
    };

    if (!sendbird.currentUser) {
      sendbird.connect(currentUser.userId, connectCallback);
    } else {
      refresh();
    }

    return () => {
      sendbird.removeConnectionHandler('member');
      sendbird.removeChannelHandler('member');
      event.remove();
      dispatch({type: 'end-loading'});
    };
  }, [
    channelHandler,
    connectionHandler,
    currentUser.userId,
    handleStateChange,
    refresh,
    sendbird,
  ]);

  // Update whenever the channel changes
  useEffect(() => {
    refresh();
  }, [refresh, route.params.channel]);

  /** on connection event  */
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
    if (props.isCurrentScreen) {
      refresh();

      // Refresh a second time to include the current User
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

  /** on channel event  */
  const channelHandler = useMemo(
    () => new sendbird.ChannelHandler(),
    [sendbird.ChannelHandler],
  );
  channelHandler.onUserJoined = (_, user) => {
    if (user.userId !== currentUser.userId) {
      dispatch({type: 'add-member', payload: {user}});
    }
  };
  channelHandler.onUserLeft = (_, user) => {
    if (user.userId !== currentUser.userId) {
      dispatch({type: 'remove-member', payload: {user}});
    } else {
      navigation.goBack();
    }
  };

  /** Handle background state and reconnexion */
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

  /** Query the participants of an open channel then dispatch */
  const fetchOpenChannelParticipants = useCallback(() => {
    var listQuery = channel.createParticipantListQuery();

    listQuery.next((error, participantList) => {
      dispatch({type: 'end-loading'});
      if (error) {
        // Handle error.
        dispatch({
          type: 'error',
          payload: {
            error: 'Connection failed. Please check the network status.',
          },
        });
      } else {
        dispatch({type: 'refresh', payload: {members: participantList}});
      }
    });
  }, [channel]);

  /** Refresh the participant or member list */
  const refresh = useCallback(() => {
    dispatch({type: 'start-loading'});

    // For open channels
    if (channel.channelType === 'open') {
      fetchOpenChannelParticipants();
      // For private/group channels
    } else {
      dispatch({type: 'end-loading'});
      dispatch({type: 'refresh', payload: {members: channel.members}});
    }
  }, [channel.channelType, channel.members, fetchOpenChannelParticipants]);

  /** UI */
  const title = (
    <Text style={memberStyle.title}>
      {channel.channelType === 'open' ? 'Online participants' : 'Members'}
    </Text>
  );

  const userList = (
    <FlatList
      data={state.members}
      renderItem={({item}) => <User user={item} />}
      keyExtractor={item => item.userId}
      // eslint-disable-next-line react-native/no-inline-styles
      contentContainerStyle={{flexGrow: 1}}
      refreshControl={
        <RefreshControl
          refreshing={state.loading}
          colors={[COLOR.yellow]}
          tintColor={COLOR.orange}
          onRefresh={refresh}
        />
      }
      ListHeaderComponent={
        state.error && (
          <Box style={memberStyle.errorContainer}>
            <Text style={memberStyle.error}>{state.error}</Text>
          </Box>
        )
      }
    />
  );

  const addMemberButton = (
    <Box>
      <Button
        onPress={() => setShowInviteModal(true)}
        backgroundColor={COLOR.blue}
        style={memberStyle.newButton}
        startIcon={<Icon name="person-add" color={'white'} size={24} F />}>
        Invite members
      </Button>
      <InviteModal
        {...props}
        title="Invite members"
        sendbird={sendbird}
        empty="No one to invite"
        showModal={showInviteModal}
        isCreating={false}
        onClose={() => {
          setShowInviteModal(false);
          props.resetPannel();
        }}
      />
    </Box>
  );

  return (
    <Box
      // eslint-disable-next-line react-native/no-inline-styles
      style={[chatStyle.rightBox, {elevation: props.isCurrentScreen ? 3 : 1}]}>
      <SafeAreaView style={memberStyle.container}>
        {title}
        {userList}
        {channel.channelType === 'group' ? addMemberButton : undefined}
      </SafeAreaView>
    </Box>
  );
};

export default withAppContext(MemberList);
