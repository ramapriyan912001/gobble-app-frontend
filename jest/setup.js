// import 'react-native-gesture-handler/jestSetup';
// import {ScrollView} from '../src/screens/__mocks__/react-native';

// jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

// jest.mock('react-native-reanimated', () => {
//   const Reanimated = require('react-native-reanimated/mock');

//   // The mock for `call` immediately calls the callback which is incorrect
//   // So we override it with a no-op
//   Reanimated.default.call = () => {};

//   return Reanimated;
// });

// jest.mock('ScrollView', () => {
//     const MockScrollView = require.requireMock('ScrollViewMock');
//     const React = require('React');  
//     const RealScrollView = require.requireActual('ScrollView');
//     class ScrollView extends React.Component {
//       scrollTo() {
//       }
  
//       render() {
//         return (
//           <MockScrollView {...this.props} />
//         );
//       }
//     }
//     ScrollView.propTypes = RealScrollView.propTypes;
//     return ScrollView;
//   });