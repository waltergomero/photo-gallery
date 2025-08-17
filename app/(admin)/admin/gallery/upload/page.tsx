import React from 'react'
import GalleryGrid from "@/components/admin/gallery/gallery-grid";
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { fetchImages, } from '@/actions/gallery-actions';
import { requireAdmin } from '@/lib/auth-guard';
import Link from 'next/link';
import UploadImagesForm from '@/components/admin/gallery/upload-images';
import UploadImages from '@/components/admin/gallery/uploadImages';


export const metadata= { title: "Gallery" }


const UploadPage = async () => {
  await requireAdmin();
  const images = await fetchImages();

    return (
            <div className="container-fluid">
                <PageBreadcrumb title="Upload" subtitle="table" />
                 <div className="row justify-content-center">
                    <div className="col-xxl-10">
                        <div className="card">
                            <div className="card-body">
                                {/* <UploadImagesForm /> */}
                                <UploadImages />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
)
}
export default UploadPage;