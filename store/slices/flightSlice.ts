import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

export interface FlightState {
  departure: {
    from: string,
    to: string
  },
  selectedFlightToken: string | null,
  selectedFlightDetails: any | null
}

/**
 * Default state object with initial values.
 */
const initialState: FlightState = {
  departure: {
    from: '',
    to: ''
  },
  selectedFlightToken: null,
  selectedFlightDetails: null
} as const;

/**
 * Create a slice as a reducer containing actions.
 */
export const flightSlice = createSlice({
  name: 'flight',
  initialState,
  reducers: {
    setDeparture: (
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.departure>
    ) => {
      console.log(state.departure);
      state.departure = action.payload;
    },
    setSelectedFlightToken: (
      state: Draft<typeof initialState>,
      action: PayloadAction<string>
    ) => {
      state.selectedFlightToken = action.payload;
    },
    setSelectedFlightDetails: (
      state: Draft<typeof initialState>,
      action: PayloadAction<any>
    ) => {
      state.selectedFlightDetails = action.payload;
    },
    clearSelectedFlight: (state: Draft<typeof initialState>) => {
      state.selectedFlightToken = null;
      state.selectedFlightDetails = null;
    },
  },
});

// A small helper for `useSelector` function.
export const getFlightState = (state: { flight: FlightState }) => state.flight;

// Exports all actions
export const { setDeparture, setSelectedFlightToken, setSelectedFlightDetails, clearSelectedFlight } = flightSlice.actions;

export default flightSlice.reducer;