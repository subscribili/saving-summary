"use client";

import { useMemo, useState, useTransition } from "react";
import { DocumentPreview } from "@/components/document-preview";
import { SettingsPanel } from "@/components/settings-panel";
import { exportDocumentPdf } from "@/lib/export-pdf";
import { DEFAULT_LOGO_PATH, defaultDocument } from "@/lib/mock-data";
import { paginateDocument } from "@/lib/pagination";
import { FeeScheduleConfig, FeeScheduleDocument } from "@/lib/types";

export function BuilderApp() {
  const [document, setDocument] = useState<FeeScheduleDocument>(defaultDocument);
  const [sheetUrl, setSheetUrl] = useState("");
  const [zoom, setZoom] = useState(80);
  const [status, setStatus] = useState<string>("Loaded mock fee schedule.");
  const [isImportPending, startImportTransition] = useTransition();
  const [isExporting, setIsExporting] = useState(false);

  const pages = useMemo(() => paginateDocument(document), [document]);

  function updateConfig<K extends keyof FeeScheduleConfig>(key: K, value: FeeScheduleConfig[K]) {
    setDocument((current) => ({
      ...current,
      config: {
        ...current.config,
        [key]: value,
      },
    }));
  }

  function updateLogo(file: File | null) {
    if (!file) {
      updateConfig("logoDataUrl", DEFAULT_LOGO_PATH);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateConfig("logoDataUrl", typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
  }

  function importSheet() {
    if (!sheetUrl) {
      setStatus("Paste a Google Sheet URL first.");
      return;
    }

    startImportTransition(async () => {
      try {
        const response = await fetch(`/api/import-sheet?url=${encodeURIComponent(sheetUrl)}`);
        const payload = (await response.json()) as
          | { plans: FeeScheduleDocument["plans"]; items: FeeScheduleDocument["items"] }
          | { error: string };

        if (!response.ok || "error" in payload) {
          throw new Error("error" in payload ? payload.error : "Unable to import sheet.");
        }

        setDocument((current) => ({
          ...current,
          plans: payload.plans,
          items: payload.items,
        }));
        setStatus(`Imported ${payload.items.length} procedures from Google Sheets.`);
      } catch (error) {
        setStatus(error instanceof Error ? `${error.message} Using mock data.` : "Import failed. Using mock data.");
      }
    });
  }

  function resetMockData() {
    setDocument(defaultDocument);
    setStatus("Reset to the default mock dataset.");
  }

  async function handleExportPdf() {
    try {
      setIsExporting(true);
      setStatus("Generating PDF...");
      await exportDocumentPdf(document);
      setStatus("PDF downloaded.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to export PDF.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(10,79,143,0.12),_transparent_26%),linear-gradient(180deg,#f3f7fb_0%,#e7edf4_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[2200px] gap-6 px-6 py-6 print:block print:max-w-none print:p-0">
        <SettingsPanel
          config={document.config}
          isExporting={isExporting}
          isImporting={isImportPending}
          onConfigChange={updateConfig}
          onExportPdf={handleExportPdf}
          onImport={importSheet}
          onLogoChange={updateLogo}
          onResetMockData={resetMockData}
          onSheetUrlChange={setSheetUrl}
          onZoomChange={setZoom}
          sheetUrl={sheetUrl}
          status={status}
          zoom={zoom}
        />
        <DocumentPreview config={document.config} pages={pages} plans={document.plans} zoom={zoom} />
      </div>
    </main>
  );
}
