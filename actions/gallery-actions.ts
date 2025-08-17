'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import  prisma  from '@/prisma/prisma';
const fs = require('fs');
import path from 'path';

export const fetchImages = async (category_name = "") => { 
    try {
      noStore(); // Disable caching for this function
      
       let _images;

       if (category_name === "All") {
        _images = await prisma.UserImages.findMany({});
      }
      else {
        _images = await prisma.UserImages.findMany({
          where: {
            category_name: category_name ? { equals: category_name } : undefined,
          },
        });
      }
        const images = JSON.parse(JSON.stringify(_images));
        return images;
    } catch (err) {
        return({error: err + "Failed to fetch images!"});
    }
}

export const fetchImagesByCategory = async (category_name: string) => {
  try {
    noStore(); // Disable caching for this function
    let _images = "";

      if(category_name === "All" || category_name === "0"){
          _images = await prisma.UserImages.findMany({
            where: {
              isactive: true // Only fetch active images
            },
            select: {
              id: true,
              src: true,
              caption: true,
              categoryId: true,
              category_name: true,
              width: true,
              height: true,
              format: true,
              isactive: true
            }
          })
      }
      else{
          _images = await prisma.UserImages.findMany({
            where: {
              AND: [
                {category_name: {
                  equals: category_name,
                  mode: 'insensitive'
                }},
                {isactive: true} // Only fetch active images
              ]
            },
            select: {
              id: true,
              src: true,
              caption: true,
              categoryId: true,
              category_name: true,
              width: true,
              height: true,
              format: true,
              isactive: true
            }
          }) 
      }
    const images = JSON.parse(JSON.stringify(_images));
    return images

  } catch (err) {
    return({error: "Failed to fetch gallery images by category! " + err});
  }
};

export async function deleteImageFromGallery(image_id: string, image_src: string) {
console.log("delete image from gallery: ", image_id, image_src);
  try {
    //await prisma.Homepagecategories.deleteMany({where: { src: image_src}});
    const response = await prisma.UserImages.delete({ where: {id: image_id}});
   console.log("response from delete: ", response);
    if(response){
      const imagePath = path.join(process.cwd(), 'public', image_src);
      console.log("image path: ", imagePath);

      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
          console.log("File deleted:", imagePath);
        } catch (err) {
          console.error("Failed to delete file:", err);
        }
      } else {
        console.log("File does not exist:", imagePath);
      }
    }
    
  } catch (err) {
    return({error: "Failed to delete image! " + err});
  }
  revalidatePath("/admin/gallery");
}


export async function fetchCategoriesWithImages() {
  try {
    //fetch distinct categories from UserImages collection
    const _categories = await prisma.UserImages.findMany({
      select: {
        categoryId: true,
        category_name: true
      },
      distinct: ['categoryId', 'category_name'],
      orderBy: {
        category_name: 'asc'
      }
    });
    const categories = JSON.parse(JSON.stringify(_categories));

    //add categoryId = 0 and category_name = "All" to the categories array
    categories.unshift({ categoryId: "0", category_name: "All" });
    
    return categories;
  } catch (err) {
    return({error: "Failed to fetch categories with images! " + err});
  }
}


export async function fetchOneImagePerCategory() {
  try {
    const _images = await prisma.UserImages.findMany({
      distinct: ['category_name'],
      where: {
        format: 'landscape',
      },
      select: {
        id: true,
        src: true,
        caption: true,
        category_name: true
      },
      orderBy: {
        category_name: 'asc',
      },
      take: 4
    });
    const images = JSON.parse(JSON.stringify(_images));
    return images;
  } catch (err) {
    return({error: "Failed to fetch one image per category! " + err});
  }
}








export const fetchVisibleImagesForHomePage = async () => {
 
  try {
    
    const _images = await prisma.Homepagecategories.findMany({
      orderBy: [
        {
          createdAt: "desc", // or pass "asc" to order ascendingly
        },
      ],
      take: 8
    }) 

    const images = JSON.parse(JSON.stringify(_images));
    return images

  } catch (err) {
    return({error: "Failed to fetch gallery images! " + err});
  }
};

export const fetctCategoriesForHomePage = async () => {
 
  try {
    const _images = await prisma.Homepagecategories.findMany();

    const images = JSON.parse(JSON.stringify(_images));
    return images

  } catch (err) {
    return({error: "Failed to fetch gallery images! " + err});
  }
};


export const fetchVisibleImagesByCategory = async (category_id: string) => {
  try {
    const _images = await prisma.Gallery.findMany({
                    where: {
                        AND: [{category_id: category_id}, {is_visible: true}]
                          },
                    select: {
                      category_name: true, src: true, width: true, height:true, format:true
                    }
                        }) 
    const images = JSON.parse(JSON.stringify(_images));
    return images

  } catch (err) {
    return({error: "Failed to fetch gallery images by category! " + err});
  }
};





export const fetchImageById = async (id: string) => {
  try {
    const _image = await prisma.UserImages.findUnique({ 
      where: {id: id},
      select: { id: true, image_name: true, category_id: true, category_name: true, src: true, caption: true}}); 

    const image = JSON.parse(JSON.stringify(_image));
    return image;

  } catch (err) {
    return({error: "Failed to fetch image information! " + err});
  }
};

export async function updateImageCategory(formData: FormData) {

  try {
    const id = formData.get("image_id");
    const category_name = formData.get("category_name");
    const category_id = formData.get("category_id");
    const src = formData.get("src");
    const image_name = formData.get("image_name");
    const caption = formData.get("caption");
    const updated_by = formData.get("updated_by");

    const query = {
      category_name: category_name,
      category_id: category_id,
      caption: caption,
      updated_by: updated_by,
    };

    console.log("update image information: ", id,  query);

    await prisma.Gallery.update({ 
          where: {id: id}, data: query});

    const imageExist = await prisma.Homepagecategories.findUnique({ where:{image_name: image_name}});
    const categoryExist = await prisma.Homepagecategories.findUnique({ where: {category_name_name: category_name}});

    if(imageExist && categoryExist){  
        await prisma.Homepagecategories.delete({ where: {category_id: categoryExist.category_id}}); 
        await prisma.Homepagecategories.update({ where: {id: imageExist.id}, data: query}); 
     }
    else if(imageExist && !categoryExist){ //update the image name and path in the homepagecategories collection
      await prisma.Homepagecategories.update({ where: {id: imageExist.id}, data: query}); 
     }
    else{
        if(!imageExist && !categoryExist){ //if category do not exists, then add the category to the homepagecategories collection
          const newItem = {
            category_id,
            category_name,
            image_name,
            src
          };

        await prisma.Homepagecategories.create({data: newItem});
          }
      } 
    }catch (err) {
      return({error: "Failed to update image information! " + err});
    }
      revalidatePath("/admin/gallery");
    }




export async function MakeImageVisible(image_id: string, user_email: string) {
  try {
      const query = {
        is_visible: true,
    };    

    await prisma.Gallery.update({ where: {id: image_id}, data: query});

    const imageInfo = await prisma.Gallery.findUnique({ 
      where: {
        id: image_id 
            }
          });
  
    const categoryExist = await prisma.Homepagecategories.findMany({
      where: {
        category_id: imageInfo.category_id
            }
        });

    if(categoryExist.length > 0){ //if category exists, then update the fields image name and image path
      const updatequery = {
        image_name: imageInfo.image_name,
        src: imageInfo.src,
        updated_by:user_email,
        }
        await prisma.Homepagecategories.updateMany({ where: {category_id: imageInfo.category_id}, data: updatequery});
      }
      else{
        const newItem = {
          category_id: imageInfo.category_id,
          category_name: imageInfo.category_name,
          image_name: imageInfo.image_name,
          src: imageInfo.src,
          width: imageInfo.width,
          height: imageInfo.height,
          created_by:user_email,
          updated_by:user_email,
        };

        await prisma.Homepagecategories.create({data: newItem});
      }
    
  } catch (err) {
    //throw new Error(err);
    return({error: "Failed to set image visible! " + err});
  }
  revalidatePath("/admin/gallery");
}

export async function MakeImageNotVisible(image_id: string, image_src: string) {

  try {
    const query = {
      is_visible: false,
  };    
    await prisma.Gallery.update({ where: {id: image_id}, data: query });
    
  } catch (err) {
    //throw new Error(err);
    return({error: "Failed to set image  not visible! " + err});
  }
  revalidatePath("/admin/gallery");
}

export async function MakeAllImageVisibility(settings: boolean, category_name: string) {
  try {
    const query = {
      is_visible: settings,
  };  
    if(category_name === "0")  
      await prisma.UserImages.updateMany({ data: query });
    else
      await prisma.UserImages.updateMany({ where: {category_name: category_name}, data: query });
  } catch (err) {
    return({error: "Failed to set image  not visible! " + err});
  }
  revalidatePath("/admin/gallery");
}

export const FetchImagesByOrientation = async () => {

  try {
    const _images = await prisma.Gallery.findMany({
      where: {
        format: {
          equals: "landscape",
           mode: 'insensitive',
          }}}) 
    const images = JSON.parse(JSON.stringify(_images));
    console.log("server orientation images: ", images)
    return images

  } catch (err) {
    return({error: "Failed to fetch gallery images!"});
  }
};


// export const FetchRandomImages = async () => {
 
//   try {
//     const _images = await prismarandom.Gallery.findManyRandom( 50, {
//      select: { id: true, category_id: true, category_name: true, image_name: true, src: true, },
//       where: { is_visible: true, },
//      }) 
//     const images = JSON.parse(JSON.stringify(_images));
//     console.log("server random images: ", images)
//     return images

//   } catch (err) {
//     return({error: "Failed to fetch random images!"});
//   }
// };
