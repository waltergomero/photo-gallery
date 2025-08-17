'use client';

import React, {useState, useEffect} from 'react';
import {DeleteImageBtn, SetImageVisible, SetImageNotVisible, EditImageBtn} from './buttons';
import {fetchImages, fetchImagesByCategory, fetchCategoriesWithImages } from "@/actions/gallery-actions";


interface GalleryGridProps {
  category_name?: string;
}

const GalleryGrid = ({category_name}: GalleryGridProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const _category_name = category_name ? category_name : "All";

  // Initialize selectedCategory when component mounts or category_name prop changes
  useEffect(() => {
    setSelectedCategory(_category_name.toLowerCase());
  }, [_category_name]);

  useEffect(() => {
    // Fetch categories with images
    const loadCategories = async () => {
      const categoriesData = await fetchCategoriesWithImages();
      setCategories(categoriesData);
    };

    const loadImages = async () => {
      const imagesData = await fetchImages(_category_name);
      setImages(imagesData);
    };

    loadCategories();
    loadImages();
  }, [_category_name]);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const dropdownName = e.target.options[e.target.selectedIndex].text;
    setSelectedCategory(selectedValue);
    const imagesData = await fetchImages(dropdownName);
    setImages(imagesData);
  };

  return (
    <div>
       <div className="mb-3 col-md-2">
          <select
            name="category_id"
            onChange={handleChange}
            value={selectedCategory}
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