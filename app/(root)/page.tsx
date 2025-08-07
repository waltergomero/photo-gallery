import React, { Fragment } from 'react';
import Link from 'next/link';
import { fetchOneImagePerCategory } from '@/actions/gallery-actions';
//import '@/assets/gallery/css/custom.css';


const HomePage = async () => {
    const categories = await fetchOneImagePerCategory();
  return (
    <Fragment>
      <div>
          <div style={{ textAlign: 'center', left: 0, background: 'black', padding: '20px' }}>
                <h1 className="display-6 font-weight-bold" style={{ color: 'red', fontWeight: 600 }}>WELCOME TO THE</h1>
                <h1 className="display-3" style={{ color: 'white', fontWeight: 600 }}>PIXELS</h1>
                <h1 className="display-6 font-weight-bold" style={{ color: 'red', fontWeight: 600  }}>PHOTO GALLERY </h1>
          </div>
          <div className="home-header">
              <div className="slider slider-for">                                                               
                  <div>
                     <img src="/images/image-1.jpg" className="img-fluid" alt="..."></img> 
                  </div>
              </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', margin: 0, justifyContent: 'center', background: 'black', padding: '10px' }}>
          <div className="dropdown">
              <a href="https://pentaxphotogallery.com/featured-artists/" className="btn btn-featured artist-drop dropdown-toggle">FEATURED ARTISTS</a>
          </div>
          <div className="dropdown">
              <a href="https://pentaxphotogallery.com/collection/?collection_id=" className="btn btn-featured dropdown-toggle">FEATURED COLLECTION</a>
          </div>
          <div className="dropdown">
              <a href="https://pentaxphotogallery.com/category/?cat_id= 184" className="btn btn-featured dropdown-toggle">FEATURED CATEGORY</a>
          </div>
        </div>
        <div className="home-gallery">
            <div className="row">
               {categories && categories?.map((item:any) =>(    
                  <div key={item.id} style={{ backgroundImage: `url(${item.src})`, height: '500px', backgroundSize: 'cover', backgroundPosition: 'center' }} 
                      className="img-bg-home col-sm-3 p-0 position-relative">
                      <Link href={`/grid/${item.category_name}`}
                      style={{ display: 'flex', margin: 0, alignItems: 'center', justifyContent: 'center' }}>
                      <div className="photo-caption" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}><h2>{item.category_name}</h2><p style={{ color: 'red' }}>COLLECTION</p></div></Link>
                  </div>
               ))
              }
              </div>
          </div>
        </div>   
    </Fragment>
  )
}

export default HomePage

