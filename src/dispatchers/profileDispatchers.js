import {useDispatch} from 'react-redux'
import {updateProfile} from '../actions/profile'

export const submitProfile = (profile) => {
    const dispatch = useDispatch();
    dispatch(updateProfile(profile))
}