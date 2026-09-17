// ** Redux Imports
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist'
import storage from "redux-persist/lib/storage";
import CounterReducer from './slice/auth-slice'
import layout from "./layout";
import navbar from "./navbar";

const persistConfig = {
    key: "flone",
    version: 1.1,
    storage,
    blacklist: ["product"]
}

export const comReducer = combineReducers({
  layout,
  navbar,
  counter: CounterReducer,
});

const persistedReducer = persistReducer(persistConfig, comReducer);

const store = configureStore({
  reducer: persistedReducer, 
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});
const persistor = persistStore(store);
export { store, persistor };
