import React, { useState, useEffect } from "react"

export const UseCurrencyConverter = () => {
  const [currencySymbol, setCurrencySymbol] = useState("$")
  const [localRate, setLocalRate] = useState({ code: "USD", symbol: "$", rate: "1" })

  const roundAndFormat = (number: number, decimalPlaces: number) => {
    const roundedNumber = parseFloat(number.toFixed(decimalPlaces))
    return roundedNumber.toLocaleString("en-US")
  }

  const changePrice = (price: any) => {
    const amount = Number(price ?? 0)
  const rateRaw = localRate?.rate
  const rate = Number(rateRaw ?? 1)

  console.log("rateRaw:", rateRaw, "rate:", rate, "amount:", amount)

  if (!Number.isFinite(amount)) return "0.00"
  if (!Number.isFinite(rate) || rate <= 0) return roundAndFormat(amount, 2)

  return roundAndFormat(rate * amount, 2) 
  }

  useEffect(() => {
    const handleCurrencyChange = () => {
      const stored = localStorage.getItem("currency")
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (parsed?.rate && parsed?.symbol) setLocalRate(parsed)
        } catch {}
      }
    }

    window.addEventListener("click", handleCurrencyChange)

    const stored = localStorage.getItem("currency")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed?.rate && parsed?.symbol) setLocalRate(parsed)
      } catch {}
    }

    return () => {
      window.removeEventListener("click", handleCurrencyChange)
    }
  }, [])

  useEffect(() => {
    setCurrencySymbol(localRate?.symbol || "$")
  }, [localRate])

  return { changePrice, currencySymbol }
}
