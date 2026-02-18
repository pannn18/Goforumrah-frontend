import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import { useEffect, useRef, useState } from "react"
import { Editor } from '@tinymce/tinymce-react';
import { Calendar } from 'react-date-range';
import moment from 'moment';
import { useRouter } from 'next/router'
import DropdownMenu from "@/components/elements/dropdownMenu"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import Link from "next/link"
import useFetch from "@/hooks/useFetch"
import { BlurPlaceholderImage } from "@/components/elements/images"
import { StaticImageData } from "next/image"
import blogThumbnail1 from '@/assets/images/blog_thumbnail_1.png'
import { callAPI } from "@/lib/axiosHelper";
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup";

export default function PartnerHotel() {
  const times = ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30']
  const [showDateDropdown, setShowDateDropdown] = useState<boolean>(false)
  const [showPickupTimeDropdown, setShowPickupTimeDropdown] = useState<boolean>(false)
  const [departureOnly, setDepartureOnly] = useState<Date>(null)
  const [pickupTime, setPickupTime] = useState<string>(null)
  const [blogStatus, setBlogStatus] = useState<number>(0)
  const handleClickPickupTimeOption = (pickupTime: string) => {
    setPickupTime(pickupTime)
    setShowPickupTimeDropdown(false)
  }

  const router = useRouter()

  const [formData, setFormData] = useState({
    id_blog_category: '',
    title: "",
    content: "",
    soft_delete: 0,
    title_icon: "",
    featured: 1,
  })

  const [image, setImage] = useState(null)
  let hasError = false

  const [errorMessage, setErrorMessage] = useState({
    imageValidation: '',
    titleValidation: '',
    contentValidation: '',
    categoryValidation: ''
  })

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

  const validateFile = (file) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const fileName = file.name.toLowerCase();
    return allowedExtensions.some(ext => fileName.endsWith(ext));
  };

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

  const handleDragOver = (e) => {
    e.preventDefault();
  }

  const ImageUploader = () => {
    const fileInputRef = useRef(null);

    return (
      <div>
        <input
          type="file"
          id="title_icon"
          name="title_icon"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <div
          onClick={() => fileInputRef.current.click()} // Ketika div diklik, klik juga pada elemen input file tersembunyi
          className="admin-blog__edit-header__thumbnail"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {image ? <img src={image} alt="Uploaded" /> : <p>Drag &amp; drop an image or Choose a File </p>}
        </div>
        <div className="form-control-message form-control-message--error">
          {errorMessage.imageValidation}
        </div>
      </div>
    );
  }

  const onMutate = (e) => {
    let boolean = null

    if (e.target.value === 'true') {
      boolean = true
    }
    if (e.target.value === 'false') {
      boolean = false
    }

    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: boolean ?? e.target.value,
      title_icon: image
    }))
  }

  const {
    id_blog_category,
    title,
    title_icon,
    content,
    featured,
    soft_delete,
  } = formData

  const { loading, data: categoryData, ok: okCategory, error: errorCategory } = useFetch('/blog-category/show', 'POST')


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
      status: blogStatus,
      datetime: (departureOnly || pickupTime) ? getDatetime(departureOnly, pickupTime) : moment().format('YYYY-MM-DD HH:mm:ss')
    }

    if (image == null || image === '') {
      errorMessage.imageValidation = 'Image Required'
      hasError = true
    } else {
      errorMessage.imageValidation = ''
    }

    if (formData.title == null || formData.title === '') {
      errorMessage.titleValidation = 'Title is required';
      hasError = true
    } else {
      errorMessage.titleValidation = '';
    }

    if (formData.content == null || formData.content === '') {
      errorMessage.contentValidation = 'Content is required';
      hasError = true
    } else {
      errorMessage.contentValidation = '';
    }

    if (formData.id_blog_category == null || formData.id_blog_category === '') {
      errorMessage.categoryValidation = 'Category is required';
      hasError = true
    } else {
      errorMessage.categoryValidation = '';
    }

    setErrorMessage({
      contentValidation: errorMessage.contentValidation,
      imageValidation: errorMessage.imageValidation,
      titleValidation: errorMessage.titleValidation,
      categoryValidation: errorMessage.categoryValidation
    })

    if (!hasError) {
      hasError = false
    }
    
    if (!hasError) {
      const { ok: okStore, error: errorStore } = await callAPI('/blog/store', 'POST', formDataCopy, true)
      if (okStore) {
        router.push(`/admin/blog`)
        console.log('Blog added successfully')
      }
      else {
        console.log(errorStore)
      }
    }
  }

  if (okCategory) {
    return (
      <Layout>
        <form onSubmit={onSubmit}>
          <AdminLayout pageTitle="Create Blog Post" enableBack={true}>
            <div className="container">
              <div className="admin-blog">
                <div className="admin-blog__wrapper">
                  <div className="admin-blog__edit-header">
                    <ImageUploader />
                    <div className="admin-blog__edit-header__detail">
                      <div className="admin-blog__edit-header__detail-group">
                        <label htmlFor="title" className="admin-blog__edit-header__detail-label">Title</label>
                        <input type="text" onChange={onMutate} name="title" id="title" className="admin-blog__edit-header__detail-input" />
                        <div className="form-control-message form-control-message--error">
                          {errorMessage.titleValidation}
                        </div>
                      </div>
                      <div className="admin-blog__edit-header__detail-group">
                        <label htmlFor="id_blog_category" className="admin-blog__edit-header__detail-label">Category</label>
                        <select onClick={onMutate} name="id_blog_category" id="id_blog_category" className="admin-blog__edit-header__detail-input">
                          <option disabled selected>--- Select Category ---</option>
                          {categoryData.map(item => (
                            <option key={item.id_blog_category} value={item.id_blog_category}>{item.name}</option>
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
                    initialValue=""
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
                      <button type="button" onClick={() => {setBlogStatus(0), setDepartureOnly(null), setPickupTime(null)}} className="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#draftModal">Save as Draft</button>
                      <button type="button" onClick={() => setBlogStatus(1)} className="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#scheduleModal">Schedule</button>
                      <button type="button" onClick={() => {setBlogStatus(2), setDepartureOnly(null), setPickupTime(null)}} className="btn btn-success" data-bs-toggle="modal" data-bs-target="#postModal">Post</button>
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