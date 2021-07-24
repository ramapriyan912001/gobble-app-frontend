import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Login from '../Login';
import renderer from 'react-test-renderer';
import {jest, expect} from '@jest/globals';

describe('<Login />', () => {
    // it('should render correctly', () => {
    //     const tree = renderer.create(<Login />).toJSON();
    //     expect(tree).toMatchSnapshot();
    //   });

    let tree;

    beforeEach(() => {
        tree = render(<Login/>)
    })

    test("snapshot", () => {
        expect(tree).toMatchSnapshot();
    })

    test("renders default elements", () => {
        //Act
        const localTree = render(<Login/>);
        const { getByPlaceholderText, getByText, getByTestId } = localTree;

        //Assert
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


    it('can navigate to ForgotPassword', () => {
        const navigateMock = jest.fn();
        const { getByTestId } = render(<Login navigation={{ navigate: navigateMock }}/>);
        fireEvent.press(getByTestId('ToForgotPasswordButton'));
        expect(navigateMock).toBeCalledWith('ForgotPassword');
    });

    it('can navigate to welcome', () => {
        const navigateMock = jest.fn();
        const { getByTestId } = render(<Login navigation={{ navigate: navigateMock }}/>);

        fireEvent.press(getByTestId('ToWelcomeButton'));
        expect(navigateMock).toBeCalledWith('Welcome');
    });

    it('calls firebase auth with the right info when text is entered', () => {
        //Act
        const { getByTestId , getByPlaceholderText } = render(<Login/>);
        
        //Assert
        fireEvent.changeText(getByPlaceholderText('Email'), 'shouldwork@email.com');
        fireEvent.changeText(getByPlaceholderText('Password', 'shouldwork'));
        console.log((getByTestId('LoginButton')))
        expect(fireEvent.press(getByTestId('LoginButton'))).not.toThrow();
    });


    //throws an error when no email is entered

    //throws an error when no password is entered
});