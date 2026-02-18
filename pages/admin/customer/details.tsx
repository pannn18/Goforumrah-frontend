import Layout from "@/components/layout";
import Navbar from "@/components/layout/navbar";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/admin/layout";
import SVGIcon from "@/components/elements/icons";
import iconSuspended from "assets/images/icon_suspended_soft.svg";
import iconCancel from "assets/images/icon_cancel_soft.svg";
import iconCheck from "assets/images/icon_check_soft.svg";
import { Icons } from "@/types/enums";
import Link from "next/link";
import { BlurPlaceholderImage } from "@/components/elements/images";
import DropdownMenu from "@/components/elements/dropdownMenu";
import { Images } from "@/types/enums";
import { callAPI } from "@/lib/axiosHelper";

export default function AdminCustomerDetail() {
  const [customerDetail, setCustomerDetail] = useState<any>({
    customer: {},
    recent_booking: {},
    hotel_business: {},
  });

  const router = useRouter();
  const id_customer = router.query.id;

  useEffect(() => {
    const getDataDetail = async () => {
      try {
        const { ok, error, data } = await callAPI(
          "/admin-customer/details",
          "POST",
          { id_customer: id_customer },
          true
        );
        if (error) {
          console.log(error);
        }
        if (ok && data) {
          setCustomerDetail(data);
          console.log("ppp", data);
        }
      } catch (error) {
        console.log("Error Fetching Data");
      }
    };

    if (id_customer) {
      getDataDetail();
    }
  }, [id_customer]);

  const { customer, recent_booking, hotel_business } = customerDetail;

  const handleSuspend = async (note) => {
    const { ok, error, data } = await callAPI(
      `/admin-customer/suspend`,
      "POST",
      { id_customer: id_customer, note: note },
      true
    );
    if (error) {
      console.log(error);
    }
    if (ok) {
      console.log(data);
      window.location.reload();
    }
  };

  const handleUnsuspend = async (status) => {
    const { ok, error, data } = await callAPI(
      `/customer/store`,
      "POST",
      { id_customer: id_customer, status: status },
      true
    );
    if (error) {
      console.log(error);
    }
    if (ok) {
      console.log(data);
      window.location.reload();
    }
  };

  console.log("Customer detail : ", customer);

  const handleDelete = async () => {
    const { ok, error, data } = await callAPI(
      `/admin-customer/block`,
      "POST",
      { id_customer: id_customer },
      true
    );
    if (error) {
      console.log(error);
    }
    if (ok) {
      console.log(data);
      router.push("/admin/customer");
    }
  };

  console.log("Customer detail : ", customer);

  return (
    <Layout>
      <AdminLayout pageTitle="Customer Details" enableBack={true}>
        <div className="admin-customer">
          <div className="container">
            {customer.status === 2 && <BannerBlocked />}
            <ActiveModal
              handleActivated={() => {
                handleUnsuspend(1);
              }}
            />
            <PopupSuspend
              handleSuspended={(note) => {
                handleSuspend(note);
              }}
            />
            <DeleteModal
              handleDeleted={() => {
                handleDelete(); // Added parentheses to invoke the function
              }}
            />
            <PopupNote note={customer?.note} />
            <div className="admin-customer__detail">
              <div className="admin-customer__detail-wrapper">
                <AdminCustomerDetailContent customerDetails={customer} />
                <DashboardTable customerDetails={recent_booking} />
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </Layout>
  );
}

const BannerBlocked = () => {
  return (
    <div className="admin-customer__banner-blocked">
      <div className="admin-customer__banner-blocked-content">
        <div className="admin-customer__banner-blocked-content--left">
          <div className="admin-customer__banner-block-image">
            <SVGIcon
              src={Icons.Disabled}
              width={24}
              height={24}
              color="#FFFFFF"
            />
          </div>
          <div className="admin-customer__banner-block-caption">
            <p className="admin-customer__banner-block-title">
              Account has been suspended
            </p>
            <p>You can reactivate it by pressing the “set active” button</p>
          </div>
        </div>
        <div className="admin-customer__banner-block-action">
          <button
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#popUpNote"
            className="button goform-button goform-button--outline-green goform-button--large-text admin-cutomer__banner-block-button"
          >
            View Note
          </button>
          <button
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#popUpComplete"
            className="button admin-customer__banner-block-action--active "
          >
            <SVGIcon
              src={Icons.CheckRoundedWhite}
              width={16}
              height={16}
              color="#74CC50"
            />
            <p>Set Active</p>
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminCustomerDetailContent = (props) => {
  const customerDetails = props.customerDetails;

  const { id_customer, customer_personal, last_active, soft_delete, status } =
    customerDetails;

  const createdAt = customer_personal?.created_at;
  // Format the date using JavaScript Date object
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString()
    : "";

  return (
    <div className="admin-customer__detail-content">
      <div className="admin-customer__detail-content__header">
        <img
          className="admin-customer__detail-image"
          src={customer_personal?.profile_photo || Images.Placeholder}
          alt="Customer Profile"
          width={154}
          height={154}
        />
        <div className="admin-customer__detail-content__header-right">
          <div className="admin-customer__detail-content__info">
            <p className="admin-customer__detail-content__info-id">
              #{id_customer}
            </p>
            <div className="admin-customer__detail-content__info-profile">
              <h5>{customer_personal?.fullname || "NULLNAME"}</h5>
              <div className="admin-customer__detail-info-wrapper">
                <div className="admin-customer__detail-content__info-profile-details">
                  <p className="admin-customer__detail-content__info-profile-caption">
                    {customer_personal?.email || "NULLEMAIL"}
                  </p>
                  <p className="admin-customer__detail-content__info-profile-caption">
                    {customer_personal?.phone || "NULLPHONE"}
                  </p>
                  <div className="admin-customer__detail-content__info-profile-wrapper">
                    <BlurPlaceholderImage
                      className="admin-customer__detail-image--square"
                      src={Images.Placeholder}
                      alt="Review Image"
                      width={20}
                      height={20}
                    />
                    <p className="">
                      {customer_personal?.country || "NULLLOCATION"}
                    </p>
                  </div>
                </div>
                <div className="admin-customer__detail-separator"></div>
                <div className="admin-customer__detail-content__info-profile-details">
                  <div className="admin-customer__detail-content__info-profile-wrapper--column">
                    <p className="">Status</p>
                    {status === 0 && (
                      <div className="admin-partner__table-status admin-partner__table-status--waiting mx-0">
                        Need Review
                      </div>
                    )}
                    {status === 1 && (
                      <div className="admin-partner__table-status admin-partner__table-status--paid mx-0">
                        Active
                      </div>
                    )}
                    {status === 2 && (
                      <div className="admin-partner__table-status admin-partner__table-status--ongoing mx-0">
                        Suspended
                      </div>
                    )}
                    {soft_delete === 1 && (
                      <div className="admin-partner__table-status admin-partner__table-status--danger mx-0">
                        Declined
                      </div>
                    )}
                  </div>
                  <div className="admin-customer__detail-content__info-profile-wrapper--column">
                    <p className="">Joined Since</p>
                    <div className="admin-customer__detail-content__info-profile-time">
                      <SVGIcon
                        src={Icons.Calendar}
                        className="admin-customer__detail-header-back--icon"
                        width={16}
                        height={16}
                        color="#1B1B1B"
                      />
                      <p>{formattedDate}</p>
                    </div>
                  </div>
                  <div className="admin-customer__detail-content__info-profile-wrapper--column">
                    <p className="">Last Active</p>
                    <div className="admin-customer__detail-content__info-profile-time">
                      <SVGIcon
                        src={Icons.CircleTime}
                        className="admin-customer__detail-header-back--icon"
                        width={16}
                        height={16}
                        color="#1B1B1B"
                      />
                      <p>{last_active}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="admin-customer__detail-content__action">
            {(status === 0 || status === 1) && (
              <button
                type="button"
                className="admin-customer__action-button admin-customer__action-button--suspend"
                data-bs-toggle="modal"
                data-bs-target="#popUpSuspend"
              >
                <SVGIcon
                  src={Icons.Disabled}
                  className="admin-customer__detail-header-back--icon"
                  width={20}
                  height={20}
                  color="#FFFFFF"
                />
                <p>Suspend</p>
              </button>
            )}
            <button
              type="button"
              className="admin-customer__action-button admin-customer__action-button--danger "
              data-bs-toggle="modal"
              data-bs-target="#deleteModal"
            >
              <SVGIcon
                src={Icons.Trash}
                className="admin-customer__detail-header-back--icon"
                width={20}
                height={20}
                color="#FFFFFF"
              />
              <p>Delete</p>
            </button>
            {/* <button
              type="button"
              className="button goform-button goform-button--outline-green goform-button--large-text hotel-registration__button-list-item admin-customer__action-button-edit"
              data-bs-toggle="modal"
              data-bs-target="#editModal"
            >
              Edit
            </button> */}
          </div>
        </div>
      </div>
      <div className="admin-customer__detail-separator"></div>
    </div>
  );
};

const DashboardTable = (props) => {
  const customerDetails = props.customerDetails;

  const { id_customer, hotel } = customerDetails;
  console.log("Cust Detail", customerDetails);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  useEffect(() => {
    if (customerDetails && customerDetails.length > 0) {
      setTotalPages(Math.ceil(customerDetails.length / itemsPerPage));
    } else {
      setTotalPages(1);
    }
  }, [customerDetails, itemsPerPage]);

  const currentItems =
    customerDetails?.length > 0
      ? customerDetails?.slice(startIndex, endIndex)
      : [];

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined);
  };

  return (
    <div className="admin-customer__data">
      <div className="table-responsive">
        <table className="admin-customer__data-table">
          <thead>
            <tr className="admin-customer__data-list">
              <th>No.</th>
              <th>Booking Name</th>
              <th>Booking Type</th>
              <th>Date</th>
              <th className="admin-customer__data-list--center">Status</th>
              <th>Total</th>
              <th className="admin-customer__data-list--center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems?.length > 0 &&
              currentItems.map((booking, index) => (
                <tr key={index} className="admin-customer__data-list">
                  <td>{startIndex + index + 1}</td>
                  <td>{booking.hotel?.property_name}</td>
                  <td>
                    {" "}
                    {booking.id_hotel
                      ? "Hotel"
                      : booking.id_car_business
                      ? "Car"
                      : "Other type"}
                  </td>
                  <td>
                    <div className="admin-customer__table-list--icon">
                      <SVGIcon
                        src={Icons.Calendar}
                        width={20}
                        height={20}
                        className=""
                      />
                      {formatDate(booking.created_at)}
                    </div>
                  </td>
                  <td>
                    {booking.status === 0 && (
                      <div className="admin-partner__table-status admin-partner__table-status--ongoing mx-0">
                        Payment Needed
                      </div>
                    )}
                    {booking.status === 1 && (
                      <div className="admin-partner__table-status admin-partner__table-status--waiting mx-0">
                        Credit Card Not Verified
                      </div>
                    )}
                    {booking.status === 2 && (
                      <div className="admin-partner__table-status admin-partner__table-status--ongoing mx-0">
                        Confirmed
                      </div>
                    )}
                    {booking.status === 3 && (
                      <div className="admin-partner__table-status admin-partner__table-status--waiting mx-0">
                        Rejected
                      </div>
                    )}
                    {booking.status === 4 && (
                      <div className="admin-partner__table-status admin-partner__table-status--danger mx-0">
                        Cancelled
                      </div>
                    )}
                    {booking.status === 6 && (
                      <div className="admin-partner__table-status admin-partner__table-status--paid mx-0">
                        Complete
                      </div>
                    )}
                  </td>
                  <td>$ {booking.price_amount}</td>
                  <td>
                    <div className="admin-customer__data-list--center">
                      <Link
                        href={`/admin/booking/hotel/detail?id=${booking.id_hotel_booking}`}
                      >
                        <button className="button goform-button goform-button--outline-green goform-button--large-text admin-customer__data-button">
                          Detail
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            {!currentItems?.length && (
              <tr className="admin-customer__table-list">
                <td colSpan={9} className="text-center">
                  Sorry, No Data Booking found..
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="hotel-details__guest-pagination">
        <div className="pagination">
          <button
            type="button"
            className={`pagination__button pagination__button--arrow${
              currentPage > 1 ? "" : "disabled"
            }`}
            onClick={() => {
              setCurrentPage(currentPage - 1);
              setLoading(true);
            }}
            disabled={currentPage === 1}
          >
            <SVGIcon src={Icons.ArrowLeft} width={24} height={24} />
          </button>

          {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map(
            (number) => {
              const isCloseToCurrent =
                number >= currentPage - 2 && number <= currentPage + 2;
              const hasMoreOnLeft = number !== 1 && number === currentPage - 3;
              const hasMoreOnRight =
                number !== totalPages && number === currentPage + 3;
              const isFirst = number === 1;
              const isLast = number === totalPages;

              const isVisible =
                isCloseToCurrent ||
                hasMoreOnLeft ||
                hasMoreOnRight ||
                isFirst ||
                isLast;

              return (
                isVisible && (
                  <button
                    key={number}
                    onClick={() =>
                      !(hasMoreOnLeft || hasMoreOnRight) &&
                      (setLoading(true), setCurrentPage(number))
                    }
                    type="button"
                    className={`pagination__button ${
                      number === currentPage ? "active" : ""
                    }`}
                    style={{
                      cursor:
                        hasMoreOnLeft || hasMoreOnRight ? "default" : "pointer",
                    }}
                  >
                    {hasMoreOnLeft || hasMoreOnRight ? "..." : number}
                  </button>
                )
              );
            }
          )}

          <button
            type="button"
            className={`pagination__button pagination__button--arrow${
              currentPage === totalPages ? "disabled" : ""
            }`}
            onClick={() => {
              setCurrentPage(currentPage + 1);
              setLoading(true);
            }}
            disabled={currentPage === totalPages}
          >
            <SVGIcon src={Icons.ArrowRight} width={24} height={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

const PopupSuspend = ({
  handleSuspended,
}: {
  handleSuspended: (note: string) => void;
}) => {
  const [note, setNote] = useState("");

  const handleNoteChange = (e) => {
    const noteValue = e.target.value;
    setNote(noteValue);
  };

  return (
    <div
      className="modal fade"
      id="popUpSuspend"
      tabIndex={-1}
      aria-labelledby="popUpSuspendLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog cancelation__modal admin-customer__modal-block">
        <div className="modal-content admin-customer__add-modal-content">
          <div className="admin-booking-hotel__popup-form">
            <div className="admin-booking-hotel__popup-form-content">
              <BlurPlaceholderImage
                className=""
                alt="image"
                src={iconSuspended}
                width={72}
                height={72}
              />
              <div className="admin-booking-hotel__popup-contents">
                <h3 className="admin-booking-hotel__content-title-heading admin-booking-hotel__content-title-heading--popup">
                  Suspend this Customer ?
                </h3>
                <p className="admin-booking-hotel__content-caption--popup">
                  Please give a reason before to continue suspend this Customer
                </p>
              </div>
              <textarea
                name="note"
                id="note"
                cols={10}
                rows={4}
                // value={note}
                onChange={(e) => handleNoteChange(e)}
                placeholder="Give me a reason"
              ></textarea>
            </div>
            <div className="admin-booking-hotel__popup-footer">
              <button
                type="button"
                className="button goform-button goform-button--outline-grey goform-button--large-text admin-booking-hotel__button-list-item"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSuspended(note)}
                className="btn btn-md btn-success"
                data-bs-dismiss="modal"
              >
                Yes, Suspend
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const ActiveModal = ({
  handleActivated,
}: {
  handleActivated: (status: number) => void;
}) => {
  return (
    <>
      <div
        className="modal fade"
        id="popUpComplete"
        tabIndex={-1}
        aria-labelledby="popUpCompleteLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog cancelation__modal admin-customer__modal-block">
          <div className="modal-content admin-customer__add-modal-content">
            <div className="admin-booking-hotel__popup-form">
              <div className="admin-booking-hotel__popup-form-content">
                <BlurPlaceholderImage
                  className=""
                  alt="image"
                  src={iconCheck}
                  width={72}
                  height={72}
                />
                <div className="admin-booking-hotel__popup-contents">
                  <h3 className="admin-booking-hotel__content-title-heading admin-booking-hotel__content-title-heading--popup">
                    Reactive this customer ?
                  </h3>
                  <p className="admin-booking-hotel__content-caption--popup">
                    Mark this activity to indicate the user customer is
                    reactivated.
                  </p>
                </div>
              </div>
              <div className="admin-booking-hotel__popup-footer">
                <button
                  type="button"
                  className="button goform-button goform-button--outline-grey goform-button--large-text admin-booking-hotel__button-list-item"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-md btn-success"
                  data-bs-dismiss="modal"
                  onClick={() => handleActivated(1)}
                >
                  Yes, Reactive
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
const DeleteModal = ({ handleDeleted }: { handleDeleted: () => void }) => {
  const handleButtonClick = () => {
    handleDeleted(); // Added parentheses to invoke the function
  };

  return (
    <div
      className="modal fade"
      id="deleteModal"
      tabIndex={-1}
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog cancelation__modal admin-customer__modal-block">
        <div className="modal-content admin-customer__add-modal-content">
          <div className="admin-booking-hotel__popup-form">
            <div className="admin-booking-hotel__popup-form-content">
              <BlurPlaceholderImage
                className=""
                alt="image"
                src={iconCancel}
                width={72}
                height={72}
              />
              <div className="admin-booking-hotel__popup-contents">
                <h3 className="admin-booking-hotel__content-title-heading admin-booking-hotel__content-title-heading--popup">
                  Delete this Customer ?
                </h3>
                <p className="admin-booking-hotel__content-caption--popup">
                  Are you sure you want to delete this customer? This action
                  cannot be undone.
                </p>
              </div>
            </div>
            <div className="admin-booking-hotel__popup-footer">
              <button
                type="button"
                className="button goform-button goform-button--outline-grey goform-button--large-text admin-booking-hotel__button-list-item"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-md btn-success"
                data-bs-dismiss="modal"
                onClick={() => handleButtonClick()}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const PopupNote = ({ note }: { note: string }) => {
  return (
    <div
      className="modal fade"
      id="popUpNote"
      tabIndex={-1}
      aria-labelledby="popUpNoteLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog cancelation__modal admin-customer__modal-block">
        <div className="modal-content admin-customer__add-modal-content admin-booking-hotel__popup-form-note__wrapper">
          <div className="admin-booking-hotel__popup-form admin-booking-hotel__popup-form-note">
            <div className="admin-booking-hotel__popup-form-note-header">
              <h5>Note</h5>
              <textarea
                name="#"
                id="#"
                cols={10}
                rows={4}
                value={note}
              ></textarea>
            </div>
            <div className="admin-booking-hotel__popup-footer">
              <button
                className="btn btn-sm btn-success"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
