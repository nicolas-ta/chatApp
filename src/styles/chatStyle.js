import {StyleSheet, Dimensions} from 'react-native';
import {COLOR} from '../misc/constants';

export default StyleSheet.create({
  container: {
    backgroundColor: 'black',
    // display: 'flex',
    // flexDirection: 'row',
    // height: '100%',
  },
  background: {
    backgroundColor: COLOR.darkBlue,
    width: '100%',
    height: '100%',
    elevation: 2,
    position: 'absolute',
  },
  header: {
    height: 70,
    backgroundColor: COLOR.darkBlue,
    opacity: 0.7,
    display: 'flex',
    flexDirection: 'row',
  },
  headerButton: {
    margin: 10,
    // height: 50,
    borderColor: 'white',
    color: 'white',
  },
  leftBox: {
    marginRight: Dimensions.get('window').width - 295,
    width: 295,
    height: '100%',
    position: 'absolute',
    backgroundColor: COLOR.blue,
    borderRadius: 10,
  },
  middleBox: {
    elevation: 4,
    // marginLeft: '-90%',
    borderRadius: 10,
    marginLeft: 5,
    width: Dimensions.get('window').width - 10,
    height: Dimensions.get('window').height - 10,
    backgroundColor: COLOR.darkBlue,
  },
  rightBox: {
    marginLeft: Dimensions.get('window').width - 295,
    width: 295,
    height: '100%',
    position: 'absolute',
    backgroundColor: COLOR.blue,
    borderRadius: 10,
  },
});
