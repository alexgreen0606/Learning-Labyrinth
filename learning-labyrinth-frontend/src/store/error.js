import { createSlice } from '@reduxjs/toolkit'

// Create the error object to be maintained in the redux store
const slice = createSlice({
    name: 'error',
    initialState: {
        displayError: false,
        message: null
    },
    reducers: {
        setError: (state, action) => {
            state.displayError = true;
            state.message = action.payload;
        },
        clearError: (state) => {
            state.displayError = false;
            state.message = null;
        },
    },
});
export default slice.reducer

const { setError, clearError } = slice.actions

/**
 * Sets the current error message displayed in the snackbar.
 */
export const showError = (message) => dispatch => {
    dispatch(setError(message))
}

/**
 * Removes the current error message displayed in the snackbar.
 */
export const hideError = () => dispatch => {
    dispatch(clearError())
}