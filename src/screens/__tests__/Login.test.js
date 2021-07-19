import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Login from '../Login';
import renderer from 'react-test-renderer';

test('should render correctly', () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(<Login/>);
    getByTestId('GobbleImage');
    getByPlaceholderText('Email');
    getByPlaceholderText('Password');
    getByTestId('ToForgotPasswordButton');
    getByText('Forgot Password?');
    getByTestId('LoginButton');
    getByText('Log In');
    getByTestId('ToWelcomeButton');
    getByText('Back');
});


// describe('<Login />', () => {
//     it('should render correctly', () => {
//         const tree = renderer.create(<Login />).toJSON();
//         expect(tree).toMatchSnapshot();
//       });

//     it('renders default elements', () => {
//         const { getByPlaceholderText, getByText, getByTestId } = render(<Login/>);
//         getByTestId('GobbleImage');
//         getByPlaceholderText('Email');
//         getByPlaceholderText('Password');
//         getByTestId('ToForgotPasswordButton');
//         getByText('Forgot Password?');
//         getByTestId('LoginButton');
//         getByText('Log In');
//         getByTestId('ToWelcomeButton');
//         getByText('Back');
//     });


//     it('can navigate to ForgotPassword', () => {
//         const navigateMock = jest.fn();
//         const { getByTestId } = render(<Login navigation={{ navigate: navigateMock }}/>);

//         fireEvent.press(getByTestId('ToForgotPasswordButton'));
//         expect(navigateMock).toBeCalledWith('ForgotPassword');
//     });

//     it('can navigate to welcome', () => {
//         const navigateMock = jest.fn();
//         const { getByTestId } = render(<Login navigation={{ navigate: navigateMock }}/>);

//         fireEvent.press(getByTestId('ToWelcomeButton'));
//         expect(navigateMock).toBeCalledWith('Welcome');
//     });
// });