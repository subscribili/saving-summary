import { NextRequest, NextResponse } from "next/server";
import { buildGoogleSheetCsvUrl, mapRowsToDocument, parseCsv } from "@/lib/google-sheets";

export async function GET(request: NextRequest) {
  const input = request.nextUrl.searchParams.get("url");

  if (!input) {
    return NextResponse.json({ error: "Missing sheet URL." }, { status: 400 });
  }

  try {
    const csvUrl = buildGoogleSheetCsvUrl(input);
    const response = await fetch(csvUrl, {
      headers: {
        Accept: "text/csv",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error("Could not fetch the Google Sheet CSV. Ensure the sheet is public or published.");
    }

    const csv = await response.text();
    const rows = parseCsv(csv);
    const result = mapRowsToDocument(rows);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to import the Google Sheet.",
      },
      { status: 400 },
    );
  }
}
