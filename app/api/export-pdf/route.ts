import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import { renderDocumentHtml } from "@/lib/pdf-template";
import { FeeScheduleDocument } from "@/lib/types";

function getExecutablePath() {
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ];

  return candidates.find((candidate) => !!candidate) ?? candidates[0];
}

export async function POST(request: NextRequest) {
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;

  try {
    const document = (await request.json()) as FeeScheduleDocument;
    const html = renderDocumentHtml(document);

    browser = await puppeteer.launch({
      executablePath: getExecutablePath(),
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1600, height: 2240, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: "networkidle0" });

    await page.emulateMediaType('screen');

    const pdf = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      scale: 1,
    });

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="subscriber-fee-schedule.pdf"',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to export PDF." },
      { status: 500 },
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
