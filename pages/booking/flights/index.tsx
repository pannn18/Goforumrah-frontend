import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import BookingFlights from '@/components/pages/booking/flights'
import { useFlightStore } from '@/lib/stores/flightStore'

export default function BookingFlightsPage() {
  const router = useRouter()
  const selectedFlight = useFlightStore((state) => state.selectedFlight)
  const [isHydrated, setIsHydrated] = useState(false)

  // Wait for Zustand to hydrate from sessionStorage
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Check flight data after hydration
  useEffect(() => {
    if (!isHydrated) return

    if (!selectedFlight) {
      router.push('/search?service=flights')
    }
  }, [isHydrated, selectedFlight, router])

  // Show loading while hydrating
  if (!isHydrated || !selectedFlight) {
    return (
      <Layout>
        <Navbar showCurrency={true} />
        <main className="booking-hotel">
          <div className="container">
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <p>Loading flight details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </Layout>
    )
  }

  return (
    <Layout>
      <Navbar showCurrency={true} />
      <BookingFlights />
      <Footer />
    </Layout>
  )
}