import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { callFlightHistoryAPI } from '@/lib/axiosHelper'

interface FlightSearchParams {
  fromId?: string
  toId?: string
  departDate?: string
  returnDate?: string
  adults?: number
  children?: string
  cabinClass?: string
  currency_code?: string
}

interface FlightSegment {
  originIata: string
  originName: string
  destinationIata: string
  destinationName: string
  departureDateTime: string
  arrivalDateTime: string
  journeyDuration: number
  cabinClass: string
  airline: {
    code: string
    flightNumber: string
    name: string
  }
  mealCode: string
}

interface FlightLeg {
  departureDateTime: string
  arrivalDateTime: string
  durationInMinutes: number
  stopCount: number
  carriers: {
    name: string
    imageUrl: string
  }[]
  segments: FlightSegment[]
  baggage?: {
    cabin?: string
    checkin?: string
  }
}

interface BookingDetails {
  bookingId: string
  pnr: string
  totalPrice: number
  status: string
  createdAt: string
  paymentMethod?: string
  paymentReference?: string
  flightNumber?: string
  airline?: string
  origin?: string
  destination?: string
  departureTime?: string
  arrivalTime?: string
}

interface SelectedFlightData {
  token?: string
  id: string
  fareSourceCode: string
  price: {
    amount: number
    unit: string
  }
  priceBreakdowns: {
    label: string
    amount: string
  }[]
  date: string[]
  firstLeg: FlightLeg
  secondLeg?: FlightLeg
  savedAt: number
  expiresAt: number
}

interface PassengerData {
  fullname: string
  email: string
  phone: string
  title: string
  nationality: string
  passportNumber: string
  dateOfBirth: string
  passportIssued?: string
  passportCountry?: string
  passportExpiry?: string
}

interface BookingDetails {
  bookingId: string
  pnr: string
  totalPrice: number
  status: string
  createdAt: string
}

interface FlightHistoryResponse {
  success: boolean
  data?: any
  message?: string
}

interface FlightStore {
  searchParams: FlightSearchParams | null
  setSearchParams: (params: FlightSearchParams) => void

  selectedFlight: SelectedFlightData | null
  setSelectedFlight: (flightData: SelectedFlightData) => void
  clearSelectedFlight: () => void

  passengerData: PassengerData | null
  setPassengerData: (data: PassengerData) => void
  clearPassengerData: () => void

  bookingDetails: BookingDetails | null
  setBookingDetails: (data: BookingDetails) => void
  clearBookingDetails: () => void

  isTokenExpired: () => boolean

  createFlightBooking: (bookingData: any) => Promise<FlightHistoryResponse>
  confirmFlightBooking: (id_flight_booking: number) => Promise<FlightHistoryResponse>
  saveFlightPayment: (paymentData: any) => Promise<FlightHistoryResponse>
  cancelFlightBooking: (id_flight_booking: number, reason?: string) => Promise<FlightHistoryResponse>
  getFlightHistory: (id_customer?: number) => Promise<FlightHistoryResponse>
  getBookingDetail: (id_flight_booking: number) => Promise<FlightHistoryResponse>

  clearAll: () => void
}

export const useFlightStore = create<FlightStore>()(
  persist(
    (set, get) => ({
      searchParams: null,
      selectedFlight: null,
      passengerData: null,
      bookingDetails: null,

      setSearchParams: (params) => set({ searchParams: params }),

      setSelectedFlight: (flightData) => {
        const expiresAt = flightData.token ? Date.now() + 30 * 60 * 1000 : 0
        set({
          selectedFlight: {
            ...flightData,
            savedAt: Date.now(),
            expiresAt
          }
        })
      },

      clearSelectedFlight: () => set({ selectedFlight: null }),
      setPassengerData: (data) => set({ passengerData: data }),
      clearPassengerData: () => set({ passengerData: null }),
      setBookingDetails: (data) => set({ bookingDetails: data }),
      clearBookingDetails: () => set({ bookingDetails: null }),

      isTokenExpired: () => {
        const { selectedFlight } = get()
        if (!selectedFlight?.token) return true
        if (!selectedFlight.expiresAt) return true
        return Date.now() > selectedFlight.expiresAt
      },

      createFlightBooking: async (bookingData) => {
        try {
          console.log('📝 Creating flight booking...')

          // Payload minimal sesuai backend utama
          const payload = {
            id_customer: bookingData.id_customer,
            mfref: bookingData.mfref,
          }

          const result = await callFlightHistoryAPI(
            '/flight-booking/store',
            'POST',
            payload,
            true
          )

          if (result.ok) {
            console.log('✓ Flight booking created successfully')
            if (result.data?.id_flight_booking) {
              set({ 
                bookingDetails: {
                  bookingId: result.data.id_flight_booking,
                  pnr: result.data.booking_reference || '',
                  totalPrice: result.data.total_price || 0,
                  status: result.data.status || 'pending',
                  createdAt: result.data.created_at || new Date().toISOString()
                }
              })
            }
            return {
              success: true,
              data: result.data
            }
          } else {
            console.error('✗ Failed to create flight booking:', result.error)
            return {
              success: false,
              message: result.error
            }
          }
        } catch (error: any) {
          console.error('✗ Error creating flight booking:', error)
          return {
            success: false,
            message: error?.message || 'Failed to create booking'
          }
        }
      },

      confirmFlightBooking: async (id_flight_booking) => {
        try {
          console.log('✅ Confirming flight booking...')

          const result = await callFlightHistoryAPI(
            '/flight-booking/confirm',
            'POST',
            { id_flight_booking },
            true
          )

          if (result.ok) {
            console.log('✓ Flight booking confirmed successfully')
            return { success: true, data: result.data }
          } else {
            console.error('✗ Failed to confirm flight booking:', result.error)
            return { success: false, message: result.error }
          }
        } catch (error: any) {
          console.error('✗ Error confirming flight booking:', error)
          return { success: false, message: error?.message || 'Failed to confirm booking' }
        }
      },

      saveFlightPayment: async (paymentData) => {
        try {
          console.log('💳 Processing payment...')

          const payload = {
            id_flight_booking: paymentData.id_flight_booking,
            amount: paymentData.amount,
            payment_method: paymentData.payment_method || 'credit_card',
            transaction_id: paymentData.transaction_id || `TRX-${Date.now()}`
          }

          const result = await callFlightHistoryAPI(
            '/flight-payments/store',
            'POST',
            payload,
            true
          )

          if (result.ok) {
            console.log('✓ Payment processed successfully')
            return { success: true, data: result.data }
          } else {
            console.error('✗ Failed to process payment:', result.error)
            return { success: false, message: result.error }
          }
        } catch (error: any) {
          console.error('✗ Error processing payment:', error)
          return { success: false, message: error?.message || 'Payment failed' }
        }
      },

      cancelFlightBooking: async (id_flight_booking, reason) => {
        try {
          console.log('❌ Canceling flight booking...')

          const payload: any = { id_flight_booking }
          if (reason) payload.cancellation_reason = reason

          const result = await callFlightHistoryAPI(
            '/flight-booking/cancel',
            'POST',
            payload,
            true
          )

          if (result.ok) {
            console.log('✓ Flight booking canceled successfully')
            return { success: true, data: result.data }
          } else {
            console.error('✗ Failed to cancel flight booking:', result.error)
            return { success: false, message: result.error }
          }
        } catch (error: any) {
          console.error('✗ Error canceling flight booking:', error)
          return { success: false, message: error?.message || 'Failed to cancel booking' }
        }
      },

      getFlightHistory: async (id_customer) => {
        try {
          console.log('📖 Fetching flight history...')

          const result = await callFlightHistoryAPI(
            '/flight-booking/show',
            'POST',
            { id_customer, sort: 1 },
            true
          )

          if (result.ok) {
            console.log('✓ Flight history fetched successfully')
            return { success: true, data: result.data }
          } else {
            console.error('✗ Failed to fetch flight history:', result.error)
            return { success: false, message: result.error }
          }
        } catch (error: any) {
          console.error('✗ Error fetching flight history:', error)
          return { success: false, message: error?.message || 'Failed to fetch flight history' }
        }
      },

      getBookingDetail: async (id_flight_booking) => {
        try {
          console.log('📄 Fetching booking detail...')

          const result = await callFlightHistoryAPI(
            '/flight-booking/detail',
            'POST',
            { id_flight_booking },
            true
          )

          if (result.ok) {
            console.log('✓ Booking detail fetched successfully')
            return { success: true, data: result.data }
          } else {
            console.error('✗ Failed to fetch booking detail:', result.error)
            return { success: false, message: result.error }
          }
        } catch (error: any) {
          console.error('✗ Error fetching booking detail:', error)
          return { success: false, message: error?.message || 'Failed to fetch booking detail' }
        }
      },

      clearAll: () => set({ 
        searchParams: null, 
        selectedFlight: null,
        passengerData: null,
        bookingDetails: null
      })
    }),
    {
      name: 'flight-storage',
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name)
          return str ? JSON.parse(str) : null
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name)
        },
      },
    }
  )
)