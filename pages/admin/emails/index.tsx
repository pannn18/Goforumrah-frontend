import Layout from "@/components/layout"
import Navbar from "@/components/layout/navbar"
import AdminLayout from "@/components/admin/layout"
import { useState, useEffect, useRef } from "react"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import Link from "next/link"
import { BlurPlaceholderImage } from "@/components/elements/images"
import { Images } from "@/types/enums"
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Filler, Legend, ScriptableContext } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { callAPI } from "@/lib/axiosHelper"
import { useSession } from "next-auth/react"

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Filler, Legend);

export default function AdminCustomerDetail() {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const handleSendEmailClick = () => {
    setTimeout(() => {
      setShowSuccessToast(true);
    }, 500);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 10000);
  };

  return (
    <Layout>
      <AdminLayout pageTitle="Emails">
        <div className="admin-email">
          <div className="container">
            <div className="admin-email__content-wrapper">
              <AdminEmailContent handleSent={() => handleSendEmailClick()} />
            </div>
          </div>
        </div>
      </AdminLayout>
      <NewMessageModal handleSent={() => handleSendEmailClick()} />
      <SuccessToast show={showSuccessToast} />
    </Layout>
  )
}

const SuccessToast = ({ show }) => {
  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
      <div id="liveToast" className={`toast admin-email__toast fade ${show ? 'show' : 'hide'}`} role="alert" aria-live="assertive" aria-atomic="true">
        <div className="toast-body">
          Message sent.
        </div>
        <div className="admin-email__toast-action">
          <button type="button" className="admin-email__toast-undo">UNDO</button>
          <div className="admin-email__toast-separator" data-bs-dismiss="toast" aria-label="Close"></div>
          <button type="button" className="btn-close btn-close-white me-2 m-auto admin-email__toast-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    </div>
  )
}

const AdminEmailContent = ({ handleSent }) => {
  const [showReply, setShowReply] = useState(false);
  const [showForward, setShowForward] = useState(false);

  // Retrive Data From API
  const [emailData, setEmailData] = useState(null)
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailOk, setEmailOk] = useState(null)
  const [emailError, setEmailError] = useState(null)

  const [emailSelected, setEmailSelected] = useState(null)
  const [emailSelectedLoading, setEmailSelectedLoading] = useState(null)
  const [emailSelectedOk, setEmailSelectedOk] = useState(null)
  const [emailSelectedError, setEmailSelectedError] = useState(null)

  const email_category = {
    inbox: 1,
    draft: 3,
    sent: 4,
    delivered: 2
  }

  const [selectedType, setSelectedType] = useState(email_category.inbox);

  const handleTypeChange = (type) => {
    setEmailSelected(null)
    setSelectedType(type);
  };

  const [idMail, setIdMail] = useState(null)

  const { data, status } = useSession()
  const id_admin = (status === 'authenticated' || data) ? Number(data.user.id) : null;

  useEffect(() => {
    const fetchEmailData = async () => {
      setEmailLoading(true)
      const { status, data, ok, error } = await callAPI('/admin-email/show-all', 'POST', { "email_type": 1, "status": selectedType }, true);
      if (error) {
        setEmailError(true)
      } else {
        if (ok) {
          setEmailData(data)
          setEmailOk(ok)
        }
      }
      setEmailLoading(false)
    }
    fetchEmailData()
  }, [selectedType])

  useEffect(() => {
    const fetchEmailSelected = async () => {
      setEmailSelectedLoading(true)
      const { status, data, ok, error } = await callAPI('/admin-email/show', 'POST', { "id_email": idMail }, true);
      if (error) {
        setEmailSelectedError(true)
      } else {
        if (ok) {
          setEmailSelected(data)
          setEmailSelectedOk(ok)
        }
      }
      setEmailSelectedLoading(false)
    }
    fetchEmailSelected()
  }, [idMail])

  const toggleReply = () => {
    setShowReply(!showReply);
  };

  const toggleForward = () => {
    setShowForward(!showForward);
  }

  const [payloadReply, setPayloadReply] = useState({
    id_admin: id_admin,
    id_email: "",
    email_body: ""
  })

  useEffect(() => {
    if (!(status === 'authenticated') || !data) return
    setPayloadReply((prevFormData) => ({
      ...prevFormData,
      id_email: idMail,
    }));
  }, [idMail])

  const onSubmitReply = async (e) => {
    e.preventDefault()

    const { ok, error } = await callAPI('/admin-email/reply-email', 'POST', payloadReply, true);
    if (ok) {
      console.log('success');
    } else {
      console.log(error);
    }

    // Callback for toast
    handleSent()
  }

  const handleChangeStatusDraft = async (e) => {
    e.preventDefault()

    const { ok, error } = await callAPI('/admin-email/update-status', 'POST', { "id_email": idMail, "status": 3 }, true);
    if (ok) {
      console.log('success');
    } else {
      console.log(error);
    }
  }


  if (emailOk) {
    return (
      <div className="admin-email__email-content">
        <div className="admin-email__menu">
          <button type="button" className="admin-email__action-button" data-bs-toggle="modal" data-bs-target="#newMessageModal">
            <SVGIcon src={Icons.Plus} className="admin-agent__detail-header-back--icon" width={20} height={20} color="#FFFFFF" />
            <p className="admin-email__menu-btn-caption">Compose</p>
          </button>
          <div className="admin-email__menu-list">
            <button onClick={() => handleTypeChange(email_category.inbox)} className={`admin-email__menu-list-wrapper ${selectedType == 1 ? 'active' : ''}`}>
              <div className="admin-email__menu-list-content">
                <SVGIcon src={Icons.Box} className={`admin-email__menu-icon`} width={20} height={20} color="#616161" />
                <p className={`admin-email__menu-caption`}>Inbox</p>
              </div>
              <SVGIcon src={Icons.ArrowRight} className="admin-email__menu-btn-arrow" width={20} height={20} color="#8295A3" />
            </button>
            <button onClick={() => handleTypeChange(email_category.draft)} className={`admin-email__menu-list-wrapper ${selectedType == 3 ? 'active' : ''}`}>
              <div className="admin-email__menu-list-content">
                <SVGIcon src={Icons.File} className="admin-email__menu-icon" width={20} height={20} color="#616161" />
                <p className="admin-email__menu-caption">Draft</p>
              </div>
              <SVGIcon src={Icons.ArrowRight} className="admin-email__menu-btn-arrow" width={20} height={20} color="#8295A3" />
            </button>
            <button onClick={() => handleTypeChange(email_category.sent)} className={`admin-email__menu-list-wrapper ${selectedType == 4 ? 'active' : ''}`}>
              <div className="admin-email__menu-list-content">
                <SVGIcon src={Icons.Send} className="admin-email__menu-icon" width={20} height={20} color="#616161" />
                <p className="admin-email__menu-caption">Sent</p>
              </div>
              <SVGIcon src={Icons.ArrowRight} className="admin-email__menu-btn-arrow" width={20} height={20} color="#8295A3" />
            </button>
            <button onClick={() => handleTypeChange(email_category.delivered)} className={`admin-email__menu-list-wrapper ${selectedType == 2 ? 'active' : ''}`}>
              <div className="admin-email__menu-list-content">
                <SVGIcon src={Icons.Mail} className="admin-email__menu-icon" width={20} height={20} color="#616161" />
                <p className="admin-email__menu-caption">Delivered</p>
              </div>
              <SVGIcon src={Icons.ArrowRight} className="admin-email__menu-btn-arrow" width={20} height={20} color="#8295A3" />
            </button>
          </div>
        </div>
        <div className="admin-email__content-wrapper--mail w-75">
          <div className="admin-email__sender">
            <ul className="admin-email__sender-wrapper">
              {emailData.length == 0
                ? <p>Sorry, there aren't any mail</p>
                : emailData.map((item, index) => (
                  <li key={index}>
                    <button type="button" className="admin-email__sender-list" onClick={() => setIdMail(item.id_email)}>
                      <div className="admin-email__sender-header">
                        {/* <BlurPlaceholderImage className="admin-email__sender-image" src={Images.Placeholder} alt="Review Image" width={40} height={40} /> */}
                        <div className="admin-email__sender-profile">
                          <p className="admin-email__sender-name">{item.firstname}</p>
                          <p className="admin-email__sender-mail">{item.email_address}</p>
                        </div>
                      </div>
                      <p className="admin-email__sender-description">{item.email_body}</p>
                    </button>
                  </li>
                ))}
            </ul>
          </div>

          {emailSelectedLoading
            ? <div>Please Wait....</div>
            : emailSelected
              ? <div className="admin-email__content">
                <div className="admin-email__content-header">
                  <div className="admin-email__content-receiver">
                    <p className="admin-email__content-receiver-name">To: </p>
                    <div className="admin-email__content-header-mail">
                      <span>{emailSelected?.firstname} {emailSelected?.lastname}</span>
                      {emailSelected.email_address}
                    </div>
                  </div>
                  <div className="admin-email__content-action-header">
                    <button type="button" className="admin-email__content-header-icon">
                      <SVGIcon src={Icons.StarOutline} className="admin-agent__detail-header-back--icon" width={20} height={20} color="#616161" />
                    </button>
                    <button type="button" className="admin-email__content-header-icon">
                      <SVGIcon src={Icons.Printer} className="admin-agent__detail-header-back--icon" width={20} height={20} color="#616161" />
                    </button>
                    <button type="button" className="admin-email__content-header-icon">
                      <SVGIcon src={Icons.Trash} className="admin-agent__detail-header-back--icon" width={20} height={20} color="#616161" />
                    </button>
                    <button type="button" className="admin-email__content-header-icon">

                    </button>

                    <div className="dropdown">
                      <button className="admin-email__content-header-icon" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                        <SVGIcon src={Icons.More} className="admin-agent__detail-header-back--icon" width={20} height={20} color="#616161" />
                      </button>
                      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <li>
                          <a className="dropdown-item" href="#" onClick={handleChangeStatusDraft}>Save as draft</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="admin-email__separator-column"></div>
                <div className={`admin-email__content-chat ${showReply ? 'showReply' : ''} ${showForward ? 'showForward' : ''}`}>
                  <h5>{emailSelected?.firstname} {emailSelected?.lastname}</h5>
                  <p className="admin-email__content-chat-text">{emailSelected.email_body}</p>
                  {emailSelected.email_reply
                    ? <>
                      <div className="admin-email__separator-column"></div>
                      <div className="d-flex">
                        <SVGIcon src={Icons.BendUpRight} width={20} height={20} className="me-2" />
                        <h5 className="me-2">{emailSelected.email_reply.username}</h5>
                        <p>{emailSelected.email_reply.email}</p>
                      </div>
                      <p className="admin-email__content-chat-text">{emailSelected.email_reply.email_body}</p>
                    </>
                    : ''}
                </div>
                <div className={`admin-email__content-reply ${showReply ? 'showReply' : ''}`}>
                  <form onSubmit={onSubmitReply}>
                    <div className="admin-email__reply-header">
                      <button className="admin-email__reply-header-button">
                        <SVGIcon src={Icons.BendUpRight} className="admin-agent__detail-header-back--icon" width={20} height={20} color="#1B1B1BF5" />
                      </button>
                      <button className="admin-email__reply-header-button">
                        <SVGIcon src={Icons.ArrowDown} className="admin-agent__detail-header-back--icon" width={20} height={20} color="#1B1B1BF5" />
                      </button>
                      <p>No-reply@goforumrah.com</p>
                    </div>
                    <textarea id="msg" name="msg" rows={5} cols={50} className="admin-email__reply-textarea"
                      onChange={(e) => {
                        const newValue = e.target.value
                        setPayloadReply((prevData) => ({
                          ...prevData,
                          email_body: newValue,
                        }))
                      }}
                    ></textarea>
                    <div className="admin-email__reply-footer">
                      <div className="admin-email__content-action admin-email__content-action--reply">
                        <button type="button" className="admin-email__content-header-icon">
                          <SVGIcon src={Icons.Attach} className="admin-agent__detail-header-back--icon" width={20} height={20} color="#616161" />
                        </button>
                        <button type="button" className="admin-email__content-header-icon">
                          <SVGIcon src={Icons.Link} className="admin-agent__detail-header-back--icon" width={20} height={20} color="#616161" />
                        </button>
                        <button type="button" className="admin-email__content-header-icon">
                          <SVGIcon src={Icons.Image} className="admin-agent__detail-header-back--icon" width={20} height={20} color="#616161" />
                        </button>
                        <button type="button" className="admin-email__content-header-icon">
                          <SVGIcon src={Icons.Trash} className="admin-agent__detail-header-back--icon" width={20} height={20} color="#616161" />
                        </button>
                      </div>
                      <div className="admin-email__reply-btn-wrapper">
                        <button onClick={toggleReply} type="button" className="admin-email__reply-footer-button admin-email__reply-footer-button--outline-green">Cancel</button>
                        <button onClick={() => {
                          toggleReply()
                          handleSent
                        }} type="submit" id="liveToastBtn" className="admin-email__reply-footer-button admin-email__reply-footer-button--fill-green">Send</button>
                      </div>
                    </div>
                  </form>

                </div>
                <div className={`admin-email__content-forward ${showForward ? 'showForward' : ''}`}>
                  <div className="admin-email__forward-header">
                    <button className="admin-email__reply-header-button">
                      <SVGIcon src={Icons.BendUpLeft} className="admin-agent__detail-header-back--icon" width={20} height={20} color="#1B1B1BF5" />
                    </button>
                    <button className="admin-email__reply-header-button">
                      <SVGIcon src={Icons.ArrowDown} className="admin-agent__detail-header-back--icon" width={20} height={20} color="#1B1B1BF5" />
                    </button>
                    <div className="admin-email__forward-header-wrapper">
                      <p>No-reply@goforumrah.com</p>
                      <div className="admin-email__forward-input">
                        <label htmlFor="forward">To:</label>
                        <input type="text" placeholder="" className="admin-email__forward-input-form" />
                      </div>
                    </div>
                  </div>
                  <textarea id="msg" name="msg" rows={4} cols={50} className="admin-email__reply-textarea"></textarea>
                  <div className="admin-email__reply-footer">
                    <div className="admin-email__content-action admin-email__content-action--reply">
                      <button type="button" className="admin-email__content-header-icon">
                        <SVGIcon src={Icons.Attach} className="admin-agent__detail-header-back--icon" width={20} height={20} color="#616161" />
                      </button>
                      <button type="button" className="admin-email__content-header-icon">
                        <SVGIcon src={Icons.Link} className="admin-agent__detail-header-back--icon" width={20} height={20} color="#616161" />
                      </button>
                      <button type="button" className="admin-email__content-header-icon">
                        <SVGIcon src={Icons.Image} className="admin-agent__detail-header-back--icon" width={20} height={20} color="#616161" />
                      </button>
                      <button type="button" className="admin-email__content-header-icon">
                        <SVGIcon src={Icons.Trash} className="admin-agent__detail-header-back--icon" width={20} height={20} color="#616161" />
                      </button>
                    </div>
                    <div className="admin-email__reply-btn-wrapper">
                      <button onClick={toggleForward} type="button" className="admin-email__reply-footer-button admin-email__reply-footer-button--outline-green">Cancel</button>
                      <button type="button" className="admin-email__reply-footer-button admin-email__reply-footer-button--fill-green">Send</button>
                    </div>
                  </div>
                </div>
                <div className={`admin-email__content-action ${showReply ? 'showReply' : ''} ${showForward ? 'showForward' : ''}`}>
                  <button type="button" onClick={toggleForward} className="admin-email__content-action-btn">
                    <SVGIcon src={Icons.BendUpLeft} className="admin-agent__detail-header-back--icon" width={20} height={20} color="#1CB78D" />
                    <p className="admin-email__content-caption-btn">Forward</p>
                  </button>
                  <button type="button" onClick={toggleReply} className="admin-email__content-action-btn">
                    <p className="admin-email__content-caption-btn">Reply</p>
                    <SVGIcon src={Icons.BendUpRight} className="admin-agent__detail-header-back--icon" width={20} height={20} color="#1CB78D" />
                  </button>
                </div>
              </div>
              : ''}
        </div>
      </div>
    )
  }
}

const NewMessageModal = ({ handleSent }) => {
  const { data, status } = useSession()
  const email_admin = (status === 'authenticated' || data) ? String(data.user.email) : null;

  useEffect(() => {
    if (!(status === 'authenticated') || !data) return
    setFormData((prevFormData) => ({
      ...prevFormData,
      email_from: email_admin,
    }));
  }, [status, email_admin])

  const [formData, setFormData] = useState({
    email_address: "",
    email_from: "",
    subject: "",
    email_body: "",
    photos: []
  })

  const [errorMessage, setErrorMessage] = useState({
    email_addressValidation: '',
    subjectValidation: '',
    email_bodyValidation: '',
  })

  const alphabetCount = formData.email_body.length;
  const characterLimit = 50;
  const [image, setImage] = useState([])
  const fileInputRef = useRef(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleImageChange = async (event) => {
    const { name, files } = event.target;
    const selectedImages = Array.from(files);

    const base64Images = [];

    for (const imageFile of selectedImages) {
      try {
        const base64Image = await convertToBase64(imageFile);
        base64Images.push(base64Image);
      } catch (error) {
        console.error("Error converting image to base64:", error);
      }
    }

    setImage(base64Images)
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: base64Images,
    }));
  };

  useEffect(() => {
    // Validate form fields and update isFormValid state
    const validateForm = () => {
      const isValid =
        formData.email_address.trim() !== "" &&
        formData.subject.trim() !== "" &&
        formData.email_body.trim() !== "";

      setIsFormValid(isValid);
    };

    validateForm();
  }, [formData]);

  // Function to convert a file to base64 format
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault()

    const { ok, error } = await callAPI('/admin-email/create-email', 'POST', formData, true);
    if (ok) {
      console.log('success');
    } else {
      console.log(error);
    }

    setFormData({
      email_address: "",
      email_from: "",
      subject: "",
      email_body: "",
      photos: [],
    });

    setIsFormValid(false);

    // Call the handleSent callback
    handleSent();
  }


  return (
    <>
      <div className="modal fade" id="newMessageModal" tabIndex={-1} aria-labelledby="newMessageModalLabel" aria-hidden="true">
        <div className="modal-dialog admin-email__modal">
          <form onSubmit={onSubmit} className="modal-content admin-email__modal-content">
            <h5>New Message</h5>
            <div className="admin-email__modal-form">
              <div className="row">
                <div className='admin-agent__popup-edit-input admin-agent__popup-edit-addres col-xl-6 col-lg-6'>
                  <label htmlFor="email_address" className="admin-partner__popup-edit-caption">Recipient</label>
                  <input type="text" placeholder='recipient@mail.com' className="form-control goform-input" id="email_address" name="email_address" aria-describedby="addressHelp"
                    value={formData.email_address}
                    onChange={(e) => {
                      const newValue = e.target.value
                      setFormData((prevData) => ({
                        ...prevData,
                        email_address: newValue,
                      }))
                      if (!newValue.trim()) {
                        errorMessage.email_addressValidation = 'Recipient is required'
                      } else {
                        errorMessage.email_addressValidation = ''
                      }
                    }}
                  />
                  <div className="form-control-message form-control-message--error">
                    {errorMessage.email_addressValidation}
                  </div>
                </div>
                <div className="admin-partner__popup-edit-label col-xl-6 col-lg-6">
                  <label htmlFor="email_from" className="admin-partner__popup-edit-caption">From</label>
                  <input type="text" placeholder='Admin@goforumrah.com' className="form-control goform-input admin-partner__popup-edit-input" id="email_from" name="email_from" aria-describedby="email_fromHelp" readOnly
                    value={formData.email_from}
                  />
                </div>
              </div>
              <div className='admin-agent__popup-edit-input admin-agent__popup-edit-addres'>
                <label htmlFor="subject" className="admin-partner__popup-edit-caption">Subject</label>
                <input type="text" placeholder='Enter your subject' className="form-control goform-input" id="subject" aria-describedby="subjectHelp" name="subject"
                  value={formData.subject}
                  onChange={(e) => {
                    const newValue = e.target.value
                    setFormData((prevData) => ({
                      ...prevData,
                      subject: newValue,
                    }))
                    if (!newValue.trim()) {
                      errorMessage.subjectValidation = 'Subject is required'
                    } else {
                      errorMessage.subjectValidation = ''
                    }
                  }}
                />
                <div className="form-control-message form-control-message--error">
                  {errorMessage.subjectValidation}
                </div>
              </div>
              <div className='admin-agent__popup-edit-input admin-agent__popup-edit-addres'>
                <div className="admin-email__modal-textarea-wrapper">
                  <textarea placeholder="Type your taglines here.." rows={9} cols={50} className="admin-email__modal-textarea" id="email_body" name="email_body"
                    value={formData.email_body}
                    onChange={(e) => {
                      const newValue = e.target.value
                      setFormData((prevData) => ({
                        ...prevData,
                        email_body: newValue,
                      }))
                      if (!newValue.trim()) {
                        errorMessage.email_bodyValidation = 'Recipient is required'
                      } else {
                        errorMessage.email_bodyValidation = ''
                      }
                    }}
                  />
                  <div className="admin-email__character-count">
                    {alphabetCount}/{characterLimit}
                  </div>
                  <div className="form-control-message form-control-message--error">
                    {errorMessage.email_bodyValidation}
                  </div>
                </div>
              </div>
            </div>
            <div className="admin-email__modal-footer">
              <div className="admin-email__content-action admin-email__content-action--horizontal">
                <input
                  type="file"
                  id="photos"
                  name="photos"
                  multiple
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageChange} // Add onChange event handler
                />
                <button onClick={() => fileInputRef.current.click()} type="button" className="admin-email__content-header-icon">
                  <SVGIcon src={Icons.Image} className="admin-agent__detail-header-back--icon" width={20} height={20} color="#616161" />
                </button>
                {image.map((item, index) => (
                  <img key={index} src={item} alt={`Image Preview ${index}`} style={{ width: '50px', height: '50px' }} />
                ))}
                {/* <button type="button" className="admin-email__content-header-icon">
                  <SVGIcon src={Icons.Trash} className="admin-agent__detail-header-back--icon" width={20} height={20} color="#616161" />
                </button> */}
              </div>
              <div className="admin-email__reply-btn-wrapper">
                <button data-bs-dismiss="modal" type="button" className="admin-email__reply-footer-button admin-email__reply-footer-button--outline-green">Cancel</button>
                <button data-bs-dismiss="modal" type="submit" onClick={handleSent} className={`admin-email__reply-footer-button ${isFormValid ? 'admin-email__reply-footer-button--fill-green' : ''}`} disabled={!isFormValid}>Send</button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </>
  )
}