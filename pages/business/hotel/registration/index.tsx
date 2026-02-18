import Layout from '@/components/layout'
import React, { useState } from 'react'
import Navbar from '@/components/layout/navbar'
import { BlurPlaceholderImage } from '@/components/elements/images'
import categoryBack from '@/assets/images/arrow_left_green.svg'
import hotelImage from '@/assets/images/hotel_category.png'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getEnumAsArray } from '@/lib/enumsHelper'
import useFetch from '@/hooks/useFetch'
import { HotelCategory } from '@/types/types'
import { useSession } from 'next-auth/react'
import LoadingOverlay from "@/components/loadingOverlay"

interface IProps {
}

const HotelRegistration = (props: IProps) => {
  const router = useRouter()
  const { data, status } = useSession()

  const { ok: isCategoriesOK, data: categories, loading: isCategoriesLoading }: {
    loading: boolean
    data: HotelCategory[] | null
    ok: boolean
    error: string
  } = useFetch('/hotel-category/show', 'POST', null, true)
  const [selectedCategory, setSelectedCategory] = useState<number>(-1) // Index of categories

  return (
    <Layout>
      <Navbar showHelp={false} hideAuthButtons={true} />
      {!(status === 'authenticated') ? (
        <LoadingOverlay />
      ) : (
        <>
          {isCategoriesLoading ? (
            <LoadingOverlay />
          ) : (
            <div className='hotel-dashboard hotel-dashboard--grey-background hotel-dashboard--remove-height hotel-dashboard__select-category'>
              <div className='hotel-dashboard__select-category-title'>
                <div className='container'>
                  <div className='row align-items-center'>
                    <div className='col-xl-2 col-lg-2 col-md-3'>
                      <div className='hotel-dashboard__nav'>
                        <Link className='hotel-dashboard__nav-link' href='/business/hotel/empty'>
                          <BlurPlaceholderImage className='hotel-dashboard__nav-image' alt='image' src={categoryBack} width={20} height={20} />
                          Back
                        </Link>
                      </div>
                    </div>
                    <div className='col-xl-10 col-lg-10 col-md-9'>
                      <div className='hotel-dashboard__nav-title'>
                        <h3 className='hotel-dashboard__nav-title-heading'>Select your category</h3>
                        <p>From the list below, which property category is the best fit for your place?</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='hotel-dashboard__select-category-list'>
                <div className='container'>
                  <div className='row'>
                    {!!categories?.length && categories.map(({ id_hotel_category, name, icon, detail }, index) => (
                      <div key={`hotel-category-${index}`} className='col-xl-3 col-lg-3 col-md-6 hotel-category-card'>
                        <div
                          onClick={() => setSelectedCategory(index)}
                          className={`hotel-category-card__box ${index === selectedCategory ? 'selected' : ''}`}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className='hotel-category-card__thumbnail'>
                            <BlurPlaceholderImage className='hotel-category-card__thumbnail-image' alt={name} src={icon} width={72} height={72} />
                          </div>
                          <h5 className='hotel-category-card__title'>{name}</h5>
                          <p className='hotel-category-card__caption'>{detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className='row'>
                    <div className='col-12'>
                      <div className='hotel-dashboard__button-list'>
                        <Link href='/business/hotel/empty' className='button goform-button goform-button--outline-green hotel-dashboard__button-list-item'>Cancel</Link>
                        <button
                          onClick={() => selectedCategory > -1 && router.push(`/business/hotel/registration/${categories[selectedCategory].id_hotel_category}`,)}
                          type='button' className='button goform-button goform-button--fill-green hotel-dashboard__button-list-item'>Continue</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  )
}

export default HotelRegistration
