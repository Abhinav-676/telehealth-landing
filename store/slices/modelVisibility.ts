import { createSlice } from '@reduxjs/toolkit';

export const visibilitySlice = createSlice({
    name: 'visibility',
    initialState: {value: false},
    reducers: {
        setTrue: (state) => {
            state.value = true;
        },

        setFalse: (state) => {
            state.value = false
        }
    }
})

export const {setTrue, setFalse} = visibilitySlice.actions;
export default visibilitySlice.reducer;