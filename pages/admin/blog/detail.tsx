import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import { useEffect, useState } from "react"
import { Editor } from '@tinymce/tinymce-react';
import { Calendar } from 'react-date-range';
import moment from 'moment';
import DropdownMenu from "@/components/elements/dropdownMenu"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import Link from "next/link"
import { BlurPlaceholderImage } from "@/components/elements/images"
import { StaticImageData } from "next/image"
import blogThumbnail1 from '@/assets/images/blog_thumbnail_1.png'
import { useRouter } from "next/router";
import useFetch from "@/hooks/useFetch";
import { callAPI } from "@/lib/axiosHelper";
import LoadingOverlay from "@/components/loadingOverlay";

export default function PartnerHotel() {
  const times = ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30']
  const [showDateDropdown, setShowDateDropdown] = useState<boolean>(false)
  const [showPickupTimeDropdown, setShowPickupTimeDropdown] = useState<boolean>(false)
  const [departureOnly, setDepartureOnly] = useState<Date>(null)
  const [pickupTime, setPickupTime] = useState<string>(null)
  const handleClickPickupTimeOption = (pickupTime: string) => {
    setPickupTime(pickupTime)
    setShowPickupTimeDropdown(false)
  }

  const [blogStatus, setBlogStatus] = useState<number>(0)

  const router = useRouter()
  const id_blog = router.query.id

  // Retrive Data from API
  const [blogData, setBlogData] = useState(null)
  const [blogLoading, setBlogLoading] = useState(true)
  const [blogError, setBlogError] = useState(false)
  const [blogOk, setBlogOk] = useState(null)

  const [categoryData, setCategoryData] = useState(null)
  const [categoryLoading, setCategoryLoading] = useState(true)
  const [categoryError, setCategoryError] = useState(false)
  const [categoryOk, setCategoryOk] = useState(null)

  const [image, setImage] = useState(null)
  const [error, setError] = useState(true)

  // Forms
  const [formData, setFormData] = useState({
    id_blog: id_blog,
    id_blog_category: null,
    title: "",
    content: "",
    soft_delete: 0,
    title_icon: "",
    featured: 1,
  })

  const [errorMessage, setErrorMessage] = useState({
    imageValidation: '',
    titleValidation: '',
    contentValidation: '',
    categoryValidation: ''
  })

  useEffect(() => {
    if (!id_blog) return

    if (blogData && categoryData) return

    // Fetch Blog Data
    const fetchBlogData = async () => {
      const { status, data: itemBlog, ok: okBlog, error: errorBlog } = await callAPI('/blog/show', 'POST', { "id_blog": id_blog }, true);
      if (errorBlog) {
        setBlogError(true)
        setBlogLoading(true)
      } else {
        setBlogData(itemBlog)

        if (okBlog && itemBlog) {
          const blogData = itemBlog

          setFormData((prevData) => ({
            id_blog: id_blog,
            id_blog_category: blogData.id_blog_category,
            title: blogData.title,
            content: blogData.content,
            soft_delete: 0,
            title_icon: blogData.title_icon,
            featured: 1,
          }))
          setImage(blogData.title_icon)
        }
      }
      setBlogOk(okBlog)
      setBlogLoading(false)
    }

    // Fetch Category Data
    const fetchCategoryData = async () => {
      const { status, data: itemCategory, ok: okCategory, error: errorCategory } = await callAPI('/blog-category/show', 'POST', true);
      if (errorCategory) {
        setCategoryError(true)
        setCategoryLoading(true)
      } else {
        setCategoryData(itemCategory)
        setCategoryLoading(false)
        setCategoryOk(okCategory)
      }
    }

    fetchBlogData()
    fetchCategoryData()
  }, [id_blog])

  function getDatetime(departure, time) {
    const parsedDeparture = moment(departure);
    const date = parsedDeparture.format('YYYY-MM-DD');
    const formattedDatetime = `${date} ${time}:00`;

    return formattedDatetime
  }
  const onSubmit = async (e) => {

    e.preventDefault()

    const formDataCopy = {
      ...formData,
      datetime: (departureOnly || pickupTime) ? getDatetime(departureOnly, pickupTime) : moment().format('YYYY-MM-DD HH:mm:ss')
    }

    let newError = { ...errorMessage }

    if (image == null || image === '') {
      newError.imageValidation = 'Image Required'
      setError(true)
    } else {
      newError.imageValidation = ''
    }

    if (formData.title == null || formData.title === '') {
      newError.titleValidation = 'Title is required';
      setError(true)
    } else {
      newError.titleValidation = '';
    }

    if (formData.content == null || formData.content === '') {
      newError.contentValidation = 'Content is required';
      setError(true)
    } else {
      newError.contentValidation = '';
    }

    if (formData.id_blog_category == null || formData.id_blog_category === '') {
      newError.categoryValidation = 'Category is required';
      setError(true)
    } else {
      newError.categoryValidation = '';
    }

    setErrorMessage(newError)

    const hasErrors = Object.values(newError).some((error) => error !== '');

    if (!hasErrors) {
      const { ok: okStore, error: errorStore } = await callAPI('/blog/store', 'POST', formDataCopy, true)
      const { ok: okStatus, error: errorStatus } = await callAPI('/blog/update-status', 'POST', { id_blog: formDataCopy.id_blog, status: blogStatus }, true)
      if (okStore && okStatus) {
        router.push(`/admin/blog`)
        console.log('Blog edited successfully')
      }
      else {
        console.log(errorStore)
        console.log(errorStatus)
      }
    }
  }

  const validateFile = (file) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const fileName = file.name.toLowerCase();
    return allowedExtensions.some(ext => fileName.endsWith(ext));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];

    if (validateFile(droppedFile)) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setFormData((prevState) => ({
          ...prevState,
          title_icon: reader.result.toString(),
        }))
      };
      reader.readAsDataURL(droppedFile);
      setErrorMessage((prevState) => ({
        ...prevState,
        imageValidation: '',
      }))
    } else {
      setErrorMessage((prevState) => ({
        ...prevState,
        imageValidation: 'Files must be in jpg or png',
      }))
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault();
  }

  const handleFileChange = (e) => {
    e.preventDefault()
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setFormData((prevState) => ({
          ...prevState,
          title_icon: reader.result.toString(),
        }))
      };
      reader.readAsDataURL(file);
    }
  }

  const ImageUploader = () => {
    return (
      <div>
        <div className="admin-blog__edit-header__thumbnail" onDrop={handleDrop} onDragOver={handleDragOver}>
          <div>
            {image ? <img src={image} alt="Uploaded" /> : <p>Drag &amp; drop an image or choose a file</p>}
          </div>
          <div>
            <p>Image</p>
            <label htmlFor="title_icon" className="form-label">Change Image</label>
            <input
              type="file"
              className="form-control"
              id="title_icon"
              name="title_icon"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <div className="form-control-message form-control-message--error">
          {errorMessage.imageValidation}
        </div>
      </div>
    )
  }

  if (blogLoading && categoryLoading) {
    return <LoadingOverlay />
  }

  if (blogOk && categoryOk) {
    return (
      <Layout>
        <form onSubmit={onSubmit}>
          <AdminLayout pageTitle="Edit Blog Post" enableBack={true}>
            <div className="container">
              <div className="admin-blog">
                <div className="admin-blog__wrapper">
                  <div className="admin-blog__edit-header">
                    <ImageUploader />
                    <div className="admin-blog__edit-header__detail">
                      <div className="admin-blog__edit-header__detail-group">
                        <label htmlFor="title" className="admin-blog__edit-header__detail-label">Title</label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          className="admin-blog__edit-header__detail-input"
                          value={formData.title}
                          onChange={(e) => {
                            const newValue = e.target.value
                            setFormData((prevData) => ({
                              ...prevData,
                              title: newValue,
                            }))
                          }}
                        />
                        <div className="form-control-message form-control-message--error">
                          {errorMessage.titleValidation}
                        </div>
                      </div>
                      <div className="admin-blog__edit-header__detail-group">
                        <label htmlFor="blogCategory" className="admin-blog__edit-header__detail-label">Category</label>
                        <select
                          name="blogCategory"
                          id="blogCategory"
                          className="admin-blog__edit-header__detail-input"
                          value={formData.id_blog_category}
                          onChange={(e) => {
                            const value = e.target.value
                            setFormData((prevData) => ({
                              ...prevData,
                              id_blog_category: value,
                            }))
                          }}
                        >
                          {categoryData.map((item, index) => (
                            <option key={index} value={item.id_blog_category}>{item.name}</option>
                          ))}
                        </select>
                        <div className="form-control-message form-control-message--error">
                          {errorMessage.categoryValidation}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Editor
                    onEditorChange={(newValue, editor) => {
                      setFormData((prevState) => ({
                        ...prevState,
                        content: editor.getContent({ format: 'text' })
                      }))
                    }}
                    initialValue={blogData.content}
                    init={{
                      height: 200,
                      menubar: false,
                      plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                      ],
                      toolbar: 'undo redo | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                  />
                  <div className="form-control-message form-control-message--error">
                    {errorMessage.contentValidation}
                  </div>
                  <div className="admin-blog__edit-footer">
                    <div className="admin-blog__edit-footer__attatchment">
                      <Link href="#">
                        <SVGIcon src={Icons.Attatch} width={16} height={16} className="" />
                      </Link>
                      <Link href="#">
                        <SVGIcon src={Icons.Link} width={16} height={16} className="" />
                      </Link>
                      <Link href="#">
                        <SVGIcon src={Icons.Image} width={16} height={16} className="" />
                      </Link>
                      <Link href="#">
                        <SVGIcon src={Icons.TrashOutline} width={16} height={16} className="" />
                      </Link>
                    </div>
                    <div className="admin-blog__edit-footer__buttons">
                      <Link href="#">Preview Post</Link>
                      <button type="button" onClick={() => { setBlogStatus(0), setDepartureOnly(null), setPickupTime(null) }} className="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#draftModal">Save as Draft</button>
                      <button type="button" onClick={() => setBlogStatus(1)} className="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#scheduleModal">Schedule</button>
                      <button type="button" onClick={() => { setBlogStatus(2), setDepartureOnly(null), setPickupTime(null) }} className="btn btn-success" data-bs-toggle="modal" data-bs-target="#postModal">Post</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AdminLayout>
          <div className="modal fade" id="postModal" tabIndex={-1} aria-labelledby="postLabel" aria-hidden="true">
            <div className="modal-dialog admin-blog__modal">
              <div className="modal-content admin-blog__modal-body">
                <div className="admin-blog__modal-content">
                  <div className="admin-blog__modal-image">
                    <SVGIcon src={Icons.CheckRounded} width={48} height={48} />
                  </div>
                  <div className="admin-blog__modal-text">
                    <h3>Post this Blog</h3>
                    <p className="admin-blog__modal-desc">Do you really want to post this blog?</p>
                  </div>
                </div>
                <div className="admin-blog__modal-footer">
                  <button type="button" className="btn btn-outline-secondary admin-blog__modal-button" data-bs-dismiss="modal">Cancel</button>
                  <button type="submit" className="btn btn-success admin-blog__modal-button" data-bs-dismiss="modal">Yes, Post</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal fade" id="draftModal" tabIndex={-1} aria-labelledby="postLabel" aria-hidden="true">
            <div className="modal-dialog admin-blog__modal">
              <div className="modal-content admin-blog__modal-body">
                <div className="admin-blog__modal-content">
                  <div className="admin-blog__modal-image">
                    <SVGIcon src={Icons.CheckRounded} width={48} height={48} />
                  </div>
                  <div className="admin-blog__modal-text">
                    <h3>Save this Blog</h3>
                    <p className="admin-blog__modal-desc">Do you really want to save as draft this blog?</p>
                  </div>
                </div>
                <div className="admin-blog__modal-footer">
                  <button type="button" className="btn btn-outline-secondary admin-blog__modal-button" data-bs-dismiss="modal">Cancel</button>
                  <button type="submit" className="btn btn-success admin-blog__modal-button" data-bs-dismiss="modal">Yes, Save</button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal fade" id="scheduleModal" tabIndex={-1} aria-labelledby="scheduleLabel" aria-hidden="true">
            <div className="modal-dialog admin-blog__modal">
              <div className="modal-content admin-blog__modal-body">
                <div className="admin-blog__modal-content">
                  <div className="admin-blog__modal-image">
                    <SVGIcon src={Icons.CalendarWithDate} width={48} height={48} />
                  </div>
                  <div className="admin-blog__modal-text">
                    <h3>Schedule Blog Post</h3>
                  </div>
                  <div className="admin-blog__modal-row">
                    <div className="admin-blog__modal-group">
                      <label htmlFor="">Date</label>
                      <div className="custom-dropdown">
                        <div onClick={() => setShowDateDropdown(true)} className={`admin-blog__modal-input`} style={{ cursor: 'pointer' }}>
                          <div>{departureOnly ? moment(departureOnly).format('ddd, MMM DD') : 'Departure'}</div>
                          <SVGIcon src={Icons.Calendar} width={20} height={20} />
                        </div>
                        <DropdownMenu show={showDateDropdown} setShow={setShowDateDropdown} style={{ marginTop: 8, overflow: 'hidden' }}>
                          <Calendar
                            months={1}
                            direction="horizontal"
                            date={departureOnly}
                            onChange={date => setDepartureOnly(date)}
                          />
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="admin-blog__modal-group">
                      <label htmlFor="">Time</label>
                      <div className="custom-dropdown">
                        <div onClick={() => setShowPickupTimeDropdown(true)} className={`admin-blog__modal-input`} style={{ cursor: 'pointer' }}>
                          <div>{pickupTime || 'Pick-up Time'}</div>
                          <SVGIcon src={Icons.CircleTime} width={20} height={20} />
                        </div>
                        <DropdownMenu show={showPickupTimeDropdown} setShow={setShowPickupTimeDropdown} style={{ marginTop: 8 }}>
                          <div className="custom-dropdown-menu__options">
                            {times.map((value, index) => (
                              <div key={index} onClick={() => { handleClickPickupTimeOption(value) }} className="custom-dropdown-menu__option">
                                <div className="custom-dropdown-menu__option-title">{value}</div>
                              </div>
                            ))}
                          </div>
                        </DropdownMenu>
                      </div>
                    </div>

                  </div>
                </div>
                <div className="admin-blog__modal-footer">
                  <button type="button" className="btn btn-outline-secondary admin-blog__modal-button" data-bs-dismiss="modal">Cancel</button>
                  <button type="submit" disabled={!departureOnly || !pickupTime} className="btn btn-success admin-blog__modal-button" data-bs-dismiss="modal">Scheduled Post</button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Layout>
    )
  }
}
