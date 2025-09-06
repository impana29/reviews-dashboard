import { NextResponse } from "next/server";
import { getHostawayNormalizedWithSource } from "../../../../lib/getHostawayNormalized";

export async function GET() {
  try {
    const { result, source } = await getHostawayNormalizedWithSource();
    return NextResponse.json({
      status: "success",
      source,
      count: result.length,
      result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
