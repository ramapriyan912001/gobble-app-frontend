import '../node_modules/react-native/Libraries/Components/ScrollView/ScrollView';
import mockScrollView from 'react-native/jest/mockScrollView';
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

//Official ScrollView Mock
jest.mock('../node_modules/react-native/Libraries/Components/ScrollView/ScrollView.js', () => {
  // const MockScrollView = require.requireMock('ScrollViewMock');
  const React = require('React');  
  const RealScrollView = require.requireActual('../node_modules/react-native/Libraries/Components/ScrollView/ScrollView.js');
  class ScrollView extends React.Component {
    scrollTo() {
    }

    render() {
      return (
        <mockScrollView {...this.props} />
      );
    }
  }
  ScrollView.propTypes = RealScrollView.propTypes;
  return ScrollView;
});