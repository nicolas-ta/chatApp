import React, {useEffect, useReducer, useMemo, useCallback} from 'react';
import {Box, Text, FlatList} from 'native-base';
import {AppState, SafeAreaView, RefreshControl} from 'react-native';
import {withAppContext} from '../../context';
import {memberReducer} from '../../reducer/member';
import User from '../../components/user';
import chatStyle from '../../styles/chat.style';
import memberStyle from '../../styles/member.style';
import {COLOR} from '../../misc/constants';

const MemberList = props => {
  const {route, navigation, sendbird} = props;
  const {currentUser, channel} = route.params;
  const [state, dispatch] = useReducer(memberReducer, {
    members:
      channel.channelType === 'group' ? channel.members : channel.participants,
    loading: false,
    error: '',
  });
  // on state change
  useEffect(() => {
    sendbird.addConnectionHandler('member', connectionHandler);
    sendbird.addChannelHandler('member', channelHandler);
    const event = AppState.addEventListener('change', handleStateChange);
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

  // When route.params change
  useEffect(() => {
    refresh();
  }, [refresh, route.params.channel]);

  /** on connection event  */
  const connectionHandler = useMemo(
    () => new sendbird.ConnectionHandler(),
    [sendbird.ConnectionHandler],
  );

  connectionHandler.onReconnectStarted = () => {
    console.log('nico: onReconnectStarted');
    dispatch({
      type: 'error',
      payload: {
        error: 'Connecting..',
      },
    });
  };
  connectionHandler.onReconnectSucceeded = () => {
    console.log('nico: onReconnectSucceeded');
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
    dispatch({type: 'start-loading'});

    if (channel.channelType === 'open') {
      var listQuery = channel.createParticipantListQuery();

      listQuery.next((error, participantList) => {
        dispatch({type: 'end-loading'});
        if (error) {
          // Handle error.
          console.log('nico: error :', error.message);
          return;
        }
        console.log('nico: participantList:', participantList);

        dispatch({type: 'refresh', payload: {members: participantList}});
      });
    } else {
      dispatch({type: 'end-loading'});
      console.log('nico: channel.members:', channel.members),
        dispatch({type: 'refresh', payload: {members: channel.members}});
    }
  }, [channel]);

  return (
    <Box
      // eslint-disable-next-line react-native/no-inline-styles
      style={[chatStyle.rightBox, {elevation: props.isCurrentScreen ? 3 : 1}]}>
      <SafeAreaView style={style.container}>
        <Text style={memberStyle.title}>
          {channel.channelType === 'open' ? 'Online participants' : 'Members'}
        </Text>

        <FlatList
          data={state.members}
          renderItem={({item}) => <User user={item} />}
          keyExtractor={item => item.userId}
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
              <Box style={style.errorContainer}>
                <Text style={style.error}>{state.error}</Text>
              </Box>
            )
          }
        />
      </SafeAreaView>
    </Box>
  );
};

const style = {
  container: {
    flex: 1,
  },
  inviteButton: {
    marginRight: 12,
  },
  errorContainer: {
    backgroundColor: '#333',
    opacity: 0.8,
    padding: 10,
  },
  error: {
    color: '#fff',
  },
};

export default withAppContext(MemberList);
