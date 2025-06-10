import { createSlice } from "@reduxjs/toolkit";

const errorSlice = createSlice(
    {
        name: 'formError',
        initialState: {
            email: '',
            password: '',
            confirmpassword: ''
        },
        reducers: {
            setEmailError:  (state, action) => {state.email = action.payload},
            clearEmailError: state => {state.email = ''},

            setPasswordError:   (state, action) => { state.password = action.payload },
            clearPasswordError: state => { state.password = '' },

            setConfirmpassword: (state, action) => {state.confirmpassword = action.payload},
            clearConfirmPwError: state => {state.password = ''},

            // Delete all errors
            clearAllErrors: state => {
                state.email = '';
                state.password = '';
                state.confirmpassword = '';
            }
        }
    }
)

export const {
  setEmailError,
  clearEmailError,
  setPasswordError,
  clearPasswordError,
  setConfirmpassword,
  clearConfirmPwError,
  clearAllErrors
} = errorSlice.actions;

export default errorSlice.reducer;
