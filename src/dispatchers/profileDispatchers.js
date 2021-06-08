import {useDispatch} from 'react-redux'

const dispatch = useDispatch();

export const submitProfile = (profile) => dispatch(updateProfile(profile))