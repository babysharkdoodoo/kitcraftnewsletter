import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Try to get one subscriber to see the structure
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .limit(1)
    
    return NextResponse.json({
      success: !error,
      error: error?.message,
      data,
      columns: data && data.length > 0 ? Object.keys(data[0]) : []
    })
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message
    })
  }
}
