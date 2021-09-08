import {StyleSheet} from 'react-native';
import {COLOR} from '../misc/constants';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'stretch',
    backgroundColor: COLOR.darkBlue,
  },
  mainWrapper: {
    display: 'flex',
    flexDirection: 'column',
    marginHorizontal: 50,
    // width: '50%',
  },
  loginButton: {
    marginTop: 10,
    backgroundColor: COLOR.red,
  },
  logoTitle: {
    textAlign: 'center',
    color: COLOR.red,
    marginBottom: 80,
  },
  spinner: {
    marginTop: 10,
  },
  loginError: {
    marginTop: 10,
    fontSize: 18,
    color: COLOR.orange,
    textAlign: 'center',
    alignSelf: 'stretch',
    marginBottom: 10,
  },
});
