import { useState, useEffect } from "react"
import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import Link from "next/link"
import { useRouter } from "next/router"
import { callAPI } from '@/lib/axiosHelper'
import LoadingOverlay from "@/components/loadingOverlay"

export default function PartnerCarFleet()  {    
  const router = useRouter()
  const {id : id_car_business } = router.query;

  //Retrive Data from API
  const [carFleetData, setCarFleetData] = useState(null);
  const [carFleetLoading, setCarFleetLoading] = useState(true);
  const [carFleetError, setCarFleetError] = useState(null);
  const [editMode, setEditMode] = useState(null); // Initialize editMode
  const [formData, setFormData] = useState({
    "id_car_business_fleet": null,
    "id_car_business": id_car_business,
    "fuel_type": null,
    "car_brand": null,
    "model": null,
    "edition": null,
    "transmission": null,
    "aircon": null,
    "quantity": null,
    "total_car": null
  });
  const [addingNew, setAddingNew] = useState(false);

  const fetchCarFleet = async () => {
    try {
      const { status, data, ok, error } = await callAPI('/car-business/fleet/show', 'POST', { id_car_business: id_car_business }, true);
      setCarFleetData(data);
      setCarFleetLoading(false);
    } catch (error) {
      setCarFleetError(error);
      setCarFleetLoading(false);
    }
  };

  useEffect(() => {
    if (!id_car_business) return
    // Check if carFleetData already available
    if (carFleetData) {
      // Initialize editMode when carFleetData is available
      setEditMode(Array(carFleetData.length).fill(false));
      return;
    }
    fetchCarFleet();
  }, [id_car_business, carFleetData]);

  const handleEdit = (index) => {
    // Update formData with values from the selected item
    setFormData({
      "id_car_business_fleet": carFleetData[index]?.id_car_business_fleet,
      "id_car_business": id_car_business,
      "fuel_type": carFleetData[index]?.fuel_type,
      "car_brand": carFleetData[index]?.car_brand,
      "model": carFleetData[index]?.model,
      "edition": carFleetData[index]?.edition,
      "transmission": carFleetData[index]?.transmission,
      "aircon": carFleetData[index]?.aircon,
      "quantity": carFleetData[index]?.quantity,
      "total_car": carFleetData[index]?.total_car
    });
    // Set editMode to true only for the clicked index
    setEditMode(Array(carFleetData.length).fill(false).map((mode, i) => i === index));
    // Reset addingNew state
    setAddingNew(false);
  };

  const handleSaveChanges = async (index) => {
    event.preventDefault();
    try {
      console.log("formData : ", formData);
      const { status, data, ok, error } = await callAPI('/car-business/fleet/store', 'POST', formData, true);
      console.log(status, data, ok, error);
      if (ok) {
        console.log("Success API handle submit admin partner amenities store ", status, data, ok, error);
        // Call onActionForm to refetch carFleetData data and scroll to the top
        fetchCarFleet();
      } else {
        console.log("Fail to handle submit post API admin partner amenities store   ", status, data, ok, error);
      }

      // Reset formData
      setFormData({
        "id_car_business_fleet": null,
        "id_car_business": id_car_business,
        "fuel_type": null,
        "car_brand": null,
        "model": null,
        "edition": null,
        "transmission": null,
        "aircon": null,
        "quantity": null,
        "total_car": null
      });

      // Set editMode to false for all items
      setEditMode(Array(carFleetData.length).fill(false));
    } catch (error) {
      console.error("Error while saving changes:", error);
    }
  };

  const handleInputChange = (field, value) => {
    // Create a copy of the current formData
    const updatedFormData = { ...formData };    
    // Update the specific field in the copied formData
    updatedFormData[field] = value;    
    // Set the updated formData to the state
    setFormData(updatedFormData);
  };

  const handleAddNew = () => {
    // Reset formData
    setFormData({
      "id_car_business_fleet": null,
      "id_car_business": id_car_business,
      "fuel_type": "Hydrogen",
      "car_brand": "BMW",
      "model": "1 Series",
      "edition": "11 6i 5dr",
      "transmission": "Automatic",
      "aircon": 1,
      "quantity": 1,
      "total_car": 1
    });
    // Set editMode to true for the new entry
    setEditMode(Array(carFleetData.length + 1).fill(false).map((mode, i) => i === carFleetData.length));
    // Set addingNew state to true
    setAddingNew(true);

    // Scroll to the bottom after a delay of 100ms
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    }, 100);
  };

  const handleAddNewSaveChanges = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    try {
      console.log("formData handleAddNewSaveChanges : ", formData);
      const { status, data, ok, error } = await callAPI('/car-business/fleet/store', 'POST', formData, true);
      console.log(status, data, ok, error);
      if (ok) {
        console.log("Success API handle submit admin partner amenities store ", status, data, ok, error);
        // Call onActionForm to refetch carFleetData data and scroll to the top
        fetchCarFleet();
      } else {
        console.log("Fail to handle submit post API admin partner amenities store   ", status, data, ok, error);
      }

      // Reset formData
      setFormData({
        "id_car_business_fleet": null,
        "id_car_business": id_car_business,
        "fuel_type": null,
        "car_brand": null,
        "model": null,
        "edition": null,
        "transmission": null,
        "aircon": null,
        "quantity": null,
        "total_car": null
      });

      // Set editMode to false for all items
      setEditMode(Array(carFleetData.length).fill(false));
      setAddingNew(false);
    } catch (error) {
      console.error("Error while saving changes:", error);
    }
  };

  if (carFleetLoading) {
    return <LoadingOverlay />;
  }

  if (carFleetError) {
    return <div>Error Fetching Data</div>;
  }

  console.log("carFleetData : ", carFleetData)

  return (
    <Layout>
      <AdminLayout enableBack={true} pageTitle="Fleet">
        <div className="admin-partner__detail">      
          <div className="container">    
            <form action="#" className="admin-partner__fleet">   
              <div className="admin-partner__fleet-card">
                <div className="admin-partner__fleet-header">
                  <p className="admin-partner__fleet-header-title">Add car</p>
                  <button type="button" className="admin-partner__fleet-header-button btn btn-outline-success" onClick={handleAddNew}><SVGIcon src={Icons.Plus} className="" width={18} height={18}/> Add New</button>
                </div>
              </div>
              {carFleetData.map((data, index) => {
                return (
                  <>
                  <div key={index} className="admin-partner__fleet-card">
                    <div className="admin-partner__fleet-card--header">
                      <h5 className="admin-partner__fleet-car--name">{data?.car_brand} {data?.model} {data?.edition}</h5>
                      {editMode?.[index] ? (
                        <button type="button" className="btn btn-md btn-outline-success" onClick={() => handleSaveChanges(index)}>Save Changes</button>
                      ) : (
                        <button type="button" className="btn btn-md btn-outline-success" onClick={() => handleEdit(index)}>Edit</button>
                      )}
                    </div>
                    <div className="admin-partner__fleet-body">
                      <div className="admin-partner__fleet-body-block">
                        <label htmlFor="fleet-fuel_type">Fuel type :</label>
                        <select name="fuel_type" id="fleet-fuel_type" defaultValue={data?.fuel_type} disabled={!editMode?.[index]} onChange={(e) => handleInputChange('fuel_type', e.target.value)}>
                          <option value="Hydrogen">Hydrogen</option>
                          <option value="Petrol">Petrol</option>
                          <option value="Diesel">Diesel</option>
                        </select>
                      </div>
                      <div className="admin-partner__fleet-body-block">
                        <label htmlFor="fleet-car_brand">Car Brand</label>
                        <select name="car_brand" id="fleet-car_brand" defaultValue={data?.car_brand} disabled={!editMode?.[index]} onChange={(e) => handleInputChange('car_brand', e.target.value)}>
                          <option value="BMW">BMW</option>
                          <option value="Mercedez">Mercedez</option>
                          <option value="Toyota">Toyota</option>
                        </select>
                      </div>
                      <div className="admin-partner__fleet-body-block">
                        <label htmlFor="fleet-model">Model</label>
                        <select name="model" id="fleet-model" defaultValue={data?.model} disabled={!editMode?.[index]} onChange={(e) => handleInputChange('model', e.target.value)}>
                          <option value="1 Series">Series 1</option>
                          <option value="2 Series">Series 2</option>
                          <option value="3 Series">Series 3</option>
                        </select>
                      </div>
                      <div className="admin-partner__fleet-body-block">
                        <label htmlFor="fleet-edition">Edition</label>
                        <select name="edition" id="fleet-edition" defaultValue={data?.edition} disabled={!editMode?.[index]} onChange={(e) => handleInputChange('edition', e.target.value)}>
                          <option value="11 6i 5dr">1 1 6i 5dr</option>
                          <option value="2022">2022</option>
                          <option value="All New">All New</option>
                        </select>
                      </div>
                      <div className="admin-partner__fleet-body-block">
                        <label htmlFor="fleet-transmission">Transmition</label>
                        <select name="transmission" id="fleet-transmission" defaultValue={data?.transmission} disabled={!editMode?.[index]} onChange={(e) => handleInputChange('transmission', e.target.value)}>
                          <option value="Automatic">Automatic</option>
                          <option value="Manual">Manual</option>          
                        </select>
                      </div>
                      <div className="admin-partner__fleet-body-block">
                        <label htmlFor="fleet-aircon">Aircon</label>
                        <select name="aircon" id="fleet-aircon" defaultValue={data?.aircon} disabled={!editMode?.[index]} onChange={(e) => handleInputChange('aircon', e.target.value)}>
                          <option value="1">Yes</option>
                          <option value="0">No</option>          
                        </select>
                      </div>
                      <div className="admin-partner__fleet-body-block">
                        <label htmlFor="fleet-aircon">Quantity</label>
                        <input type="number" min={0} placeholder='0' className="form-control goform-input" defaultValue={data?.quantity || ''} disabled={!editMode?.[index]} onChange={(e) => handleInputChange('quantity', e.target.value)}/>
                      </div>
                      <div className="admin-partner__fleet-body-block">
                        <label htmlFor="fleet-aircon">Total Car</label>
                        <input type="number" min={0} placeholder='0' className="form-control goform-input" defaultValue={data?.total_car || ''} disabled={!editMode?.[index]} onChange={(e) => handleInputChange('total_car', e.target.value)}/>
                      </div>
                    </div>
                  </div>
                  </>
                )
              })}
              
              {/* Add new card when addingNew is true */}
              {addingNew && (
                <div className="admin-partner__fleet-card">
                  <div className="admin-partner__fleet-card--header">
                    <h5 className="admin-partner__fleet-car--name">New Car</h5>
                    <button type="button" className="btn btn-md btn-outline-success" onClick={handleAddNewSaveChanges}>Save Changes</button>
                  </div>
                    <div className="admin-partner__fleet-body">
                      <div className="admin-partner__fleet-body-block">
                        <label htmlFor="fleet-fuel_type">Fuel type :</label>
                        <select name="fuel_type" id="fleet-fuel_type" defaultValue={formData?.fuel_type} onChange={(e) => handleInputChange('fuel_type', e.target.value)}>
                          <option value="Hydrogen">Hydrogen</option>
                          <option value="Petrol">Petrol</option>
                          <option value="Diesel">Diesel</option>
                        </select>
                      </div>
                      <div className="admin-partner__fleet-body-block">
                        <label htmlFor="fleet-car_brand">Car Brand</label>
                        <select name="car_brand" id="fleet-car_brand" defaultValue={formData?.car_brand} onChange={(e) => handleInputChange('car_brand', e.target.value)}>
                          <option value="BMW">BMW</option>
                          <option value="Mercedez">Mercedez</option>
                          <option value="Toyota">Toyota</option>
                        </select>
                      </div>
                      <div className="admin-partner__fleet-body-block">
                        <label htmlFor="fleet-model">Model</label>
                        <select name="model" id="fleet-model" defaultValue={formData?.model} onChange={(e) => handleInputChange('model', e.target.value)}>
                          <option value="1 Series">Series 1</option>
                          <option value="2 Series">Series 2</option>
                          <option value="3 Series">Series 3</option>
                        </select>
                      </div>
                      <div className="admin-partner__fleet-body-block">
                        <label htmlFor="fleet-edition">Edition</label>
                        <select name="edition" id="fleet-edition" defaultValue={formData?.edition} onChange={(e) => handleInputChange('edition', e.target.value)}>
                          <option value="11 6i 5dr">1 1 6i 5dr</option>
                          <option value="2022">2022</option>
                          <option value="All New">All New</option>
                        </select>
                      </div>
                      <div className="admin-partner__fleet-body-block">
                        <label htmlFor="fleet-transmission">Transmition</label>
                        <select name="transmission" id="fleet-transmission" defaultValue={formData?.transmission} onChange={(e) => handleInputChange('transmission', e.target.value)}>
                          <option value="Automatic">Automatic</option>
                          <option value="Manual">Manual</option>          
                        </select>
                      </div>
                      <div className="admin-partner__fleet-body-block">
                        <label htmlFor="fleet-aircon">Aircon</label>
                        <select name="aircon" id="fleet-aircon" defaultValue={formData?.aircon} onChange={(e) => handleInputChange('aircon', e.target.value)}>
                          <option value="1">Yes</option>
                          <option value="0">No</option>          
                        </select>
                      </div>
                    </div>
                </div>
              )}
              <div className="admin-partner__basic-card admin-partner__basic-card--buttons">
                  <Link href={`/admin/partner/car/${id_car_business}`} className="btn btn-lg btn-outline-success">Cancel</Link>
                  <Link href={`/admin/partner/car/${id_car_business}`} className="btn btn-lg btn-success">Save</Link>
              </div>
            </form>
          </div>
        </div>
      </AdminLayout>
    </Layout>
  )
}