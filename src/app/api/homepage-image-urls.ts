// import type { NextApiRequest, NextApiResponse } from "next";
// import { createClient } from '@supabase/supabase-js'


// console.log('Entering api/hompage-image-urls')

// // type Data = string[] | undefined

// export async function handler(req: NextApiRequest, res: NextApiResponse) {
//   switch (req.method) {
//     case "GET":

//       console.log('getting Image URLs...')
//       console.log('getHomepageImageUrls/request: ', req)
//       // const cookieStore = cookies();
//       const { SUPABASE_URL, SUPABASE_KEY } =
//         process.env;

//       const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!, {
//       })

//       try {
//         // get images from supabase;
//         const { data, error } = await supabase
//           .storage
//           .from('products')
//           .list('arrangements', {
//             limit: 3,
//             offset: 1
//           })

//         console.log('middleware.ts/getHomepageImageUrls/data: ', data)

//         const urls: string[] | undefined = data?.map((img) => {
//           const url = supabase.storage
//             .from('products/arrangements')
//             .getPublicUrl(img.name);
//           // console.log('serverActions/getImages/urls/map/url: ', url)
//           return url.data.publicUrl;
//           // return img.name
//         })
//         console.log('getImages/urls: ', urls)

//         res.status(200).json(urls);

//       }
//       catch (err) {
//         console.error(err);
//         res.status(503).json("Couldn't fetch URLs")

//       }
//   }
// }