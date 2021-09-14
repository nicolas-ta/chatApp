import React from 'react';
import {Box, Text, FlatList} from 'native-base';
import {RefreshControl} from 'react-native';
import Channel from './channel';
import {COLOR} from '../misc/constants';
import channelStyle from '../styles/channel.style';

const ChannelList = props => {
  return (
    <Box>
      <Text style={channelStyle.title}>{props.title}</Text>
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
        contentContainerStyle={channelStyle.channelListContentContainer}
        ListHeaderComponent={
          props.error && (
            <Box style={channelStyle.errorContainer}>
              <Text style={channelStyle.error}>{props.error}</Text>
            </Box>
          )
        }
        ListEmptyComponent={
          <Box style={channelStyle.emptyContainer}>
            <Text style={channelStyle.empty}>{props.empty}</Text>
          </Box>
        }
        onEndReached={() => props.next()}
        onEndReachedThreshold={0.5}
      />
    </Box>
  );
};

export default ChannelList;
