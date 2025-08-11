import React from 'react'
import GalleryGrid from "@/components/admin/gallery/gallery-grid";
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { fetchImages, } from '@/actions/gallery-actions';
import { requireAdmin } from '@/lib/auth-guard';
import Link from 'next/link';


export const metadata= { title: "Gallery" }


const GalleryPage = async () => {
  await requireAdmin();


    return (
            <div className="container-fluid">
                <PageBreadcrumb title="Gallery" subtitle="table" />
                 <div className="row justify-content-center">
                    <div className="col-xxl-12">
                        <div className="card">
                            <div className="card-body">
                                <Link href="/admin/gallery/upload" className="btn btn-secondary mb-3">Upload Images</Link>
                                <GalleryGrid category_name={"All"}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
)
}
export default GalleryPage;