import React, {useState} from 'react'
import {SearchBar } from 'react-native-elements'

export default function renderHeader() {
    const [search, setSearch] = useState('');
    return <SearchBar 
            placeholder="Type Here..."  
            lightTheme round 
            onChangeText={setSearch}
            value={search}
            />;
};