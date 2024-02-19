// "use server";

// import bcrypt from 'bcrypt'
// import { createServerClient, type CookieOptions } from '@supabase/ssr'
// import { cookies } from 'next/headers'

// // initial function for getting sample image set from supabase
// export async function getImages(): Promise<Promise<string>[] | undefined> {

//   const cookieStore = cookies();
//   const { SUPABASE_URL, SUPABASE_KEY } =
//     process.env;
//   const supabase = createServerClient(SUPABASE_URL!, SUPABASE_KEY!, {
//     cookies: {
//       get(name: string) {
//         // console.log('serverActions/getImages/createServerclient/cookies/name: ', name)
//         return cookieStore.get(name)?.value
//       }
//     }
//   })
//   try {
//     // get images from supabase;
//     const { data, error } = await supabase
//       .storage
//       .from('products')
//       .list('arrangements', {
//         limit: 10,
//         offset: 1
//       })

//     // console.log('serverActions/getImages/supabase/data: ', data);

//     const urls: Promise<string>[] | undefined = Promise.all((resolve, reject) => {


//     })


//     // data?.map(async (img) => {
//     //   const url = await supabase.storage
//     //     .from('products')
//     //     .getPublicUrl(img.name, {
//     //       transform: {
//     //         width: 150,
//     //         height: 150
//     //       }
//     //     });
//     //   // console.log('serverActions/getImages/urls/map/url: ', url)
//     //   return url.data.publicUrl;
//     //   // return img.name
//     // })

//     // console.log('serverActions/getImages/urls: ', urls)

//     return urls;
//   }
//   catch (err) {
//     console.error(err);
//   }
// }