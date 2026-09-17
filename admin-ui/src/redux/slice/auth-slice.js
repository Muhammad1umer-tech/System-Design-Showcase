
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  username: '',
  isAuthenticated: false,
  userPermissions: [] 
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    SetName: (state, action) => {
      state.username = action.payload
    },

    LoggedIn: (state) => {
      state.isAuthenticated = true
      console.log("LoggedIn ", state.isAuthenticated)
  },
    LoggedIn_Permission: (state, action) => {
        state.userPermissions = action.payload
        console.log("LoggedIn_Permission ", state.userPermissions)
    },

  },
})

export const { LoggedIn, LoggedIn_Permission, SetName } = counterSlice.actions


export default counterSlice.reducer