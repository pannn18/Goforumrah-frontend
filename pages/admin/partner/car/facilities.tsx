import { useState, useEffect } from "react"
import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import Link from "next/link"
import { useRouter } from "next/router"
import { callAPI } from '@/lib/axiosHelper'
import LoadingOverlay from "@/components/loadingOverlay"

export default function PartnerHotelDetail()  {      
  const router = useRouter()
  const {id : id_car_business } = router.query;

  //Retrive Data from API
  const [carFacilitiesData, setCarFacilitiesData] = useState(null);
  const [carFacilitiesLoading, setCarFacilitiesLoading] = useState(true);
  const [carFacilitiesError, setCarFacilitiesError] = useState(null);
  const [editMode, setEditMode] = useState(null); // Initialize editMode
  const [formData, setFormData] = useState({
    "id_car_business_fleet": null,
    "seat": 0,
    "doors": 0,
    "transmission": "Manual",
    "air_condition": 0,
    "baggage": 0,
    "baby_seat": 0,
    "wifi": 0,
    "child_seat": 0,
    "gps": 0
  });

  const fetchCarFacilities = async () => {
    try {
      const { status, data, ok, error } = await callAPI('/admin-car-business/fleet-facilities/show', 'POST', { id_car_business: id_car_business }, true);
      setCarFacilitiesData(data);
      setEditMode(Array(data.length).fill(false));
      setCarFacilitiesLoading(false);
    } catch (error) {
      setCarFacilitiesError(error);
      setCarFacilitiesLoading(false);
    }
  };

  useEffect(() => {
    if (!id_car_business) return
    fetchCarFacilities();
  }, [id_car_business]);

  const handleEdit = (index) => {
    // Get the car_fleet_facilities array from the selected item
    const facilities = carFacilitiesData[index]?.car_fleet_facilities || [];
  
    // Initialize formData with default values
    const formData = {
      "id_car_business_fleet": carFacilitiesData[index]?.id_car_business_fleet,
      "seat": 0,
      "doors": 0,
      "transmission": "Manual",
      "air_condition": 0,
      "baggage": 0,
      "baby_seat": 0,
      "wifi": 0,
      "child_seat": 0,
      "gps": 0
    };
  
    // Update formData based on car_fleet_facilities
    facilities.forEach((facility) => {
      switch (facility.name_facility) {
        case "Seat":
          formData["seat"] = parseInt(facility.amount) || 0;
          break;
        case "Doors":
          formData["doors"] = parseInt(facility.amount) || 0;
          break;
        case "Transmission":
          formData["transmission"] = facility.amount || "Manual";
          break;
        case "Air Condition":
          formData["air_condition"] = parseInt(facility.status) || 0;
          break;
        case "Baggage":
          formData["baggage"] = parseInt(facility.status) || 0;
          break;
        case "Baby Seat":
          formData["baby_seat"] = parseInt(facility.status) || 0;
          break;
        case "WiFi":
          formData["wifi"] = parseInt(facility.status) || 0;
          break;
        case "Child Seat":
          formData["child_seat"] = parseInt(facility.status) || 0;
          break;
        case "GPS":
          formData["gps"] = parseInt(facility.status) || 0;
          break;
        default:
          break;
      }
    });
  
    // Set editMode to true only for the clicked index
    setEditMode(Array(carFacilitiesData.length).fill(false).map((mode, i) => i === index));
    // Update formData with the calculated values
    setFormData(formData);
    console.log("formData : ", formData);
  };

  

  const handleSaveChanges = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    console.log("formData to be submitted : ", formData);
    try {
      const { status, data, ok, error } = await callAPI('/admin-car-business/fleet-facilities/store', 'POST', formData, true);
      console.log(status, data, ok, error);
      if (ok) {
        console.log("Success API handle submit admin partner car facilities store ", status, data, ok, error);
        // Call onActionForm to refetch carFleetData data and scroll to the top
        fetchCarFacilities();
      } else {
        console.log("Fail to handle submit post API admin partner car facilities store   ", status, data, ok, error);
      }

      // Reset formData
      setFormData({
        "id_car_business_fleet": null,
        "seat": 0,
        "doors": 0,
        "transmission": "Manual",
        "air_condition": 0,
        "baggage": 0,
        "baby_seat": 0,
        "wifi": 0,
        "child_seat": 0,
        "gps": 0
      });

      // Set editMode to false for all items
      setEditMode(Array(carFacilitiesData.length).fill(false));
    } catch (error) {
      console.error("Error while saving changes:", error);
    }
  };
  

  if (carFacilitiesLoading) {
    return <LoadingOverlay />;
  }

  if (carFacilitiesError) {
    return <div>Error Fetching Data</div>;
  }

  console.log("carFacilitiesData : ", carFacilitiesData)

  return (
    <Layout>
      <AdminLayout pageTitle="Facilities" enableBack={true}>
        <div className="admin-partner__detail">      
          <div className="container">    
            <div className="admin-partner__basic">    
              <div className="admin-partner__basic-card">              
                {carFacilitiesData?.map((item, index) => (
                  <div key={index} className="admin-partner__amenities">
                    <div className="admin-partner__amenities-header">
                      <p className="admin-partner__amenities-header-title">
                        {item?.car_brand} {item?.model} {item?.edition}
                      </p>
                      <button type="button" className="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#facilitesEditModal" onClick={() => handleEdit(index)}>Edit</button>
                    </div>
                    <div className="admin-partner__amenities-list">
                      {item?.car_fleet_facilities?.map((facility, index) => (
                        <CarFacilitiesItem key={index} name={`${facility?.name_facility} ${facility?.amount === null ? '' : `(${facility?.amount})`}`} available={facility?.status === 1 ? true : false} />
                      ))}                          
                    </div>
                  </div>  
                ))}                               
              </div>    
              <div className="admin-partner__basic-card admin-partner__basic-card--buttons">
                  <Link href="/admin/partner/car/edit" className="btn btn-lg btn-outline-success">Cancel</Link>
                  <Link href="/admin/partner/car/edit" className="btn btn-lg btn-success">Save</Link>
              </div>
              <div className="modal fade" id="facilitesEditModal" tabIndex={-1} aria-labelledby="facilityLabel" aria-hidden="true">      
                <div className="modal-dialog ">
                  <div className="modal-content admin-partner__amenities-modal">
                    <div className="admin-partner__amenities-modal__body">
                      <h5 className="admin-partner__amenities-modal__header">Edit</h5>
                      <div  className="admin-partner__amenities-modal__content">
                        <div className="d-flex flex-column gap-1">
                          <p>Seat</p>
                          <label htmlFor="Seat" className="admin-partner__amenities-modal__content-item admin-partner__amenities-modal__content-item--text">
                            <input type="number" min={0} name="hotel-facilities" id="Seat" value={formData.seat} onChange={(e) => setFormData((prev) => ({ ...prev, seat: parseInt(e.target.value) || 0 }))} className="form-text-input" placeholder="Number of Seat"/>
                          </label>
                        </div>
                        <div className="d-flex flex-column gap-1">
                          <p>Doors</p>
                          <label htmlFor="Doors" className="admin-partner__amenities-modal__content-item admin-partner__amenities-modal__content-item--text">
                            <input type="number" min={0} name="hotel-facilities" id="Doors" value={formData.doors} onChange={(e) => setFormData((prev) => ({ ...prev, doors: parseInt(e.target.value) || 0 }))} className="form-text-input" placeholder="Number of Doors"/>
                          </label>
                        </div>
                        <div className="d-flex flex-column gap-1">
                          <p>Transmission</p>
                          <label htmlFor="TransmissonManual" className="admin-partner__amenities-modal__content-item">
                            <p>Manual</p>
                            <input type="radio" name="hotel-facilities" id="TransmissonManual" checked={formData.transmission === "Manual"} onChange={() => setFormData((prev) => ({ ...prev, transmission: "Manual" }))} className="form-check-input"/>
                          </label>
                        </div>
                        <div className="d-flex flex-column gap-1">
                          <p>Transmission</p>
                          <label htmlFor="TransmissonAutomatic" className="admin-partner__amenities-modal__content-item">
                            <p>Automatic</p>
                            <input type="radio" name="hotel-facilities" id="TransmissonAutomatic" checked={formData.transmission === "Automatic"} onChange={() => setFormData((prev) => ({ ...prev, transmission: "Automatic" }))} className="form-check-input"/>
                          </label>  
                        </div> 
                      </div>                      
                      <p>Additional</p>
                      <div className="admin-partner__amenities-modal__content">
                        <label htmlFor="AirCondition" className="admin-partner__amenities-modal__content-item">      
                          <p>Air Condition</p>
                          <input type="checkbox" name="hotel-facilities" id="AirCondition"  checked={formData.air_condition === 1} onChange={(e) => setFormData((prev) => ({ ...prev, air_condition: e.target.checked ? 1 : 0 }))} className="form-check-input"/>
                        </label>     
                        <label htmlFor="Baggage" className="admin-partner__amenities-modal__content-item">      
                          <p>Baggage</p>
                          <input type="checkbox" name="hotel-facilities" id="Baggage" checked={formData.baggage === 1} onChange={(e) => setFormData((prev) => ({ ...prev, baggage: e.target.checked ? 1 : 0 }))} className="form-check-input"/>
                        </label>   
                        <label htmlFor="Wifi" className="admin-partner__amenities-modal__content-item">      
                          <p>Wifi</p>
                          <input type="checkbox" name="hotel-facilities" id="Wifi" checked={formData.wifi === 1} onChange={(e) => setFormData((prev) => ({ ...prev, wifi: e.target.checked ? 1 : 0 }))} className="form-check-input"/>
                        </label>  
                        <label htmlFor="BabySeat" className="admin-partner__amenities-modal__content-item">      
                          <p>Baby Seat</p>
                          <input type="checkbox" name="hotel-facilities" id="BabySeat" checked={formData.baby_seat === 1} onChange={(e) => setFormData((prev) => ({ ...prev, baby_seat: e.target.checked ? 1 : 0 }))} className="form-check-input"/>
                        </label> 
                        <label htmlFor="ChildSeat" className="admin-partner__amenities-modal__content-item">      
                          <p>Child Seat</p>
                          <input type="checkbox" name="hotel-facilities" id="ChildSeat" checked={formData.child_seat === 1} onChange={(e) => setFormData((prev) => ({ ...prev, child_seat: e.target.checked ? 1 : 0 }))} className="form-check-input"/>
                        </label> 
                        <label htmlFor="GPS" className="admin-partner__amenities-modal__content-item">      
                          <p>GPS</p>
                          <input type="checkbox" name="hotel-facilities" id="GPS" checked={formData.gps === 1} onChange={(e) => setFormData((prev) => ({ ...prev, gps: e.target.checked ? 1 : 0 }))} className="form-check-input"/>
                        </label> 
                      </div>
                    </div>
                    <div className="admin-partner__amenities-modal__footer">
                      <button type="button" data-bs-dismiss="modal" aria-label="Close" className="btn btn-lg btn-outline-success">Cancel</button>
                      <button type="button" data-bs-dismiss="modal" aria-label="Close" className="btn btn-lg btn-success" onClick={handleSaveChanges}>Save</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </Layout>
  )
}

interface CarFacilitiesItemProps {
  name: string
  available: boolean
}

const CarFacilitiesItem = (props: CarFacilitiesItemProps) => {
  const {name, available} = props
  return(
    <label htmlFor={""} className="admin-partner__amenities-item">
      {props.available &&
        <SVGIcon src={Icons.Check} width={20} height={20} className="admin-partner__amenities-item--available" />      
      }
      {!props.available &&
        <SVGIcon src={Icons.Cancel} width={20} height={20} className="admin-partner__amenities-item--unavailable" />      
      }
      <p>{name}</p>      
    </label>
  )
}