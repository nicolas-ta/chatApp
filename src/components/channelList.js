/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Box, Text, FlatList} from 'native-base';
import {RefreshControl} from 'react-native';
import Channel from './channel';
import {COLOR} from '../misc/constants';

const ChannelList = props => {
  return (
    <Box>
      <Text style={style.title}>{props.title}</Text>
      <FlatList
        data={props.channels}
        renderItem={({item}) => (
          <Channel
            key={item.url}
            channel={item}
            onPress={channel => props.switchChannel(channel)}
          />
        )}
        keyExtractor={item => item.url}
        refreshControl={
          <RefreshControl
            refreshing={props.loading}
            colors={[COLOR.yellow]}
            tintColor={COLOR.orange}
            onRefresh={props.refresh}
          />
        }
        contentContainerStyle={{flexGrow: 1}}
        ListHeaderComponent={
          props.error && (
            <Box style={style.errorContainer}>
              <Text style={style.error}>{props.error}</Text>
            </Box>
          )
        }
        ListEmptyComponent={
          <Box style={style.emptyContainer}>
            <Text style={style.empty}>{props.empty}</Text>
          </Box>
        }
        onEndReached={() => props.next()}
        onEndReachedThreshold={0.5}
      />
    </Box>
  );
};

const style = {
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    // fontWeight: '100',
    color: 'white',
    alignSelf: 'center',
    margin: 10,

    // backgroundColor: 'red',
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

export default ChannelList;
