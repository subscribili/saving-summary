import { readFileSync } from "node:fs";
import path from "node:path";
import { pageMetrics, paginateDocument } from "@/lib/pagination";
import { FeeScheduleDocument } from "@/lib/types";

const PAGE_WIDTH = pageMetrics.width;
const PAGE_HEIGHT = pageMetrics.height;
const CONTENT_WIDTH = PAGE_WIDTH - pageMetrics.paddingX * 2;
const CPT_COL = 160;
const PLAN_COL = 160;
const ROW_HEIGHT = 56;
const LOGO_HEIGHT = 64;
const BORDER_WIDTH = 0.75;
const POWERED_BY_PNG = readFileSync(path.join(process.cwd(), "public", "poweredby-subscribili-logo.png")).toString("base64");

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildColumns(planCount: number) {
  const descriptionWidth = CONTENT_WIDTH - CPT_COL - PLAN_COL * planCount;
  return `${CPT_COL}px ${descriptionWidth}px repeat(${planCount}, ${PLAN_COL}px)`;
}

function renderPoweredByLogo() {
  return `<img class="powered-image" src="data:image/png;base64,${POWERED_BY_PNG}" alt="Powered by Subscribili" />`;
}

function resolveImageSrc(src: string) {
  if (!src.startsWith("/")) {
    return src;
  }

  const assetPath = path.join(process.cwd(), "public", src.replace(/^\//, ""));
  const ext = path.extname(assetPath).toLowerCase();
  const mimeType =
    ext === ".png"
      ? "image/png"
      : ext === ".jpg" || ext === ".jpeg"
        ? "image/jpeg"
        : "application/octet-stream";

  return `data:${mimeType};base64,${readFileSync(assetPath).toString("base64")}`;
}

export function renderDocumentHtml(document: FeeScheduleDocument) {
  const pages = paginateDocument(document);
  const columns = buildColumns(document.plans.length);

  const pageMarkup = pages
    .map((page) => {
      const intro = page.showIntro
        ? `
          <div class="intro">
            <div class="logo-wrap">${document.config.logoDataUrl ? `<img src="${resolveImageSrc(document.config.logoDataUrl)}" class="logo" alt="Logo" />` : ""}</div>
            <div class="heading-block">
              <h1>${escapeHtml(document.config.title)}</h1>
              <p class="disclaimer top">${escapeHtml(document.config.topDisclaimer)}</p>
            </div>
          </div>
        `
        : "";

      const hasTableContent = page.segments.some((segment) => segment.items.length > 0);

      const tableHeader = `
        <div class="row" style="grid-template-columns:${columns}">
          <div class="cell header-cell">CPT Code</div>
          <div class="cell header-cell">Procedure Description</div>
          ${document.plans.map((plan) => `<div class="cell header-cell center">${escapeHtml(plan.name)}</div>`).join("")}
        </div>
      `;

      const segments = page.segments
        .map((segment) => {
          const rows = segment.items
            .map(
              (item) => `
              <div class="row" style="grid-template-columns:${columns}">
                <div class="cell body-cell">${escapeHtml(item.cptCode)}</div>
                <div class="cell body-cell">${escapeHtml(item.description)}</div>
                ${document.plans.map((plan) => `<div class="cell body-cell center">${escapeHtml(item.values[plan.id] ?? "--")}</div>`).join("")}
              </div>
            `,
            )
            .join("");

          return `
            <div class="segment">
              <div class="category">${escapeHtml(segment.category)}</div>
              ${rows}
            </div>
          `;
        })
        .join("");

      const outro = page.showOutro
        ? `
          <div class="outro">
            <div class="banner">${escapeHtml(document.config.discountBannerText)}</div>
            <p class="disclaimer bottom">${escapeHtml(document.config.bottomDisclaimer)}</p>
            <div class="footer-branding">${renderPoweredByLogo()}</div>
          </div>
        `
        : "";

      return `
        <section class="page">
          ${intro}
          ${hasTableContent ? `<div class="table-shell">${tableHeader}${segments}</div>` : ""}
          ${outro}
        </section>
      `;
    })
    .join("");

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(document.config.title)}</title>
        <link rel="preconnect" href="https://rsms.me" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <style>
          @page { size: ${PAGE_WIDTH}px ${PAGE_HEIGHT}px; margin: 0; }
          * { box-sizing: border-box; }
          html, body {
            margin: 0;
            padding: 0;
            font-family: InterDisplay, Inter, Arial, sans-serif;
            background: #ffffff;
            color: #1e293b;
          }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .page {
            width: ${PAGE_WIDTH}px;
            min-height: ${PAGE_HEIGHT}px;
            height: ${PAGE_HEIGHT}px;
            padding: ${pageMetrics.paddingY}px ${pageMetrics.paddingX}px;
            background: white;
            page-break-after: always;
            display: flex;
            flex-direction: column;
          }
          .page:last-child { page-break-after: auto; }
          .intro { display: flex; flex-direction: column; gap: 64px; margin-bottom: 48px; }
          .logo-wrap { height: ${LOGO_HEIGHT}px; display: flex; align-items: center; }
          .logo { max-height: ${LOGO_HEIGHT}px; width: auto; max-width: 420px; object-fit: contain; }
          .heading-block { display: flex; flex-direction: column; gap: 16px; }
          h1 {
            margin: 0;
            font-size: 36px;
            line-height: 40px;
            font-weight: 500;
            letter-spacing: -1.44px;
            color: #22211F;
            text-align: left;
          }
          .disclaimer {
            margin: 0;
            text-align: justify;
            color: #4A5462;
            font-size: 20px;
            font-weight: 400;
            line-height: 24px;
            letter-spacing: -0.54px;
          }
          .table-shell {
            width: ${CONTENT_WIDTH}px;
            border-left: ${BORDER_WIDTH}px solid #E4EAF1;
          }
          .row { display: grid; width: ${CONTENT_WIDTH}px; }
          .cell {
            min-height: ${ROW_HEIGHT}px;
            height: ${ROW_HEIGHT}px;
            padding: 0 20px;
            display: flex;
            align-items: center;
            border-right: ${BORDER_WIDTH}px solid;
            border-bottom: ${BORDER_WIDTH}px solid;
          }
          .center { justify-content: center; text-align: center; }
          .header-cell {
            background: ${document.config.headerRowColor};
            color: #FFF;
            border-color: rgba(255,255,255,0.24);
            font-size: 16px;
            font-weight: 400;
            line-height: 22px;
            letter-spacing: -0.64px;
          }
          .body-cell {
            background: white;
            color: #25272C;
            border-color: #E4EAF1;
            font-size: 16px;
            font-weight: 400;
            line-height: 22px;
            letter-spacing: -0.64px;
          }
          .category {
            width: ${CONTENT_WIDTH}px;
            min-height: ${ROW_HEIGHT}px;
            height: ${ROW_HEIGHT}px;
            display: flex;
            align-items: center;
            padding: 0 20px;
            font-size: 16px;
            font-weight: 500;
            line-height: 20px;
            color: #25272C;
            letter-spacing: -0.32px;
            background: ${document.config.categoryRowColor};
            border-right: ${BORDER_WIDTH}px solid #E4EAF1;
            border-bottom: ${BORDER_WIDTH}px solid #E4EAF1;
          }
          .outro { display: flex; flex-direction: column; gap: 32px; margin-top: 40px; }
          .banner {
            min-height: ${ROW_HEIGHT}px;
            height: ${ROW_HEIGHT}px;
            background: ${document.config.discountBannerColor};
            color: #FFF;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-size: 18px;
            font-weight: 500;
            line-height: 22px;
            letter-spacing: -0.72px;
          }
          .footer-branding { display: flex; justify-content: flex-end; }
          .powered-image { display: block; max-height: 48px; width: auto; }
        </style>
      </head>
      <body>${pageMarkup}</body>
    </html>
  `;
}
