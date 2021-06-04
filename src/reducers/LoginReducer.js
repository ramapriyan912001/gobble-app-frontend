import {UPDATE_AVATAR, UPDATE_CUISINE_PREFERENCE, 
    UPDATE_DIETARY_RESTRICTION, UPDATE_DOB, UPDATE_EMAIL, 
    UPDATE_PASSWORD, UPDATE_LOCATION_PREFERENCE, UPDATE_NAME} from '../actions/types'

const initialState = {
    name: '',
    dob: '',
    diet: 'Halal',
    cuisine:  'Indian',
    crossIndustry: false,
    location: '',
    avatar: '',
    email: '',
    password: '',
};

const loginReducer = (state = initialState, action) => {
    switch(action.type) {
        case UPDATE_AVATAR:
        return {
            ...state,
            avatar: action.data
        }
        case UPDATE_NAME:
        return {
            ...state,
            name: action.data
        }
        case UPDATE_EMAIL:
        return {
            ...state,
            email: action.data
        }
        case UPDATE_PASSWORD:
        return {
            ...state,
            password: action.data
        }
        case UPDATE_DOB:
        return {
            ...state,
            dob: action.data
        }
        case UPDATE_DIETARY_RESTRICTION:
        return {
            ...state,
            diet: action.UPDATE_DIETARY_RESTRICTION
        }
        case UPDATE_CUISINE_PREFERENCE:
        return {
            ...state,
            cuisine: action.data
        }
        case UPDATE_LOCATION_PREFERENCE:
        return {
            ...state,
            location: action.data
        }
        case UPDATE_CROSS_INDUSTRY_PREFERENCE:
        return {
            ...state,
            crossIndustry: action.data
        }
    }
}