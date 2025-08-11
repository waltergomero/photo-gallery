'use client';

import React, {useState, useEffect} from 'react';
import UploadImagesForm from './upload-images';
import {DeleteImageBtn, SetImageVisible, SetImageNotVisible, EditImageBtn, 
  SetAllImageVisible, SetAllImageNotVisible, SetAllImageVisibility } from './buttons';
import {fetchImages, fetchImagesByCategory, fetchCategoriesWithImages } from "@/actions/gallery-actions";



interface GalleryGridProps {
  category_name?: string;
}

const GalleryGrid = ({category_name}: GalleryGridProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);

  const _category_name = category_name ? category_name : "All";

  useEffect(() => {
    // Fetch categories with images
    const loadCategories = async () => {
      const categoriesData = await fetchCategoriesWithImages();
      setCategories(categoriesData);
    };

    const loadImages = async () => {
      const imagesData = await fetchImagesByCategory(_category_name);
      setImages(imagesData);
    };

    loadCategories();
    loadImages();
  }, [_category_name]);

  const handleClick = async (e:any) => {
        e.preventDefault();
        const dropdownName = e.target.options[e.target.selectedIndex].text;
        const imagesData = await fetchImagesByCategory(dropdownName);
        setImages(imagesData);
      };



  return (
    <div>
       <div className="mb-3 col-md-2">
          <select
            name="category_id"
             onClick={handleClick}
            defaultValue={_category_name ? _category_name.toLowerCase() : ""}
            className="form-select">
            {categories.map((category:any) => (
                <option key={category.categoryId} value={category.category_name.toLowerCase()}>
                    {category.category_name}
                </option>
            ))}
          </select>
       </div>
      <div className="row">
          {images && images?.map((item:any) =>(          
        <div className="col-md-2" key={item.id}>
          <div className="thumbnail border p-2 mb-3">
            <div
              style={{
                width: '100%',
                aspectRatio: '1/1.2', // Adjust for desired portrait/landscape ratio
                overflow: 'hidden',
                background: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
            <DeleteImageBtn image_id={item.id} image_src={item.src}/>
              <img
                className="img-fluid"
                src={item.src}
                alt={item.caption}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}              
              />
            </div>
            <div>
              {item.caption}
            </div>
          </div>
        </div>
        ))
        }
    </div>
    </div>
  )
}

export default GalleryGrid