import React, {useState} from 'react';
import {Text, Box, Badge} from 'native-base';
import {ColorPropType, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const noImage = require('../asset/no-avatar.png');

import {withAppContext} from '../context';
import {COLOR} from '../misc/constants';

const User = props => {
  const {user, selected, selectable, onSelect} = props;
  const [select, setSelect] = useState(selected);
  const onPress = () => {
    if (selectable) {
      setSelect(!select);
      onSelect(user);
    }
  };
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{
        ...style.container,
        backgroundColor: selected ? COLOR.blue : undefined,
      }}
      onPress={() => onPress()}>
      <Box style={style.profileImageContainer}>
        <Image
          source={user.profileUrl !== '' ? {uri: user.profileUrl} : noImage}
          style={style.profileImage}
        />
        {selected && (
          <Icon name="done" color={COLOR.blue} size={40} style={style.check} />
        )}
        {user.connectionStatus === 'online' && <Box style={style.badge} />}
      </Box>
      <Text style={style.nickname}>{user.nickname || '(Unnamed)'}</Text>
    </TouchableOpacity>
  );
};

const style = {
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginRight: 20,
    paddingTop: 15,
    paddingBottom: 8,
    alignItems: 'center',
    // borderRadius: 10,
  },
  profileImageContainer: {
    position: 'relative',
    width: 40,
    height: 40,
    marginRight: 12,
  },
  profileImage: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderWidth: 0,
    borderRadius: 20,
  },
  badge: {width: 10, height: 10, backgroundColor: COLOR.blue, borderRadius: 5},
  nickname: {
    fontSize: 18,
    color: 'white',
  },
};

export default withAppContext(User);
