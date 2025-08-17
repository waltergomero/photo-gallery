import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import sharp from 'sharp';
import path from 'path';
const fs = require('fs');

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    const extension = formData.get("extension");
    const categoryId = formData.get("categoryId");
    const category_name = formData.get("category_name");
    const userId = formData.get("userId");
    const image_caption = formData.get("caption");
    

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    var date = new Date();
    const unixTimestamp = Math.floor(date.getTime());
    const newName = unixTimestamp + "." + extension;

    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }
    var blob = file.slice(0, file.size);
    var newFileName = new File([blob], newName, { type: file.type });
    const imageName = newFileName.name;

    const partialDir = '/images/gallery/' + category_name;
    const dir = path.join(process.cwd(), 'public', partialDir);
    const dirExist = fs.existsSync(dir);
    if (!dirExist) {
      fs.mkdirSync(dir, { recursive: true });
    }   
    const partialPath = partialDir + "/" + imageName;
    const src = `./public/${partialPath}`;
    const absolutePath = dir + "/" + imageName;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    await fs.promises.writeFile(src, buffer);

    const { width, height } = await sharp(src).metadata();

    var format = "landscape";
     if (height > width) format = "portrait";

    const isBW = await isBlackAndWhite(absolutePath);

    const addImageToGallery = {
      userId: userId,
      categoryId: categoryId,
      category_name: category_name,
      src: partialPath,
      format: format,
      width: width,
      height: height,
      caption: image_caption,
      isactive: false,
      isblackwhite: isBW,
    };
   
   const data = await prisma.UserImages.create({ data: addImageToGallery});
 
    return NextResponse.json({ status: "success" });
  

  } catch (error) {
    console.error("Error processing request: ", error);
    return NextResponse.json({ error: "Error processing request" }, { status: 500 });
  }
}

async function isBlackAndWhite(imagePath: string) {
  const image = sharp(imagePath);

  // Retrieve raw pixel data
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  // Check if all pixels are black and white
  let isBlackAndWhite = true;
  for (let i = 0; i < data.length; i += info.channels) {
      const r = data[i];     // Red channel
      const g = data[i + 1]; // Green channel
      const b = data[i + 2]; // Blue channel

      // If RGB values aren't equal, it's not black and white
      if (r !== g || g !== b) {
          isBlackAndWhite = false;
          break;
      }
  }

  return isBlackAndWhite;
}