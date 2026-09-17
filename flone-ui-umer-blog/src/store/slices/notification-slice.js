import { createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../custom_axios/axios'
import { baseURL } from '../../constants';

const initialState = {
  value: 0,
  notification: []
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setdefault: (state) => {
        state.value = 0;
        state.notification = [];
    },
    defaultnotification: (state, action)=> {
        state.notification = action.payload
    },
    defaultincrement: (state, action)=> {
      state.value = action.payload
    },
    increment: (state) => {
      state.value += 1
    },
  },
})

// Action creators are generated for each case reducer function
export const { increment, defaultincrement, defaultnotification, setdefault } = counterSlice.actions

export const fetchNotificationCount = () => async (dispatch) => {
    try {
      const response = await axiosInstance.get(`${baseURL}/get_all_notification/`);
      console.log("fetchNotificationCount", response.data)
      dispatch(defaultincrement(response.data.length));
      dispatch(defaultnotification(response.data));
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

export default counterSlice.reducer