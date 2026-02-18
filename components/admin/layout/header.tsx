import { BlurPlaceholderImage } from "@/components/elements/images";
import React, { useEffect, useState } from "react";
import defaultProfileImage from "@/assets/images/default_profile_64x64.png";
import SVGIcon from "@/components/elements/icons";
import DropdownMenu from "@/components/elements/dropdownMenu";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Icons } from "@/types/enums";
import logoText from "@/assets/images/logo_text_dark.svg";
import { signOut } from "next-auth/react";
import { callAPI } from "@/lib/axiosHelper";
import moment from "moment";

interface HeaderProps {
  pageTitle?: string;
  enableBack?: Boolean;
}
const Header = (props: HeaderProps) => {
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState<boolean>(false);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);
  const router = useRouter();

  const [dataNotifications, setDataNotifications] = useState<any>([]);
  const [newNotifications, setNewNotifications] = useState<boolean>(false);

  const getDataNotifications = async () => {
    try {
      const { ok, error, data } = await callAPI(
        "/admin-notifications/show-all",
        "GET",
        {},
        true
      );
      if (error) {
        console.log(error);
      }
      if (ok && data) {
        setDataNotifications(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (dataNotifications.length === 0) {
      getDataNotifications();
    }
    if (dataNotifications.length > 0) {
      setNewNotifications(dataNotifications.some((item) => item.status === 1));
    }
  }, [dataNotifications, dataNotifications.length]);

  const formatTime = (date) => {
    return moment(date).fromNow();
  };

  const handleReadNotification = async (id_admin_notifications) => {
    const { error, ok, data } = await callAPI(
      "/admin-notifications/mark-as-read",
      "POST",
      { id_admin_notifications: id_admin_notifications },
      true
    );
    if (error) {
      console.log(error);
    }
    if (ok && data) {
      console.log(data);
    }
  };

  return (
    <div className="admin-header">
      <div className="admin-header__title-wrapper">
        <button
          className="admin-header__sidemenu-toggle"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasLeft"
          aria-controls="offcanvasLeft"
        >
          <SVGIcon src={Icons.Sort} width={24} height={24} />
        </button>
        {props.enableBack ? (
          <button
            type="button"
            className="admin-header__title-back"
            onClick={() => router.back()}
          >
            <SVGIcon src={Icons.ArrowLeft} width={24} height={24} />
            <h4 className="admin-header__title">
              {props.pageTitle ? `${props.pageTitle}` : "Dashboard"}
            </h4>
          </button>
        ) : (
          <h4 className="admin-header__title">
            {props.pageTitle ? `${props.pageTitle}` : "Dashboard"}
          </h4>
        )}
      </div>
      <div className="admin-header__right-content">
        <div className="admin-header__search">
          <input type="text" className="form-control" placeholder="Search" />
          <SVGIcon src={Icons.Search} width={20} height={20} />
        </div>
        <div className="custom-dropdown">
          <div
            className="admin-header__notification"
            onClick={() => setShowNotificationDropdown(true)}
          >
            <SVGIcon
              src={Icons.Bell}
              width={24}
              height={24}
              className={`admin-header__notification-toggle admin-header__notification-toggle${newNotifications ? "--has-dot" : ""
                }`}
            />
          </div>
          <DropdownMenu
            show={showNotificationDropdown}
            setShow={setShowNotificationDropdown}
            className="admin-header__notification-dropdown"
            style={{ marginTop: 16, width: 336 }}
          >
            <div className="admin-header__notification-dropdown__header">
              <p>Notification</p>
            </div>
            <div className="admin-header__notification-dropdown__list">
              {/* Looping data notifications */}
              {dataNotifications.length !== 0 &&
                dataNotifications.map((data, index) => (
                  <Link
                    key={index}
                    href="#"
                    className="admin-header__notification-dropdown__list-item"
                    onClick={() =>
                      handleReadNotification(data?.id_admin_notifications)
                    }
                  >
                    <div className="admin-header__notification-dropdown__list-content">
                      <p className="admin-header__notification-dropdown__list-content-title">
                        New messages from <b>{data?.email_address}</b>
                      </p>
                      <p className="admin-header__notification-dropdown__list-content-time">
                        {formatTime(data?.created_at)}
                      </p>
                    </div>
                    <div className="admin-header__notification-dropdown__list-profile">
                      <BlurPlaceholderImage
                        src={defaultProfileImage}
                        alt="Administrator"
                        width={48}
                        height={48}
                        className=""
                      />
                      <div
                        className={`admin-header__notification-dropdown__list-profile${data?.status === 1 ? "--dot" : ""
                          }`}
                      ></div>
                    </div>
                  </Link>
                ))}
            </div>
            <div>
              <Link
                href="#"
                className="admin-header__notification-dropdown__footer"
              >
                View All Notification
              </Link>
            </div>
          </DropdownMenu>
        </div>
        <div className="admin-header__user custom-dropdown">
          <div
            className="admin-header__user-toggle"
            onClick={() => setShowUserDropdown(true)}
          >
            <div className="admin-header__user-group">
              <div className="admin-header__user-name">John Doe</div>
              <div className="admin-header__user-title">Administrator</div>
            </div>
            <SVGIcon
              src={Icons.ArrowDown}
              width={20}
              height={20}
              className="admin-header__user-arrow"
            />
          </div>
          <DropdownMenu
            show={showUserDropdown}
            setShow={setShowUserDropdown}
            className="admin-header__user-dropdown"
            style={{ marginTop: 16, width: 202 }}
          >
            <Link
              href={"/admin/account-setting"}
              className="admin-header__user-dropdown__link"
            >
              <SVGIcon
                src={Icons.Setting}
                width={20}
                height={20}
                className=""
              />
              Accout Setting
            </Link>
            <a
              type="button"
              onClick={() => signOut()}
              className="admin-header__user-dropdown__link"
            >
              <SVGIcon src={Icons.Logout} width={20} height={20} className="" />
              Logout
            </a>
          </DropdownMenu>
        </div>
      </div>
      <AdminOffCanvas />
    </div>
  );
};

const AdminOffCanvas = () => {
  const { pathname } = useRouter();
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState<boolean>(false);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);

  return (
    <div
      className="offcanvas offcanvas-start admin-sidebar-offcanvas"
      tabIndex={-1}
      id="offcanvasLeft"
      aria-labelledby="offcanvasLeftLabel"
    >
      <div className="offcanvas-header admin-sidebar-offcanvas__header">
        <Image src={logoText} alt="GoForUmrah" width={146} height={26} />
        <SVGIcon
          src={Icons.Bell}
          width={24}
          height={24}
          className="admin-sidebar-offcanvas__notification-toggle admin-sidebar-offcanvas__notification-toggle--has-dot"
        />
        <button
          type="button"
          className="admin-sidebar-offcanvas__header-button"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        >
          <SVGIcon src={Icons.Cancel} width={24} height={24} />
        </button>
      </div>
      <div className="offcanvas-body admin-sidebar-offcanvas__body">
        <div className="admin-sidebar-menu-wrapper">
          <Link
            href={"/admin"}
            className={`admin-sidebar-menu ${pathname === "/admin" ? "active" : ""
              }`}
          >
            <SVGIcon src={Icons.SquaresFor} width={20} height={20} />
            <span>Dashboard</span>
          </Link>
          <div>
            <a
              className={`admin-sidebar-menu ${pathname.includes("/admin/booking/") ? "active" : "collapsed"
                }`}
              data-bs-toggle="collapse"
              href="#sidebar-booking-menu"
              role="button"
              aria-expanded={!!pathname.includes("/admin/booking/")}
              aria-controls="sidebar-booking-menu"
            >
              <SVGIcon src={Icons.Book} width={20} height={20} />
              <span>Booking</span>
              <SVGIcon
                src={Icons.ArrowDown}
                width={20}
                height={20}
                className="admin-sidebar-menu__arrow"
              />
            </a>
            <div
              id="sidebar-booking-menu"
              className={`admin-sidebar-menu-children collapse ${pathname.includes("/admin/booking/") ? "show" : ""
                }`}
            >
              <Link
                href={"/admin/booking/hotel"}
                className={`admin-sidebar-menu ${pathname === "/admin/booking/hotel" ? "active" : ""
                  }`}
              >
                <SVGIcon src={Icons.DownRight} width={20} height={20} />
                <span>Hotel</span>
              </Link>
              <Link
                href={"/admin/booking/flight"}
                className={`admin-sidebar-menu ${pathname === "/admin/booking/flight" ? "active" : ""
                  }`}
              >
                <SVGIcon src={Icons.DownRight} width={20} height={20} />
                <span>Flight</span>
              </Link>
              <Link
                href={"/admin/booking/car"}
                className={`admin-sidebar-menu ${pathname === "/admin/booking/car" ? "active" : ""
                  }`}
              >
                <SVGIcon src={Icons.DownRight} width={20} height={20} />
                <span>Car</span>
              </Link>
            </div>
          </div>
          <div>
            <a
              className={`admin-sidebar-menu ${pathname.includes("/admin/partner/") ? "active" : "collapsed"
                }`}
              data-bs-toggle="collapse"
              href="#sidebar-partner-menu"
              role="button"
              aria-expanded={!!pathname.includes("/admin/partner/")}
              aria-controls="sidebar-partner-menu"
            >
              <SVGIcon src={Icons.Suitcase} width={20} height={20} />
              <span>Partner</span>
              <SVGIcon
                src={Icons.ArrowDown}
                width={20}
                height={20}
                className="admin-sidebar-menu__arrow"
              />
            </a>
            <div
              id="sidebar-partner-menu"
              className={`admin-sidebar-menu-children collapse ${pathname.includes("/admin/partner/") ? "show" : ""
                }`}
            >
              <Link
                href={"/admin/partner/hotel"}
                className={`admin-sidebar-menu ${pathname === "/admin/partner/hotel" ? "active" : ""
                  }`}
              >
                <SVGIcon src={Icons.DownRight} width={20} height={20} />
                <span>Hotel</span>
              </Link>
              <Link
                href={"/admin/partner/flight"}
                className={`admin-sidebar-menu ${pathname === "/admin/partner/flight" ? "active" : ""
                  }`}
              >
                <SVGIcon src={Icons.DownRight} width={20} height={20} />
                <span>Flight</span>
              </Link>
              <Link
                href={"/admin/partner/car"}
                className={`admin-sidebar-menu ${pathname === "/admin/partner/car" ? "active" : ""
                  }`}
              >
                <SVGIcon src={Icons.DownRight} width={20} height={20} />
                <span>Car</span>
              </Link>
            </div>
          </div>
          <Link
            href={"/admin/customer"}
            className={`admin-sidebar-menu ${pathname === "/admin/customer" ? "active" : ""
              }`}
          >
            <SVGIcon src={Icons.User} width={20} height={20} />
            <span>Customer</span>
          </Link>
          <Link
            href={"/admin/agent"}
            className={`admin-sidebar-menu ${pathname.startsWith("/admin/agent") ? "active" : ""
              }`}
          >
            <SVGIcon src={Icons.User} width={20} height={20} />
            <span>Agent</span>
          </Link>
          <Link
            href={"/admin/emails"}
            className={`admin-sidebar-menu ${pathname === "/admin/emails" ? "active" : ""
              }`}
          >
            <SVGIcon src={Icons.Mail} width={20} height={20} />
            <span>Emails</span>
          </Link>
          <Link
            href={"/admin/blog"}
            className={`admin-sidebar-menu ${pathname.startsWith("/admin/blog") ? "active" : ""
              }`}
          >
            <SVGIcon src={Icons.Articles} width={20} height={20} />
            <span>Blog</span>
          </Link>
          <Link
            href={"/admin/setting"}
            className={`admin-sidebar-menu ${pathname.startsWith("/admin/setting") ? "active" : ""
              }`}
          >
            <SVGIcon src={Icons.Setting} width={20} height={20} />
            <span>Setting</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
