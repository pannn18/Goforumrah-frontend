import Layout from "@/components/layout"
import InnerLayout from "@/components/business/hotel/layout"
import Navbar from "@/components/layout/navbar"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { callAPI } from "@/lib/axiosHelper"
import LoadingOverlay from "@/components/loadingOverlay"

const SidebarMenus = [
    {
        id: 1,
        URL:
            "/business/hotel/account",
        name: "Account Setting",
        icon: Icons.User,
    },
    {
        id: 2,
        URL:
            "/business/hotel/account/business",
        name: "Business Setting",
        icon: Icons.Store,
    },
    {
        id: 3,
        name: "Change Password",
        URL:
            "/business/hotel/account/change-password",
        icon: Icons.Lock,
    },
    {
        id: 4,
        name: "Linked Device",
        URL:
            "/business/hotel/account/linked-device",
        icon: Icons.MonitorOutline,
    },
];

const SidebarMenu = (settings) => {
    const { pathname } = useRouter()
    return (
        <div className="admin-business-settings__menu-list">
            <Link href={`${settings.URL}`} className={`admin-business-settings__menu-item ${pathname === settings.URL ? 'active' : ''}`}>
                <SVGIcon className="admin-business-settings__menu-item--icon" src={`${settings.icon}`} width={20} height={20} />
                <p className="admin-business-settings__menu-desc">{settings.name}</p>
                <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="admin-business-settings__menu-item--arrow" />
            </Link>
        </div>
    )
}

const SidebarSettings = () => {
    const { pathname } = useRouter()
    return (
        <div className="admin-business-settings__menu">
            <div className="admin-business-settings__menu-list">
                {SidebarMenus.map(SidebarMenu)}
                <a type="button" onClick={() => signOut({ redirect: true, callbackUrl: '/business/hotel/login' })} className="admin-business-settings__menu-item">
                    <SVGIcon className="admin-business-settings__menu-item--icon" src={Icons.Logout} width={20} height={20} />
                    <p className="admin-business-settings__menu-desc">Logout</p>
                    <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="admin-business-settings__menu-item--arrow" />
                </a>
            </div>
        </div>
    )
}

const ContentLinkedDevice = () => {

    const [loading, setLoading] = useState(true);
    const [linkedDevice, setLinkedDevice] = useState([])

    const { data: session, status } = useSession()
    const id_hotel_business = (status === 'authenticated' || session) ? Number(session.user.id) : null;

    useEffect(() => {
        if (!id_hotel_business) return

        const getData = async () => {
            const {data, error, ok} = await callAPI('/hotel-business/linked-devices/show', 'POST', {id_hotel_business: id_hotel_business}, true)
            if (ok && data) {
                setLinkedDevice(data)
                setLoading(false)
            }
            if (error) {
                console.log(error);
            }
        }

        getData()
    }, [id_hotel_business])
    

    const handleLogout = async (value) => {
        const {ok, error} = await callAPI('/hotel-business/linked-devices/logout', 'POST', {id_authentication_token: value}, true)
        if (ok) {
            alert('Success Logout')
        }
        if (error) {
            console.log(error);
        }
    }
    
    if (loading) {
        return <LoadingOverlay />
    }

    return (
        <div className="admin-menu-settings__content">
            <div className="admin-linked-device__content-header">
                <h5>Linked Device</h5>
                <p className="admin-linked-device__content-header--subtitle">All devices connected to your account will be displayed here.</p>
            </div>
            <div className="table-responsive">
                <div className="admin-linked-device__content-item-wrapper">
                    {linkedDevice.map((device, index) => (
                        <div className="admin-linked-device__content-item" key={index}>
                            <div className="admin-linked-device__content-platform">
                                <div className="admin-linked-device__content-platform--rounded"></div>
                                <div className="admin-linked-device__content-platform-name">{device.device_info}</div>
                            </div>
                            <div className="admin-linked-device__content-info">
                                <div className="admin-linked-device__content-info-location">
                                    <p className="admin-linked-device__content-info-location--name">{device.location_info}</p>
                                    <p className="admin-linked-device__content-info-location--date">{device.datetime}</p>
                                </div>
                                <div className="admin-linked-device__content-info-status">
                                    <SVGIcon src={Icons.Dot} width={8} height={8} className="#" />
                                    <Link href="#" className="admin-linked-device__content-info-status">
                                        {device.online === 1 ? 'Online' : 'Offline'}
                                    </Link>
                                </div>
                            </div>
                            <Link href="#" onClick={() => handleLogout(device.id_authentication_token)} className="admin-linked-device__content-info-status--out">Logout</Link>
                        </div>
                    ))}
                    
                </div>
            </div>
        </div>
    )
}

export default function LinkedDevice() {
    return (
        <Layout>
            <InnerLayout>
                <div className="container container-menusettings">
                    <div className="admin-settings__wrapper">
                        {/* <SidebarSettings /> */}
                        <ContentLinkedDevice />
                    </div>
                </div>
            </InnerLayout>
        </Layout>
    )
}
