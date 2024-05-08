import { NextRequest, NextResponse } from "next/server";
// import { getImageUrls } from '../../../lib/supabaseDb/supabase';
import { getUrl } from "@/utils/supabase/clientActions/getUrl";

console.log('Entering api/image-urls/route.ts')
// type Data = string[] | undefined

export async function GET(req: NextRequest) {
  console.log('api/getImages/GET/req: ', req)
  // When calling this endpoint, call with /:product_id endpoint and read product id from URL - one possible way of dynamic image generation.
  // https automagically secures these routes, right?

  console.log('getting Image URLs...')
  try {
    const urls = await getUrl();
    return NextResponse.json(urls);

  }
  catch (err) {
    console.error(err);
    return NextResponse.json("Couldn't fetch URLs")
  }
}