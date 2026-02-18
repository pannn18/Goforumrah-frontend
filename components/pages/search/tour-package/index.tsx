import React, { useEffect, useState } from 'react'
import { Icons, Images } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import TourCard from '@/components/pages/search/tour-package/tourCard'
import Link from 'next/link'
import sidemenuMapImage from '@/assets/images/sidemenu_maps.png'
import { HotelSearchBar } from '../../home/searchBar'
import DropdownMenu from '@/components/elements/dropdownMenu'
import RangeSlider from '@/components/elements/rangeSlider'
import { TourPackageSearchBar } from '../../home/searchBar'
import { useRouter } from 'next/router'
import { callAPI } from '@/lib/axiosHelper'
import LoadingOverlay from '@/components/loadingOverlay'

const SearchTourPackage = () => {
  const router = useRouter()
  const location = (router.query?.location || '') as string
  const date = (router.query?.date || '') as string

  const [data, setData] = useState(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1)
  const [searchValue, setSearchValue] = useState('')
  const [search, setSearch] = useState('')

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value)
  }
  const handleSearchSubmit = () => {
    setSearch(searchValue)
  }


  const [selectedSort, setSelectedSort] = useState(null);
  const [sortName, setSortName] = useState(null);

  const [recomended, setRecomended] = useState(null);
  const [price, setPrice] = useState(null);
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState<boolean>(false)

  const handleSortChange = (e) => {
    setSelectedSort(e.target.id);
  };

  const handleClearFilter = () => {
    setSelectedSort(null)
    setSortName(null)
  }


  useEffect(() => {
    // for sort
    if (!selectedSort) {
      setRecomended(null)
      setPrice(null)
      setRating(null)
      setSortName(null)
    }
    if (selectedSort === 'filterSort1') {
      setRecomended(1)
      setPrice(1)
      setRating(1)
      setSortName('Recommended')
    }
    if (selectedSort === 'filterSort2') {
      setRecomended(null)
      setPrice(1)
      setRating(null)
      setSortName('Price (lowest first)')
    }
    if (selectedSort === 'filterSort3') {
      setRecomended(null)
      setPrice(2)
      setRating(null)
      setSortName('Price (highest first)')
    }
    if (selectedSort === 'filterSort4') {
      setRecomended(null)
      setPrice(null)
      setRating(1)
      setSortName('Rating (lowest first)')
    }
    if (selectedSort === 'filterSort5') {
      setRecomended(null)
      setPrice(null)
      setRating(2)
      setSortName('Rating (highest first)')
    }

  }, [selectedSort])


  const loadTourPackage = async (page) => {
    setLoading(true)

    const payload = {
      search: search,
      destination: location,
      recomended: recomended,
      price: price,
      rating: rating
    }
    const calculateTotalPages = (data) => {
      return Math.ceil((data.length || 0) / 10);
    };

    const { error, ok, data } = await callAPI(`/tour-package/show-all?page=${page}&per_page=10`, 'POST', payload, true);
    if (error) {
      console.log(error);
      setLoading(false)
    }
    if (ok) {
      console.log(data)
      setData(formatData(data))
      setTotalPages(calculateTotalPages(data));
      setLoading(false)
    } 
  }

  useEffect(() => {
    if (location === '') return
    loadTourPackage(currentPage)
  }, [location, search, selectedSort, recomended, price, rating,currentPage, totalPages])

  const formatData = (tourData) => {
    return tourData.map((tour, index) => ({
      idTour: tour.id_tour_package,
      image: tour.tour_photos,
      name: tour.package_name,
      linkURL: `/tour/${tour.id_tour_package}?date=${date}`,
      location: tour.address,
      description: tour.description,
      price: tour.price
    }));
  };

  if (loading) {
    return <LoadingOverlay />
  }


  return (
    <main className="search-tour-package">
      <div className="search-tour-package__header-form">
        <div className="container">
          <TourBreadCrumb />
          <TourPackageSearchBar useVariant={true} date={date} destination={location} onSearchChange={() => loadTourPackage(currentPage)} />
        </div>
      </div>
      <div className="container">
        <div className="search-tour-package__wrapper">
          <Sidebar
            // for search filter
            searchValue={searchValue}
            handleSearchChange={handleSearchChange}
            handleSearchSumbit={handleSearchSubmit}

            // for sort filter
            selectedSort={selectedSort}
            handleSortChange={handleSortChange}
            handleClearFilter={handleClearFilter}
          />
          <div className="search-tour-package__content">
            <div className="search-tour-package__content-header">
            <div className="search-tour-package__content-header-title">
            Showing {Math.min(currentPage * 10, data?.length || 0)} tours {search || selectedSort ? 'with' : ''} {search ? (<><span>search</span> <span className="fw-bold">"{search}",</span></>) : ("")} {selectedSort ? (<><span>sort</span> <span className="fw-bold">"{sortName}",</span></>) : ("")} in the city of <span className="fw-bold">{location}</span>
          </div>
              {/* <div className="custom-dropdown">
                <div className="custom-dropdown-toggle">
                  <div>Show : Our top pick</div>
                  <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                </div>
              </div> */}
            </div>
            <TourList data={data} currentPage={currentPage} itemsPerPage={10} />
            {!loading && (
              <div className="search-tour-package__pagination">
              <div className="pagination">
                <button
                  type="button"
                  className={`pagination__button pagination__button--arrow ${currentPage === 1 ? 'disabled' : ''}`}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <SVGIcon src={Icons.ArrowLeft} width={24} height={24} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`pagination__button ${i + 1 === currentPage ? 'active' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  className={`pagination__button pagination__button--arrow ${currentPage === totalPages ? 'disabled' : ''}`}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <SVGIcon src={Icons.ArrowRight} width={24} height={24} />
                </button>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

const Sidebar = ({ searchValue, handleSearchChange, handleSearchSumbit, selectedSort, handleSortChange, handleClearFilter }) => {

  return (
    <div className="search-tour-package__sidemenu">
      <div className="search-tour-package__sidemenu-search-place">
        <div className="search-tour-package__sidemenu-search-hotel-location">
          <SVGIcon src={Icons.Search} width={20} height={20} />
          <div className="search-tour-package__sidemenu-search-hotel-location-name">
            <input
              type="text" 
              value={searchValue}
              onChange={handleSearchChange}
              className="search-bar__input"
              placeholder="Museum, tour ..." />
          </div>
        </div>
        <button onClick={handleSearchSumbit} className="btn btn-success search-tour-package__sidemenu-search-hotel-button">
          Search
        </button>
      </div>
      <div className="search-tour-package__sidemenu-filter">

        <div className="search-tour-package__sidemenu-separator"></div>
        <div className="search-tour-package__sidemenu-filter-block">
          <a className="search-tour-package__sidemenu-filter-head" data-bs-toggle="collapse" href="#sortFilterCollapse" role="button" aria-expanded="true" aria-controls="sortFilterCollapse">
            <div className="search-tour-package__sidemenu-filter-head--title">Sort By</div>
            <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
          </a>
          <div id="sortFilterCollapse" className="collapse show search-tour-package__sidemenu-filter-block">
            <div className="search-tour-package__sidemenu-filter-item form-check">
              <input
                type="radio"
                id="filterSort1"
                name="filterSort"
                className="form-check-input"

                checked={selectedSort === 'filterSort1'}
                onChange={handleSortChange}
              />
              <label htmlFor="filterSort1" className="form-check-label">Recommended</label>
            </div>
            <div className="search-tour-package__sidemenu-filter-item form-check">
              <input
                type="radio"
                id="filterSort2"
                name="filterSort"
                className="form-check-input"

                checked={selectedSort === 'filterSort2'}
                onChange={handleSortChange}
              />
              <label htmlFor="filterSort2" className="form-check-label">Price (lowest first)</label>
            </div>
            <div className="search-tour-package__sidemenu-filter-item form-check">
              <input
                type="radio"
                id="filterSort3"
                name="filterSort"
                className="form-check-input"

                checked={selectedSort === 'filterSort3'}
                onChange={handleSortChange}
              />
              <label htmlFor="filterSort3" className="form-check-label">Price (highest first)</label>
            </div>
            <div className="search-tour-package__sidemenu-filter-item form-check">
              <input
                type="radio"
                id="filterSort4"
                name="filterSort"
                className="form-check-input"

                checked={selectedSort === 'filterSort4'}
                onChange={handleSortChange}
              />
              <label htmlFor="filterSort4" className="form-check-label">Rating (lowest first)</label>
            </div>
            <div className="search-tour-package__sidemenu-filter-item form-check">
              <input
                type="radio"
                id="filterSort5"
                name="filterSort"
                className="form-check-input"

                checked={selectedSort === 'filterSort5'}
                onChange={handleSortChange}
              />
              <label htmlFor="filterSort5" className="form-check-label">Rating (highest first)</label>
            </div>
          </div>
        </div>
        <div className="search-tour-package__sidemenu-separator"></div>
        <a onClick={handleClearFilter} type="button" className="search-tour-package__sidemenu-filter-button">Clear Filter</a>
      </div>
    </div>
  )
}

const TourBreadCrumb = () => {
  return (
    <div className="search-tour-package__breadcrumb">
      <Link className="search-tour-package__breadcrumb--link" href="/">Home</Link>
      <p>/</p>
      <p className="search-tour-package__breadcrumb--current">Search Tour Package</p>
    </div>
  )
}

const TourList = ({ data, currentPage, itemsPerPage }) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const visibleData = data?.slice(startIndex, endIndex);

  return (
    <div className="search-tour-package__content-list">
      {visibleData && visibleData.map((tour, index) => (
        <TourCard {...tour} key={index} />
      ))}
    </div>
  );
};


export default SearchTourPackage