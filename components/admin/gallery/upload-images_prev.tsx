'use client';

import React, {useRef, useState, useEffect} from 'react'
import { TrashIcon,PlusIcon} from "@heroicons/react/24/outline";
import Compressor from "compressorjs";
import {  redirect, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useSession } from "next-auth/react";
import heic2any from "heic2any";
import Loading from '@/components/loading';
import {fetchCategories} from "@/actions/category-actions";
import { Button } from "react-bootstrap";


const UploadImagesForm = () => {
    const { data: session } = useSession();
    const userId =   session?.user?.id;
    const router = useRouter();
    const inputFile = useRef<HTMLInputElement>(null);

    type Category = { id: string | number; category_name: string };
    const [categories, setCategories] = useState<Category[]>([]);

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [captions, setCaptions] = useState<string[]>([]);
    const [isActive, setIsActive] = useState(false);
    const [categoryValue, setCategoryValue] = useState(null);
    const [categoryText, setCategoryText] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const toggleMenu = () => setOpen(!isOpen);

    useEffect(() => {
    const getCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
     getCategories();
    }, []);

    const handleFileChange = async (event: any) => {
        const files = Array.from(event.target.files);
        setLoading(true);
        const convertedFilesArray = await Promise.all(
            files.map(async (file: any) => {
              const filename = file.name.toLowerCase();
              const ext = filename.split(".").pop();
                if (ext === "heic" || ext === "heif") {
                    const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg" });
                    return new File([convertedBlob as BlobPart], filename.replace("." + ext, ".jpg"), { type: "image/jpeg" });
                }
                return file;
            })
        );
        setSelectedFiles((previousImages) => previousImages.concat(convertedFilesArray as any[]));
        setLoading(false);
        setIsActive(true);
        setCaptions(files.map(() => ''));
    };

    const handleCaptionChange = (index: number, event: React.ChangeEvent<HTMLTextAreaElement>) => {
        console.log("index, event: ", index, event)
        const newCaptions = [...captions];
        newCaptions[index] = event.target.value;
        setCaptions(newCaptions);
    };

    const handleRemoveImage = (index: number) => {
        const newSelectedFiles = selectedFiles.filter((_, i) => i !== index);
        const newCaptions = captions.filter((_, i) => i !== index);
        setSelectedFiles(newSelectedFiles);
        setCaptions(newCaptions);

        if(selectedFiles.length == 1)
            {
                setIsActive(false);
            }
    };
  

    const handleClick = (e: any) => {
        e.preventDefault();
        const dropdownName = e.target.options[e.target.selectedIndex].text;
        if(dropdownName){
          setCategoryText(dropdownName);
          setCategoryValue(e.target.value);
        } 
        else{
          setCategoryText(null);
          setCategoryValue(null);
        }
      };

const uploadImages = async (e: any) => {
    e.preventDefault();
    const API_PATH = "/api/admin/gallery/";

    if (categoryText === null) {
        toast.error("Please select a category.");
        return;
    }

    if (!selectedFiles || selectedFiles.length === 0) {
        setErrorMessage(true);
        return;
    }

    setLoading(true);

    try {
        // Remove duplicate files by name and size
        const uniqueFiles = selectedFiles.filter(
        (file, index, self) =>
            index === self.findIndex(f => f.name === file.name && f.size === file.size)
        );
        // Map captions to unique files
        const uniqueCaptions = uniqueFiles.map(file => {
        const idx = selectedFiles.findIndex(
            f => f.name === file.name && f.size === file.size
        );
        return captions[idx];
        });
        const uploadPromises = uniqueFiles.map((image, index) => {
            return new Promise((resolve, reject) => {
                const extension = image.name.substr(image.name.lastIndexOf(".") + 1);
                new Compressor(image, {
                    quality: 0.9,
                    maxWidth: 1920,
                    maxHeight: 1080,
                    success: (result) => {
                        const formdata = new FormData();
                        formdata.append("image", result);
                        formdata.append("extension", extension);
                        formdata.append("categoryId", categoryValue ?? "");
                        formdata.append("category_name", categoryText);
                        formdata.append("userId", userId ?? "");
                        formdata.append("caption", uniqueCaptions[index]);
                        fetch(API_PATH, {
                            method: "POST",
                            body: formdata,
                        })
                        .then((res) => {
                            if (!res.ok) throw new Error("Upload failed");
                            resolve(res);
                        })
                        .catch(reject);
                    },
                    error: reject,
                });
            });
        });

        await Promise.all(uploadPromises);
        toast.success("All images uploaded!");

        setSelectedFiles([]);
        setCaptions([]);
        setIsActive(false);

        if (inputFile.current) {
            inputFile.current.value = "";
            inputFile.current.type = "file";
        }

        router.push(`/admin/gallery/category/${categoryText}`);
    } catch (err: any) {
        toast.error("Upload failed: " + err.message);
    } finally {
        setLoading(false);
    }
}
  return (
    <form onSubmit={uploadImages}>
        <div className="mb-3 col-md-2">
            <label htmlFor="category" className="form-label">Select Category: </label>
            <select
                name="category_id"
                onClick={handleClick}
                required
                className="form-select">
                <option value=""></option>
                {categories.map((category) => (
                <option key={category.id} value={category.id}>
                    {category.category_name}
                </option>
                ))}
            </select>
        </div>
        <div className="mb-3">
            <label htmlFor="formFile" className="form-label">Choose files to upload</label>
            <input
            className="form-control"
            type="file"
            id="formFile"
            name="file"
            multiple
            required
            onChange={handleFileChange}
            />
        </div>
        <div className="row">
                {selectedFiles.map((image, index) => (
                    <div className="col-md-2" key={index}>
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
                            <Button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="btn btn-sm btn-danger position-absolute"
                                style={{ top: 0, right: 0, zIndex: 2}}>
                                X
                            </Button>
                            <img
                                className="img-fluid"
                                src={URL.createObjectURL(image)} 
                                alt={`preview ${index}`}
                                style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                                }}
                            />
                            </div>
                            <div>
                             <textarea
                                    name='caption'
                                    placeholder="Enter caption"
                                    value={captions[index]}
                                    onChange={(event) => handleCaptionChange(index, event)}
                                    className="border w-100"
                                    rows={2}
                                /> 
                            </div>
                        </div>
                        </div>
                ))}
        </div>
        <div className="progress d-none mb-3">
            <div className="progress-bar" role="progressbar" style={{ width: "0%" }}></div>
        </div>
        { isActive ? (
             <Button type="submit" className="btn btn-secondary">Upload</Button>
                ) :  null
        }

</form>
  )
}

export default UploadImagesForm 