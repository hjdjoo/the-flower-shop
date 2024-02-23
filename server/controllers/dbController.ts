import { RequestHandler, Request, Response, NextFunction } from 'express';
import { ServerError } from '../types/server-types'

import { createClient } from '@supabase/supabase-js'

// const getImages = () => { }

const getHomepageImageUrls: RequestHandler = async (_, res: Response, next: NextFunction) => {

  console.log('getting Image URLs...')

  // const cookieStore = cookies();
  const { SUPABASE_URL, SUPABASE_KEY } =
    process.env;

  const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!, {
  })

  try {
    // get images from supabase;
    const { data, error } = await supabase
      .storage
      .from('products')
      .list('arrangements', {
        limit: 3,
        offset: 1
      })

    const urls: string[] | undefined = data?.map((img) => {
      const url = supabase.storage
        .from('products/arrangements')
        .getPublicUrl(img.name);
      // console.log('serverActions/getImages/urls/map/url: ', url)
      return url.data.publicUrl;
      // return img.name
    })
    console.log('getImages/urls: ', urls)

    res.locals.homepageImageUrls = urls;

    return next();
  }
  catch (err) {
    console.error(err);
    const error: ServerError = {
      log: 'Error occurred in makeQuery middleware function',
      status: 500,
      message: {
        err: `${err}`
      }
    }
    return next(error);
  }
}

export {
  getHomepageImageUrls
}