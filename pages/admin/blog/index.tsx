import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import { useEffect, useState, useMemo } from "react"
import DropdownMenu from "@/components/elements/dropdownMenu"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import Link from "next/link"
import { BlurPlaceholderImage } from "@/components/elements/images"
import { StaticImageData } from "next/image"
import useFetch from "@/hooks/useFetch"
import { Images } from "@/types/enums"
import { format } from 'date-fns';
import { callAPI } from "@/lib/axiosHelper"
import blogThumbnail1 from '@/assets/images/blog_thumbnail_1.png'
import moment from "moment"
import LoadingOverlay from "@/components/loadingOverlay"


export default function PartnerHotel() {

  // Retrive Data From API
  const [blogData, setBlogData] = useState(null)
  const [blogLoading, setBlogLoading] = useState(true)
  const [blogOk, setBlogOk] = useState(false)

  const [categoryData, setCategoryData] = useState(null)
  const [categoryLoading, setCategoryLoading] = useState(true)
  const [categoryOk, setCategoryOk] = useState(null)


  const [currentPage, setCurrentPage] = useState(1)
  const [postPerPage] = useState(4)
  const indexOfLastPost = currentPage * postPerPage
  const indexOfFirstPost = indexOfLastPost - postPerPage
  const [search, setSearch] = useState('')

  const tabs = {
    'All': null,
    'Draft': 0,
    'Schedule': 1,
    'Published': 2,
  }

  const [selectedTab, setSelectedTab] = useState<string>(Object.keys(tabs)[0])

  const [blogToDelete, setBlogToDelete] = useState(null);


  const openPopupDelete = (idBlog) => {
    setBlogToDelete(idBlog);
  };

  const fetchBlogData = async () => {
    try {
      const { status, data, ok, error } = await callAPI('/blog/show', 'POST', true);
      setBlogData(data)
      setBlogLoading(false)
      setBlogOk(true)
    } catch (error) {
      console.log(error);
    }
  };

  const onActionForm = async () => {
    fetchBlogData()
    window.scrollTo({ top: 0, behavior: 'auto' })
  };

  useEffect(() => {
    if (blogData) return
    fetchBlogData()
  })

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab]);

  const { loading: loadingCategory, data: dataCategory, ok: okCategory, error: errorCategory } = useFetch('/blog-category/show', 'POST')

  if (blogOk && okCategory) {
    const filteredBlogs = blogData
      .filter((item) => {
        return (
          selectedTab === 'All' || item.status === tabs[selectedTab]
        ) && (
            search.toLocaleLowerCase() === '' || item.title.toLowerCase().includes(search)
          );
      })
      .sort((a, b) => moment(b.datetime).diff(moment(a.datetime)));

    const currentFilteredBlogs = filteredBlogs.slice(indexOfFirstPost, indexOfLastPost)

    return (
      <Layout>
        <AdminLayout pageTitle="Blog Post">
          <div className="container">
            <div className="admin-blog">
              <div className="admin-blog__wrapper">
                <div className="admin-blog__header">
                  <div className="admin-blog__header-split">
                    <div className="admin-blog__header-tab-menu">
                      {Object.keys(tabs).map((tab, index) => (
                        <button
                          key={index}
                          className={`btn ${tab === selectedTab ? 'active' : ''}`}
                          onClick={() => setSelectedTab(tab)}>
                          {tab}
                        </button>
                      ))}
                    </div>
                    <div className="admin-blog__header-separator"></div>
                    <div className="admin-blog__header-search">
                      <input type="text" className="form-control" placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
                      <SVGIcon src={Icons.Search} width={20} height={20} />
                    </div>
                  </div>
                  <Link href="/admin/blog/create" type="button" className="btn btn-sm btn-outline-success">
                    <SVGIcon src={Icons.Plus} width={20} height={20} className="" />
                    Add New
                  </Link>
                </div>

                <div className="admin-blog__list">
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      height: `calc(100vh - 100px)`
                    }}>
                    {blogLoading ? (
                      <LoadingOverlay />
                    ) : (!filteredBlogs.length ? (
                      <div className="text-center">Sorry, there aren't any blogs that match your filter.</div>
                    ) : currentFilteredBlogs.map(item => (
                      <Blog okCategory={okCategory} dataCategory={dataCategory} blog_id={item.id_blog} key={item.id_blog} title={item.title} category={item.id_blog_category} thumbnail={item?.title_icon || Images.Placeholder} published={moment(item.datetime).format('D MMM YYYY')} status={item.status} idBlogtoDelete={blogToDelete} openPopupDelete={openPopupDelete} onActionForm={onActionForm} />
                    )))}
                  </div>
                  {!!currentFilteredBlogs.length
                    ? <Pagination data={filteredBlogs} currentPage={currentPage} postPerPage={postPerPage} setCurrentPage={setCurrentPage} />
                    : ''
                  }
                </div>
              </div>
            </div>
          </div>
        </AdminLayout>
      </Layout >
    )
  }
}

const Blog = ({ title, category, thumbnail, published, status, blog_id, okCategory, dataCategory, idBlogtoDelete, openPopupDelete, onActionForm }) => {

  const handleSubmitDelete = async (event) => {
    event.preventDefault();

    const formDataDelete = {
      id_blog: idBlogtoDelete,
      soft_delete: 1,
    };

    const { status, data, ok, error } = await callAPI('/blog/store', 'POST', formDataDelete, true)
    console.log(status, data, ok, error);
    if (ok) {
      console.log("Success", status, data, ok, error);
      // Call the onActionForm callback here
      onActionForm();
    } else {
      console.log(error);
    }
  }

  if (okCategory) {
    return (
      <div className="admin-blog__list-item">
        <div className="admin-blog__list-item__header">
          <BlurPlaceholderImage className="admin-blog__list-item__header-image" alt="profilePhoto" src={thumbnail} width={80} height={80} />
          <div>
            <p className="admin-blog__list-item__header-title"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >{title}</p>

            {dataCategory.map((item, index) => (
              category === item.id_blog_category && (
                <p key={index} className="admin-blog__list-item__label">{item.name}</p>
              )
            ))}

          </div>
        </div>
        <div className="admin-blog__list-item__published">
          <p className="admin-blog__list-item__label">Publised</p>
          <div className="admin-blog__list-item__published-date">
            <SVGIcon src={Icons.Calendar} width={16} height={16} className="" />
            <p>{published}</p>
          </div>
        </div>
        <div className="admin-blog__list-item__status-wrapper">
          <p className="admin-blog__list-item__label">Status</p>
          {status === 0 && (
            <span className="admin-blog__list-item__status admin-blog__list-item__status--draft">Draft</span>
          )}
          {status === 1 && (
            <span className="admin-blog__list-item__status admin-blog__list-item__status--scheduled">Scheduled</span>
          )}
          {status === 2 && (
            <span className="admin-blog__list-item__status admin-blog__list-item__status--published">Published</span>
          )}
        </div>
        <div className="admin-blog__list-item__action">
          <button onClick={() => openPopupDelete(blog_id)} className="admin-blog__list-item__action-delete" data-bs-toggle="modal" data-bs-target="#deleteModal">
            <SVGIcon src={Icons.Trash} width={16} height={16} className="" />
          </button>
          <Link href={`/admin/blog/detail?id=${blog_id}`} className="btn btn-outline-success">Edit</Link>
        </div>

        {/* Modal PopupDelete */}
        <div className="modal fade" id="deleteModal" tabIndex={-1} aria-labelledby="deleteModalLabel" aria-hidden="true">
          <div className="modal-dialog cancelation__modal">
            <div className="modal-content cancelation__modal-body">
              <div className="cancelation__modal-content">
                <div className="cancelation__modal-image">
                  <SVGIcon src={Icons.CircleCancel} width={48} height={48} />
                </div>
                <div className="cancelation__modal-text">
                  <h3>Delete Room</h3>
                  <p className="cancelation__modal-desc">Deleted rooms cannot be returned, do you really want to delete it ?</p>
                </div>
              </div>
              <div className="cancelation__modal-footer">
                <button data-bs-dismiss="modal" className="btn btn-lg btn-outline-secondary cancelation__modal-button">Cancel</button>
                <button data-bs-dismiss="modal" onClick={handleSubmitDelete} className="btn btn-lg goform-button--fill-red cancelation__modal-button">Confirm Delete</button>
              </div>
            </div>
          </div>
        </div>
        {/* End Modal PopupDelete */}
      </div >
    )
  }
}

const Pagination = ({ currentPage, setCurrentPage, data, postPerPage }) => {

  const pageCounts = Math.ceil(data.length / postPerPage)

  return (
    <nav aria-label="Page navigation example">
      <div className="search-transfer__pagination">
        <div className="pagination">
          <button type="button"
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            className="pagination__button pagination__button--arrow" style={{ transform: 'rotate(90deg)', cursor: currentPage === 1 ? 'default' : 'pointer' }}>
            <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
          </button>
          {Array.from({ length: pageCounts }, (_, i) => i + 1).map((number) => {
            const isCloseToCurrent = number >= currentPage - 2 && number <= currentPage + 2
            const hasMoreOnLeft = number !== 1 && number === currentPage - 3
            const hasMoreOnRight = number !== pageCounts && number === currentPage + 3
            const isFirst = number === 1
            const isLast = number === pageCounts

            const isVisible = isCloseToCurrent || hasMoreOnLeft || hasMoreOnRight || isFirst || isLast

            return isVisible && (
              <button key={number} onClick={() => !(hasMoreOnLeft || hasMoreOnRight) && setCurrentPage(number)} type="button" className={`pagination__button ${number === currentPage ? 'active' : ''}`} style={{ cursor: hasMoreOnLeft || hasMoreOnRight ? 'default' : 'pointer' }}>{(hasMoreOnLeft || hasMoreOnRight) ? '...' : number}</button>
            )
          })}
          <button type="button" onClick={() => currentPage < pageCounts && setCurrentPage(currentPage + 1)} className="pagination__button pagination__button--arrow" style={{ transform: 'rotate(-90deg)', cursor: currentPage === pageCounts ? 'default' : 'pointer' }}>
            <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
          </button>
        </div>
      </div>
    </nav>
  )
}