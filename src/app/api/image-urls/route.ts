import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from "next/server";
import { getImageUrls } from '@/lib/supabaseDb/supabase';

console.log('Entering api/image-urls/route.ts')

// type Data = string[] | undefined

export async function GET(req: NextRequest) {

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