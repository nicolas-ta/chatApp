import React, {useEffect, useReducer, useCallback} from 'react';
import {Box, Button, Modal, Text, FlatList, Spinner, Center} from 'native-base';
import {COLOR} from '@constants';
import {channelStyle} from '@styles';
import {User} from '@components';
import {inviteReducer} from '@reducers';
import {withAppContext} from '@src/context';

const InviteModal = props => {
  const {route, showModal, sendbird, isCreating, title} = props;
  const {currentUser, channel} = route.params;

  const [state, dispatch] = useReducer(inviteReducer, {
    users: [],
    userMap: {},
    selectedUsers: [],
    loading: false,
    error: '',
  });

  /** Fetch the user list to invite */
  useEffect(() => {
    fetchUserList();
  }, [fetchUserList]);

  const fetchUserList = useCallback(() => {
    dispatch({type: 'start-loading'});
    // Retrieving all users
    var listQuery = sendbird.createApplicationUserListQuery();
    listQuery.limit = 100; // The value of pagination limit could be set up to 100.

    listQuery.next((error, users) => {
      if (error) {
        dispatch({
          type: 'error',
          payload: {
            error: error.message,
          },
        });
      } else {
        if (users) {
          const clone = [...users];
          var filteredUsers = clone.filter(item => {
            return item.userId !== currentUser.userId && item.nickname !== '';
          });
          if (!isCreating) {
            filteredUsers = filteredUsers.filter(
              user =>
                !channel.members.some(member => {
                  return member.userId === user.userId;
                }),
            );
          }
          dispatch({type: 'fetch-users', payload: {users: filteredUsers}});
        }
        dispatch({type: 'end-loading'});
      }
    });
  }, [channel.members, currentUser.userId, isCreating, sendbird]);

  const createGroupChannel = () => {
    if (state.selectedUsers.length > 0) {
      dispatch({type: 'start-loading'});
      const params = new sendbird.GroupChannelParams();
      params.addUsers(state.selectedUsers);
      params.isDistinct = true;
      sendbird.GroupChannel.createChannel(params, (err, channel) => {
        if (!err) {
          dispatch({type: 'reset-selection'});
          props.onClose(channel);
        } else {
          dispatch({type: 'end-loading'});
          dispatch({
            type: 'error',
            payload: {
              error: err.message,
            },
          });
        }
      });
    }
  };

  const invite = () => {
    if (state.selectedUsers.length > 0) {
      dispatch({type: 'start-loading'});

      channel.invite(state.selectedUsers, (err, _) => {
        if (!err) {
          dispatch({type: 'reset-selection'});
          props.onClose();
        } else {
          dispatch({
            type: 'error',
            payload: {
              error: err.message,
            },
          });
        }
      });
    } else {
      dispatch({
        type: 'error',
        payload: {
          error: 'Select at least 1 user to invite.',
        },
      });
    }
  };

  const onSelect = user => {
    if (!state.selectedUsers.includes(user)) {
      dispatch({type: 'select-user', payload: {user}});
    } else {
      dispatch({type: 'unselect-user', payload: {user}});
    }
  };

  const userList = (
    <FlatList
      data={state.users}
      renderItem={({item}) => (
        <User
          user={item}
          onSelect={onSelect}
          selectable={true}
          selected={state.selectedUsers.includes(item)}
        />
      )}
      keyExtractor={item => item.userId}
      contentContainerStyle={channelStyle.channelListContentContainer}
      ListHeaderComponent={
        state.error && (
          <Box style={channelStyle.errorContainer}>
            <Text style={channelStyle.error}>{state.error}</Text>
          </Box>
        )
      }
      ListEmptyComponent={
        <Box style={channelStyle.emptyContainer}>
          <Text style={channelStyle.empty}>{props.empty}</Text>
        </Box>
      }
    />
  );

  const modal = (
    <Modal
      isOpen={showModal}
      onClose={() => {
        dispatch({type: 'reset-selection'});
        props.onClose();
      }}>
      <Modal.Content maxWidth="350px" backgroundColor={COLOR.darkBlue}>
        <Modal.CloseButton />
        <Modal.Header>
          <Text color={COLOR.blue}>{title}</Text>
        </Modal.Header>
        {state.loading ? (
          <Center padding={10}>
            <Spinner padding={5} color={COLOR.yellow} />
            <Text color="white">Fetching users ...</Text>
          </Center>
        ) : (
          userList
        )}
        <Modal.Footer>
          <Button.Group variant="ghost" space={2}>
            <Button
              onPress={() => {
                dispatch({type: 'reset-selection'});
                props.onClose();
              }}>
              <Text style={{color: COLOR.red}}>Cancel</Text>
            </Button>
            <Button
              onPress={() => {
                isCreating ? createGroupChannel() : invite();
              }}>
              <Text style={{color: COLOR.blue}}>Invite</Text>
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );

  return modal;
};

export default withAppContext(InviteModal);
