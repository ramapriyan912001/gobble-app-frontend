import 'react-native-gesture-handler/jestSetup';
import 'react-native/Libraries/Utilities/Platform';

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});
//-----TEMPLATE FOR MOCKS------
// jest.mock('SomeLibrary', () => {
//   return ({
//     MethodOne: jest.fn(() => 'Mocking 1'),
//     MethodTwo: jest.fn(() => 'Mocking 2'),
//   })
// });

// jest.mock('firebase', () => {
//   return ({
//     auth: {
//       signInWithEmailAndPassword: jest.fn((email, password) => {
//         if (email === 'shouldwork@email.com' && password === 'shouldwork') {
//           return Promise.resolve('Pass');
//         } else {
//           throw new Error('Fail');
//         }
//       })
//     },
//   })
// });

//-----EXAMPLE-----
// jest.mock('@react-native-community/AsyncStorage', () => {
//   return ({
//     shouldThrow: false,
//     getByKey: jest.fn(() => {
//       if (shouldThrow) {
//         throw new Error('Error Occurred while Getting')
//       }
//       return Promise.resolve('done');
//     }),
//     setByKey: jest.fn(() =>{
//       if (shouldThrow) {
//         throw new Error('Error occurred while Setting')
//       }
//       return Promise.resolve('setdone');
//     })
//   })
// });