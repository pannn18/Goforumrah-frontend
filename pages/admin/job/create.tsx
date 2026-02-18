import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import { useState } from "react"
import DropdownMenu from "@/components/elements/dropdownMenu"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import Link from "next/link"

const Create = () => {
  // State to store the added content
  const [contentColumnOne, setContentList, ] = useState<string[]>([]);
  const [contentColumnTwo, setContentList2 ] = useState<string[]>([]);

  // function to display content
  const addColumn = () => {
    const newContent = `New content added at ${new Date().toLocaleTimeString()}`;
    setContentList((prevContentList) => [...prevContentList, newContent]);
  };

  const addColumn2 = () => {
    const newContent = `New content added at ${new Date().toLocaleTimeString()}`;
    setContentList2((prevContentList) => [...prevContentList, newContent]);
  };

  // Function to remove a content item by index
  const removeColumn = (index: number) => {
    const updatedContent = [...contentColumnOne];
    updatedContent.splice(index, 1);
    setContentList(updatedContent);
  };
  const removeColumn2 = (index: number) => {
    const updatedContent = [...contentColumnTwo];
    updatedContent.splice(index, 1);
    setContentList2(updatedContent);
  };
  return(
    <Layout>
      <AdminLayout pageTitle="Create Job Post">
        <div className="container">
          <div className="admin-job">
            <div className="admin-job__wrapper">
              <div className="admin-job__form-content-wrapper">
                <label htmlFor="jobName" className="form-label goform-label admin-job__form-label">Job Name</label>
                <input type="text" placeholder='Enter your job name' name='roomName' className='form-control'/>
              </div>
              <div className="admin-property-business__content-form-wrapper">
                <div className="admin-job__form-content-wrapper w-100">
                  <label htmlFor="jobCategory" className="form-label goform-label admin-job__form-label">Job Category</label>
                  <select name="category" id="" className='w-100 admin-job__content-form-select'>
                    <option value="">Choose Job Category</option>
                    <option value="">Human Resource</option>
                    <option value="">Human Resource</option>
                  </select>
                </div>
                <div className="admin-job__form-content-wrapper w-100">
                  <label htmlFor="location" className="form-label goform-label admin-job__form-label">Location</label>
                  <select name="location" id="" className='w-100 admin-job__content-form-select'>
                    <option value="">Choose Location</option>
                    <option value="">Amsterdam, Netherland</option>
                    <option value="">Amsterdam, Netherland</option>
                  </select>
                </div>
              </div>
              <div className="admin-job__form-description-wrapper">
                <div className="admin-job__form-label-wrapper">
                  <label htmlFor="Description" className="form-label goform-label admin-job__form-label mb-0">Description</label>
                  <button type="button" className="admin-job__form-textarea-btn">
                    <SVGIcon src={Icons.TrashOutline} width={20} height={20} color="#9E9E9E"/>
                  </button>
                </div>
                <input type="text" placeholder='Title' name='title' className='form-control'/>
                <div className="admin-job__form-textarea-wrapper">
                  <textarea className='admin-job__form-textarea-content' rows={4} cols={50}/>
                  <div className="admin-job__form-textarea-action">
                    <button type="button" className="admin-job__form-textarea-btn">
                      <SVGIcon src={Icons.Attach} width={20} height={20} color="#1B1B1BF5"/>
                    </button>
                    <button type="button" className="admin-job__form-textarea-btn">
                      <SVGIcon src={Icons.Link} width={20} height={20} color="#1B1B1BF5"/>
                    </button>
                    <button type="button" className="admin-job__form-textarea-btn">
                      <SVGIcon src={Icons.Image} width={20} height={20} color="#1B1B1BF5"/>
                    </button>
                    <button type="button" className="admin-job__form-textarea-btn">
                      <SVGIcon src={Icons.TrashOutline} width={20} height={20} color="#1B1B1BF5"/>
                    </button>
                  </div>
                </div>
              </div>
              <div>
                {contentColumnTwo.map((item, index) => (
                  <div key={index}>
                    <div className="row mt-4">
                      <div className="admin-job__form-description-wrapper col-xl-6 col-lg-6 col-md-6 col-sm-6">
                        <div className="admin-job__form-label-wrapper">
                          <label htmlFor="Description" className="form-label goform-label admin-job__form-label mb-0">Description</label>
                        </div>
                        <input type="text" placeholder='Title' name='title' className='form-control'/>
                        <div className="admin-job__form-textarea-wrapper">
                          <textarea className='admin-job__form-textarea-content' rows={4} cols={50}/>
                          <div className="admin-job__form-textarea-action">
                            <button type="button" className="admin-job__form-textarea-btn">
                              <SVGIcon src={Icons.Attach} width={20} height={20} color="#1B1B1BF5"/>
                            </button>
                            <button type="button" className="admin-job__form-textarea-btn">
                              <SVGIcon src={Icons.Link} width={20} height={20} color="#1B1B1BF5"/>
                            </button>
                            <button type="button" className="admin-job__form-textarea-btn">
                              <SVGIcon src={Icons.Image} width={20} height={20} color="#1B1B1BF5"/>
                            </button>
                            <button type="button" className="admin-job__form-textarea-btn">
                              <SVGIcon src={Icons.TrashOutline} width={20} height={20} color="#1B1B1BF5"/>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="admin-job__form-description-wrapper col-xl-6 col-lg-6 col-md-6 col-sm-6">
                        <div className="admin-job__form-label-wrapper">
                          <label htmlFor="Description" className="form-label goform-label admin-job__form-label mb-0">Description</label>
                          <button type="button" className="admin-job__form-textarea-btn" onClick={() => removeColumn2(index)}>
                            <SVGIcon src={Icons.TrashOutline} width={20} height={20} color="#9E9E9E"/>
                          </button>
                        </div>
                        <input type="text" placeholder='Title' name='title' className='form-control'/>
                        <div className="admin-job__form-textarea-wrapper">
                          <textarea className='admin-job__form-textarea-content' rows={4} cols={50}/>
                          <div className="admin-job__form-textarea-action">
                            <button type="button" className="admin-job__form-textarea-btn">
                              <SVGIcon src={Icons.Attach} width={20} height={20} color="#1B1B1BF5"/>
                            </button>
                            <button type="button" className="admin-job__form-textarea-btn">
                              <SVGIcon src={Icons.Link} width={20} height={20} color="#1B1B1BF5"/>
                            </button>
                            <button type="button" className="admin-job__form-textarea-btn">
                              <SVGIcon src={Icons.Image} width={20} height={20} color="#1B1B1BF5"/>
                            </button>
                            <button type="button" className="admin-job__form-textarea-btn">
                              <SVGIcon src={Icons.TrashOutline} width={20} height={20} color="#1B1B1BF5"/>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                {contentColumnOne.map((item, index) => (
                  <div key={index}>
                    <div className="admin-job__form-description-wrapper mt-4">
                      <div className="admin-job__form-label-wrapper">
                        <label htmlFor="Description" className="form-label goform-label admin-job__form-label mb-0">Description</label>
                        <button type="button" className="admin-job__form-textarea-btn" onClick={() => removeColumn(index)}>
                          <SVGIcon src={Icons.TrashOutline} width={20} height={20} color="#9E9E9E"/>
                        </button>
                      </div>
                      <input type="text" placeholder='Title' name='title' className='form-control'/>
                      <div className="admin-job__form-textarea-wrapper">
                        <textarea className='admin-job__form-textarea-content' rows={4} cols={50}/>
                        <div className="admin-job__form-textarea-action">
                          <button type="button" className="admin-job__form-textarea-btn">
                            <SVGIcon src={Icons.Attach} width={20} height={20} color="#1B1B1BF5"/>
                          </button>
                          <button type="button" className="admin-job__form-textarea-btn">
                            <SVGIcon src={Icons.Link} width={20} height={20} color="#1B1B1BF5"/>
                          </button>
                          <button type="button" className="admin-job__form-textarea-btn">
                            <SVGIcon src={Icons.Image} width={20} height={20} color="#1B1B1BF5"/>
                          </button>
                          <button type="button" className="admin-job__form-textarea-btn">
                            <SVGIcon src={Icons.TrashOutline} width={20} height={20} color="#1B1B1BF5"/>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="admin-job__post-btn w-100 justify-content-center" data-bs-toggle="modal" data-bs-target="#addSection">
                <SVGIcon src={Icons.Plus} width={20} height={20} color="#1CB78D"/>
                Add
              </button>
            </div>
            <div className='row'>
              <div className='col-12'>
                <div className='hotel-dashboard__button-list'>
                  <Link href={'./'} className='button goform-button goform-button--outline-green hotel-dashboard__button-list-item'>Cancel</Link>
                  <button type='button' className='button goform-button goform-button--fill-green hotel-dashboard__button-list-item' data-bs-toggle="modal" data-bs-target="#SaveValidation">Save</button>
                </div>
              </div>
            </div>
          </div>
          <div  className="modal fade" id="addSection" tabIndex={-1} aria-labelledby="addSectionLabel" aria-hidden="true">
            <div className="modal-dialog admin-job__modal">
              <div className="modal-content admin-job__modal-wrapper">
                <div className="admin-job__modal-header">
                  <h5>Add section</h5>
                  <button type="button" className="admin-job__modal-close" data-bs-dismiss="modal"><SVGIcon src={Icons.Cancel} width={20} height={20} color="#616161"/></button>
                </div>
                <div className="admin-job__modal-content">
                  <div className="admin-job__modal-card">
                    <div className="admin-job__modal-card-left">
                      <SVGIcon src={Icons.ColumnOne} width={20} height={20} color="#1CB78D"/>
                      <p className="admin-job__modal-card-title">1 Column</p>
                    </div>
                    <button type="button" className="admin-job__modal-card-btn" data-bs-dismiss="modal" onClick={addColumn}>Add</button>
                  </div>
                  <div className="admin-job__modal-card">
                    <div className="admin-job__modal-card-left">
                      <SVGIcon src={Icons.ColumnTwo} width={20} height={20} color="#1CB78D"/>
                      <p className="admin-job__modal-card-title">2 Column</p>
                    </div>
                    <button type="button" className="admin-job__modal-card-btn" data-bs-dismiss="modal" onClick={addColumn2}>Add</button>
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

export default Create