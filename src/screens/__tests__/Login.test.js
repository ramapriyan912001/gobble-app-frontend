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
        const { getByPlaceholderText, getByText, getByTestId, findByTestId } = localTree;

        //Assert
        expect(findByTestId('GobbleImage')).not.toThrow();
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
});