import { v2 as cloudinary } from "cloudinary"
import { APISCRET } from "../constants"

cloudinary.config({
  cloud_name: "dcm54qy2k",
  api_key: "693929191313383",
  api_secret: APISCRET, // Click 'View API Keys' above to copy your API secret
})
export async function UpImage(foto: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    let urlFinal = ""
    let randomR = crypto.randomUUID()
    cloudinary.uploader
      .upload_stream(
        { resource_type: "auto", public_id: randomR },
        (error, result) => {
          if (error) reject("error al subir la imagen")
          let url = result?.secure_url
          urlFinal = url as string
        },
      )
      .end(foto)
    let optimized = cloudinary.url(randomR, {
      fetch_format: "auto",
      quality: "auto",
    })
    resolve(optimized)
  })
}
;(async function () {
  // Configuration
  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(
      "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
      {
        public_id: "shoes",
      },
    )
    .catch((error) => {
      console.log(error)
    })

  console.log(uploadResult)

  // Optimize delivery by resizing and applying auto-format and auto-quality
  const optimizeUrl = cloudinary.url("shoes", {
    fetch_format: "auto",
    quality: "auto",
  })

  console.log(optimizeUrl)

  // Transform the image: auto-crop to square aspect_ratio
  const autoCropUrl = cloudinary.url("shoes", {
    crop: "auto",
    gravity: "auto",
    width: 500,
    height: 500,
  })

  console.log(autoCropUrl)
})
