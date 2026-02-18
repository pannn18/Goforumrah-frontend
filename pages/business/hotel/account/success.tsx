import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout_business-account"
import Navbar from "@/components/layout/navbar"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import Link from "next/link"


export default function MenuSettingBusiness() {
    return (
        <AdminLayout>
            <div className="container container-menusettings">
                <div className="admin-settings__wrapper">
                    <MenuBarSettings />
                    <ContentSuccess />
                </div>
            </div>
        </AdminLayout>
    )
}

const MenuBarSettings = () => {
    return (
        <div className="admin-business-settings__menu">
            <div className="admin-business-settings__menu-list">
                <Link href="/business/hotel/account/change-password" className="admin-business-settings__menu-item active">
                    <SVGIcon className="admin-business-settings__menu-item--icon" src={Icons.Lock} width={20} height={20} />
                    <p className="admin-business-settings__menu-desc">Change Password</p>
                    <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="admin-business-settings__menu-item--arrow" />
                </Link>
                <Link href="/business/hotel/account/manage-user" className="admin-business-settings__menu-item ">
                    <SVGIcon className="admin-business-settings__menu-item--icon" src={Icons.UserThreeOutline} width={20} height={20} />
                    <p className="admin-business-settings__menu-desc">Manage User</p>
                    <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="admin-business-settings__menu-item--arrow" />
                </Link>
                <Link href="#" className="admin-business-settings__menu-item ">
                    <SVGIcon className="admin-business-settings__menu-item--icon" src={Icons.MonitorOutline} width={20} height={20} />
                    <p className="admin-business-settings__menu-desc">Linked Device</p>
                    <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="admin-business-settings__menu-item--arrow" />
                </Link>
                <Link href="#" className="admin-business-settings__menu-item">
                    <SVGIcon className="admin-business-settings__menu-item--icon" src={Icons.Logout} width={20} height={20} />
                    <p className="admin-business-settings__menu-desc">Logout</p>
                    <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="admin-business-settings__menu-item--arrow" />
                </Link>
            </div>
        </div>
    )
}


const ContentSuccess = () => {
    return (
        <div className="admin-menu-settings__content-modal">
            <div className="admin-change-password__modal-header">
                <SVGIcon src={Icons.CheckRounded} width={48} height={48} />
            </div>
            <div className="admin-change-password__modal-content">
                <h4 className="admin-change-password__modal-content-title">Check Your Inbox</h4>
                <p className="admin-change-password__modal-content-subtitle">We've just emailed instructions and a reset password link to <span className="admin-change-password__modal-content-subtitle--bold">john.doe@gmail.com.</span> It might take a few minutes to arrive.</p>
            </div>
            <button type="button" className="btn btn-md btn-outline-success text-black">Open Email</button>
        </div>
    )
}