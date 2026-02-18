import { configureStore } from '@reduxjs/toolkit';
import flightSlice from '@/store/slices/flightSlice';
import {
  useDispatch as useDispatchBase,
  useSelector as useSelectorBase,
} from 'react-redux';

/**
 * Creates a store and includes all the slices as reducers.
 */
export const store = configureStore({
  reducer: {
    flight: flightSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: { flights: FlightsState}
export type AppDispatch = typeof store.dispatch;

// Since we use typescript, lets utilize `useDispatch`
export const useDispatch = () => useDispatchBase<AppDispatch>();

// And utilize `useSelector`
export const useSelector = <TSelected = unknown>(
  selector: (state: RootState) => TSelected
): TSelected => useSelectorBase<RootState, TSelected>(selector);


// import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'

// import flightReducer from '@/store/slices/flightSlices'

// export function makeStore() {
//   return configureStore({
//     reducer: { flight: flightReducer },
//   })
// }

// const store = makeStore()

// export type AppState = ReturnType<typeof store.getState>

// export type AppDispatch = typeof store.dispatch

// export type AppThunk<ReturnType = void> = ThunkAction<
//   ReturnType,
//   AppState,
//   unknown,
//   Action<string>
// >

// export default store