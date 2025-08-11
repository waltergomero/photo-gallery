import React from 'react';
import GalleryGrid from '@/components/admin/gallery/gallery-grid';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import Link from 'next/link';

const GalleryPage = async ({params}: {params: {id: string[]}}) => {
    const _params = await params;
    const category_name =_params.id[0].replace(/%20/g, ' ');

  return (
            <div className="container-fluid">
                <PageBreadcrumb title="Gallery" subtitle="table" />
                 <div className="row justify-content-center">
                    <div className="col-xxl-10">
                        <div className="card">
                            <div className="card-body">
                                <Link href="/admin/gallery/upload" className="btn btn-secondary mb-3">Upload Images</Link>                               
                                <GalleryGrid  category_name={category_name} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

  )
}

export default GalleryPage