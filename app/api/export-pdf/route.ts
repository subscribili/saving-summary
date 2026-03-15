import { NextRequest, NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { renderDocumentHtml } from "@/lib/pdf-template";
import { FeeScheduleDocument } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getLaunchOptions() {
  if (process.env.VERCEL) {
    return {
      executablePath: await chromium.executablePath(),
      headless: true,
      args: [...chromium.args, "--hide-scrollbars"],
    };
  }

  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ];

  return {
    executablePath: candidates[0],
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  };
}

export async function POST(request: NextRequest) {
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;

  try {
    const document = (await request.json()) as FeeScheduleDocument;
    const html = renderDocumentHtml(document);

    browser = await puppeteer.launch(await getLaunchOptions());

    const page = await browser.newPage();
    await page.setViewport({ width: 1600, height: 2240, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.emulateMediaType("screen");

    const pdf = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
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
