export interface User {
  id: string;
  role: string
  token: string
}

export interface Hotel {
  id_hotel: number
  property_name: string
  star_rating: number
  street_address: string
  country: string
  city: string
  postcode: string
  viewed: number
  room_type: string
  hotel_photo_thumbnail: string
  price: number
  breakfast: string
  facilities: string
  checkInDate: string
  checkOutDate: string
}

export interface HotelCategory {
  id_hotel_category: number
  name: string
  detail: string
  icon: string
  icon_name: string
  soft_delete: boolean
}

export interface HotelPassenger {
  adult: number
  children: number
  room: number
}

export interface BookTransfer {
  id_car_business: number
  id_car_business_fleet: number
  fuel_type: string
  car_brand: string
  model: string
  edition: string
  transmission: string
  aircon: number
  quantity: number
  total_car: number
  price: number
  rented_count: number
  company_name: string
  trading_as: string
  country: string
  address_line: string
  region: string
  car_photo_thumbnail?: string
  checkInDate?: string
  checkOutDate?: string
  pickupTime?: string
  dropOffTime?: string
  spec_name?: string
  spec_total?:string
  
}

export interface FlightSearchList {
  airportInformation?: {
    cityId: string
    countryId: string
    entityId: string
    iataCode: string
    location: string
    name: string
    parentId: string
  }
  entityId: string
  iataCode: string
  parentId: string
  name: string
  countryId: string
  countryName: string
  cityName: string
  location: string
  hierarchy: string
  type: string
  highlighting: (number[])[]
  code?: string        
  id?: string          
  skyId?: string
}