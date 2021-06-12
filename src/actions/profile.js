import {UPDATE_AVATAR, UPDATE_CUISINE_PREFERENCE, 
    UPDATE_DIETARY_RESTRICTION, UPDATE_DOB, UPDATE_EMAIL, 
    UPDATE_PASSWORD, UPDATE_LOCATION_PREFERENCE, UPDATE_NAME, UPDATE_CROSS_INDUSTRY_PREFERENCE, UPDATE_PROFILE} from './types'


export const updateAvatar = (avatar) => {
    return {
        type: UPDATE_AVATAR,
        data: avatar,
    }
};

export const updateCuisinePreference = (cuisinePreference) => {
    return {
        type: UPDATE_CUISINE_PREFERENCE,
        data: cuisinePreference,
    }
}

export const updateDietaryRestriction = (dietaryRestriction) => {
    return {
        type: UPDATE_DIETARY_RESTRICTION,
        data: dietaryRestriction,
    }
}

export const updateDOB = (dob) => {
    return {
        type: UPDATE_DOB,
        data: dob,
    }
}

export const updateEmail = (email) => {
    return {
        type: UPDATE_EMAIL,
        data: email,
    }
} 

export const updateName = (name) => {
    return {
        type: UPDATE_NAME,
        data: name,
    }
}

export const updateLocationPreference = (locationPreference) => {
    return {
        type: UPDATE_LOCATION_PREFERENCE,
        data: locationPreference,
    }
}

export const updatePassword = (password) => {
    return {
        type: UPDATE_PASSWORD,
        data: password
    }
}

export const updateCrossIndustryPreference = (crossIndustryPreference) => {
    return {
        type: UPDATE_CROSS_INDUSTRY_PREFERENCE,
        data: crossIndustryPreference,
    }
}

export const updateProfile = (profile) => {
    return {
        type: UPDATE_PROFILE,
        data: profile
    }
}