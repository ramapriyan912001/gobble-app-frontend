import {useDispatch} from 'react-redux'
import {updateProfile} from '../actions/profile'

const dispatch = useDispatch();

export const submitProfile = (profile) => dispatch(updateProfile(profile))