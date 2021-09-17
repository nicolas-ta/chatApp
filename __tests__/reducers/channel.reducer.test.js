import {channelReducer} from '@reducers/channel';

const channel1 = {
  url: 'url1',
  lastMessage: 'lastMessage1',
  createdAt:
    'Fri Sep 17 2021 15:43:14 GMT+0200 (heure d’été d’Europe centrale)',
};
const channel2 = {
  url: 'url2',
  lastMessage: 'lastMessage2',
  createdAt:
    'Fri Sep 17 2021 15:43:26 GMT+0200 (heure d’été d’Europe centrale)',
};
const channel3 = {
  url: 'url3',
  lastMessage: 'lastMessage3',
  createdAt:
    'Fri Sep 17 2021 15:50:50 GMT+0200 (heure d’été d’Europe centrale)',
};

describe('Channel Reducer unit tests', () => {
  test('checking initial state', () => {
    const action = {type: 'nonexistant'};
    expect(channelReducer(undefined, action)).toMatchSnapshot();
  });

  test('checking refresh state', () => {
    const action = {type: 'refresh'};
    expect(channelReducer(undefined, action)).toMatchSnapshot();
  });

  test('checking fetch-channels empty state', () => {
    const action = {
      type: 'fetch-channels',
    };
    const state = {channels: [channel1], channelMap: {}};
    expect(channelReducer(state, action)).toMatchSnapshot();
  });

  test('checking fetch-channels state', () => {
    const action = {
      type: 'fetch-channels',
      payload: {channels: [channel1, channel2]},
    };
    const state = {channels: [channel1, channel2, channel3], channelMap: {}};
    expect(channelReducer(state, action)).toMatchSnapshot();
  });

  test('checking fetch-open-channels state', () => {
    const action = {type: 'fetch-open-channels'};
    const state = {openChannels: []};
    expect(channelReducer(state, action)).toMatchSnapshot();
  });

  test('checking fetch-open-channels with channels state', () => {
    const action = {
      type: 'fetch-open-channels',
      payload: {channels: [channel1, channel2]},
    };
    const state = {
      openChannels: [channel1, channel2],
      openChannelMap: {channel2},
    };
    expect(channelReducer(state, action)).toMatchSnapshot();
  });

  test('checking join-channel state', () => {
    const action = {type: 'join-channel'};
    const state = {channelMap: [], channels: []};

    expect(channelReducer(state, action)).toMatchSnapshot();
  });

  test('checking join-channel with channel state', () => {
    const action = {type: 'join-channel', payload: {channel: channel1}};
    const state = {
      channelMap: {channel1},
      channels: [channel1, channel2],
    };
    expect(channelReducer(state, action)).toMatchSnapshot();
  });

  test('checking update-channel state', () => {
    const action = {type: 'update-channel'};
    const state = {
      channelMap: {channel1},
      channels: [channel1, channel2],
    };

    expect(channelReducer(state, action)).toMatchSnapshot();
  });

  test('checking update-channel with channel state', () => {
    const action = {type: 'update-channel', payload: {channel: channel1}};
    const state = {
      channelMap: {channel1},
      channels: [channel1, channel2],
    };

    expect(channelReducer(state, action)).toMatchSnapshot();
  });

  test('checking leave-channel state', () => {
    const action = {type: 'leave-channel'};
    const state = {channels: []};

    expect(channelReducer(state, action)).toMatchSnapshot();
  });

  test('checking delete-channel state', () => {
    const action = {type: 'delete-channel', payload: {channel: channel1}};
    const state = {channels: [channel1, channel2]};

    expect(channelReducer(state, action)).toMatchSnapshot();
  });

  test('checking start-loading state', () => {
    const action = {type: 'start-loading'};
    expect(channelReducer(undefined, action)).toMatchSnapshot();
  });

  test('checking end-loading state', () => {
    const action = {type: 'end-loading'};
    expect(channelReducer(undefined, action)).toMatchSnapshot();
  });

  test('checking error state', () => {
    const action = {type: 'error'};
    expect(channelReducer(undefined, action)).toMatchSnapshot();
  });
});
