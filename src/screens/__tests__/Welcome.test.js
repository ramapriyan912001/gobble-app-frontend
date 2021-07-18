import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Welcome from '../Welcome';
import { expect, it, jest } from '@jest/globals';

// const gobbleImg = jest.mock('../../images/gobble.png');

describe('<Welcome />', () => {
    it('renders default elements', () => {
        const { getByText, getByTestId } = render(<Welcome/>);
        getByTestId('GobbleImage');
        getByText('Connecting People Over Food.');
        getByText('Already have an Account?');
        getByText('Sign Up');
    });

    it('can navigate to login', () => {
        const navigateMock = jest.fn();
        const { getByTestId } = render(<Welcome navigation={{ navigate: navigateMock }}/>);

        fireEvent.press(getByTestId('ToLoginButton'));
        expect(navigateMock).toBeCalledWith('Login');
    });

    it('can navigate to register', () => {
        const navigateMock = jest.fn();
        const { getByTestId } = render(<Welcome navigation={{ navigate: navigateMock }}/>);

        fireEvent.press(getByTestId('ToRegisterButton'));
        expect(navigateMock).toBeCalledWith('RegisterNavigator');
    });
});