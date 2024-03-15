import { NextRequest, NextResponse } from "next/server";
// import { getImageUrls } from '../../../lib/supabaseDb/supabase';
import { getImageUrls } from "@/utils/supabase/getImageUrls";

console.log('Entering api/image-urls/route.ts')
// type Data = string[] | undefined

export async function GET(req: NextRequest) {
  console.log('api/getImages/GET/req: ', req)

  console.log('getting Image URLs...')
  try {
    const urls = await getImageUrls();
    return NextResponse.json(urls);

  }
  catch (err) {
    console.error(err);
    return NextResponse.json("Couldn't fetch URLs")
  }
}