import React from 'react';
import GalleryGrid from '@/components/admin/gallery/gallery-grid';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import Link from 'next/link';

const GalleryPage = async ({params, searchParams}: { params: {id: string[]};
                                                     searchParams: {[key: string]: string | string[] | undefined}}) => {
    const _params = await params;
    const _searchParams = await searchParams;
    
    // Dynamic route params
    const categoryName = _params.id ? decodeURIComponent(_params.id[0]) : 'All';
    console.log("GalleryPage categoryName 1: ", categoryName);
    // Query string params
    const page = _searchParams.page || '1';
    const sortBy = _searchParams.sort || 'date';

  return (
            <div className="container-fluid">
                <PageBreadcrumb title="Gallery" subtitle="table" />
                 <div className="row justify-content-center">
                    <div className="col-xxl-12">
                        <div className="card">
                            <div className="card-body">
                                <Link href="/admin/gallery/upload" className="btn btn-secondary mb-3">Upload Images</Link>
                                <GalleryGrid category_name={categoryName} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

  )
}

export default GalleryPage