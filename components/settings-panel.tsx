"use client";

import Image from "next/image";
import { ChangeEvent, ReactNode, useId } from "react";
import { FeeScheduleConfig } from "@/lib/types";

type SettingsPanelProps = {
  config: FeeScheduleConfig;
  sheetUrl: string;
  zoom: number;
  status: string;
  isImporting: boolean;
  isExporting: boolean;
  onSheetUrlChange: (value: string) => void;
  onImport: () => void;
  onResetMockData: () => void;
  onExportPdf: () => void;
  onZoomChange: (value: number) => void;
  onLogoChange: (file: File | null) => void;
  onConfigChange: <K extends keyof FeeScheduleConfig>(key: K, value: FeeScheduleConfig[K]) => void;
};

const TOKENS = {
  borderPrimary: "#D7DBE0",
  borderSecondary: "#EDEEF1",
  textPrimary: "#25272C",
  textSecondary: "#6B727A",
  textTertiary: "#7C8694",
  brand: "#1794E1",
  brandDark: "#0A4F8F",
  panelDark: "#0A233A",
  subtleBg: "#FAFAFA",
};

function SectionIntro({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-1 border-b pb-3" style={{ borderColor: TOKENS.borderPrimary }}>
      <h2 className="font-display text-[16px] font-medium leading-5 tracking-[-0.64px]" style={{ color: TOKENS.textPrimary }}>
        {title}
      </h2>
      <p className="text-[14px] font-normal leading-5 tracking-[-0.56px]" style={{ color: TOKENS.textSecondary }}>
        {description}
      </p>
    </div>
  );
}

function FieldLabel({ children, size = "md" }: { children: ReactNode; size?: "sm" | "md" }) {
  return (
    <span
      className={size === "sm"
        ? "text-[12px] font-normal leading-4 tracking-[-0.48px]"
        : "text-[14px] font-normal leading-5 tracking-[-0.56px]"}
      style={{ color: TOKENS.textPrimary }}
    >
      {children}
    </span>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  labelSize = "md",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  labelSize?: "sm" | "md";
}) {
  return (
    <label className="flex flex-col gap-2">
      <FieldLabel size={labelSize}>{label}</FieldLabel>
      <div className="rounded-xl border bg-white px-4 py-3" style={{ borderColor: TOKENS.borderSecondary }}>
        <input
          className="w-full border-0 bg-transparent p-0 font-display text-[14px] font-normal leading-5 tracking-[-0.56px] outline-none placeholder:text-[#7C8694]"
          placeholder={placeholder}
          style={{ color: TOKENS.textPrimary }}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 5,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="flex flex-col gap-2">
      <FieldLabel>{label}</FieldLabel>
      <div className="rounded-xl border bg-white px-4 py-3" style={{ borderColor: TOKENS.borderSecondary }}>
        <textarea
          className="min-h-[188px] w-full resize-none border-0 bg-transparent p-0 font-display text-[14px] font-normal leading-5 tracking-[-0.56px] outline-none"
          rows={rows}
          style={{ color: TOKENS.textSecondary }}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </label>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const inputId = useId();

  return (
    <label className="flex flex-col gap-2">
      <FieldLabel>{label}</FieldLabel>
      <div className="flex h-[52px] items-center gap-2 rounded-xl border bg-white px-4 py-3" style={{ borderColor: TOKENS.borderSecondary }}>
        <div className="relative h-6 w-6 overflow-hidden rounded-[4px] border" style={{ borderColor: TOKENS.borderSecondary }}>
          <div className="absolute inset-0 rounded-[4px]" style={{ backgroundColor: value }} />
          <input
            id={inputId}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            type="color"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
        <input
          className="min-w-0 flex-1 border-0 bg-transparent p-0 font-display text-[14px] font-normal uppercase leading-5 tracking-[-0.42px] outline-none"
          style={{ color: TOKENS.textPrimary }}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </label>
  );
}

function UploadField({
  label,
  logoDataUrl,
  onChange,
}: {
  label: string;
  logoDataUrl: string | null;
  onChange: (file: File | null) => void;
}) {
  const inputId = useId();
  const hasCustomLogo = Boolean(logoDataUrl && logoDataUrl.startsWith("data:"));

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.files?.[0] ?? null);
  }

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel>{label}</FieldLabel>
      <div className="rounded-xl border border-dashed bg-white" style={{ borderColor: TOKENS.borderPrimary }}>
        {hasCustomLogo ? (
          <div className="flex h-[140px] flex-col items-center justify-center gap-3 px-6 py-5 text-center">
            <div className="flex h-[72px] items-center justify-center">
              <Image
                alt="Uploaded brand logo"
                className="max-h-[72px] w-auto object-contain"
                height={72}
                src={logoDataUrl ?? ""}
                unoptimized
                width={240}
              />
            </div>
            <button
              className="text-[14px] font-normal leading-5 tracking-[-0.56px]"
              style={{ color: TOKENS.brand }}
              type="button"
              onClick={() => onChange(null)}
            >
              Remove brand mark
            </button>
          </div>
        ) : (
          <label className="flex h-[140px] cursor-pointer flex-col items-center justify-center gap-3 px-6 py-6 text-center" htmlFor={inputId}>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white" style={{ borderColor: TOKENS.borderPrimary, color: TOKENS.textTertiary }}>
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M8 17a4 4 0 0 1-.4-7.98A5 5 0 0 1 17 8a4 4 0 1 1 .76 7.93" />
                <path d="M12 12v9" />
                <path d="m8.5 15.5 3.5-3.5 3.5 3.5" />
              </svg>
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-[14px] font-normal leading-5 tracking-[-0.56px]" style={{ color: TOKENS.textSecondary }}>
                <span style={{ color: TOKENS.brand }}>Click to upload</span> or drag and drop
              </p>
              <p className="text-[12px] font-normal leading-4 tracking-[-0.48px]" style={{ color: TOKENS.textTertiary }}>
                Supports PNG or JPG (Max: 5MB)
              </p>
            </div>
          </label>
        )}
        <input id={inputId} className="hidden" type="file" accept="image/*" onChange={handleFileChange} />
      </div>
    </div>
  );
}

function SectionCard({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-lg border px-4 py-5" style={{ borderColor: TOKENS.borderSecondary, backgroundColor: TOKENS.subtleBg }}>
      {children}
    </section>
  );
}

export function SettingsPanel({
  config,
  sheetUrl,
  zoom,
  status,
  isImporting,
  isExporting,
  onSheetUrlChange,
  onImport,
  onResetMockData,
  onExportPdf,
  onZoomChange,
  onLogoChange,
  onConfigChange,
}: SettingsPanelProps) {
  return (
    <aside className="editor-scroll sticky top-6 h-[calc(100vh-3rem)] w-[480px] min-w-[480px] max-w-[480px] shrink-0 overflow-y-auto rounded-[8px] border bg-white p-[25px] shadow-[0_20px_50px_rgba(15,23,42,0.08)] print:hidden" style={{ borderColor: TOKENS.borderPrimary }}>
      <div className="flex w-full flex-col gap-8">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="text-[12px] font-medium uppercase leading-4 tracking-[-0.24px]" style={{ color: TOKENS.brandDark }}>Saving Summary Builder</p>
            <div className="flex flex-col gap-1">
              <h1 className="font-display text-[28px] font-medium leading-8 tracking-[-1.12px]" style={{ color: TOKENS.textPrimary }}>
                Branded Fee Schedule
              </h1>
              <p className="text-[14px] font-normal leading-5 tracking-[-0.56px]" style={{ color: TOKENS.textSecondary }}>
                Import a public Google Sheet, customise the document, then export a matching PDF.
              </p>
            </div>
          </div>
          <div className="h-px w-full" style={{ backgroundColor: TOKENS.borderPrimary }} />
        </div>

        <SectionCard>
          <div className="flex flex-col gap-5">
            <SectionIntro
              title="Import Sheet"
              description="Supports both category-first sheets and sheets with category divider rows like your reference file."
            />
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                <TextInput
                  label="Google Sheet URL"
                  labelSize="sm"
                  placeholder="Enter or Paste Sheet URL"
                  value={sheetUrl}
                  onChange={onSheetUrlChange}
                />
                <div className="grid grid-cols-2 gap-4">
                  <button
                    className="flex h-12 items-center justify-center rounded-xl px-5 py-3 font-display text-[16px] font-normal leading-5 tracking-[-0.64px] text-white transition hover:brightness-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ backgroundColor: TOKENS.brand }}
                    disabled={isImporting}
                    onClick={onImport}
                    type="button"
                  >
                    {isImporting ? "Importing..." : "Import Sheet"}
                  </button>
                  <button
                    className="flex h-12 items-center justify-center rounded-xl border bg-white px-5 py-3 font-display text-[16px] font-normal leading-5 tracking-[-0.64px] transition hover:bg-slate-50"
                    style={{ borderColor: TOKENS.borderSecondary, color: TOKENS.textPrimary }}
                    onClick={onResetMockData}
                    type="button"
                  >
                    Use Mock Data
                  </button>
                </div>
              </div>
              <p className="text-[12px] font-normal leading-4 tracking-[-0.48px]" style={{ color: TOKENS.textPrimary }}>
                {status}
              </p>
            </div>
          </div>
        </SectionCard>

        <section className="flex flex-col gap-6">
          <SectionIntro title="Branding" description="Adjust the document chrome, banner, and logo." />
          <div className="flex flex-col gap-5">
            <UploadField label="Upload Logo" logoDataUrl={config.logoDataUrl} onChange={onLogoChange} />
            <ColorInput
              label="Header Row Color"
              value={config.headerRowColor}
              onChange={(value) => onConfigChange("headerRowColor", value)}
            />
            <ColorInput
              label="Category Row Color"
              value={config.categoryRowColor}
              onChange={(value) => onConfigChange("categoryRowColor", value)}
            />
            <ColorInput
              label="Discount Banner Color"
              value={config.discountBannerColor}
              onChange={(value) => onConfigChange("discountBannerColor", value)}
            />
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <SectionIntro title="Content Text" description="These fields update the artboard preview immediately." />
          <div className="flex flex-col gap-5">
            <TextInput
              label="Document Title"
              placeholder="Enter title"
              value={config.title}
              onChange={(value) => onConfigChange("title", value)}
            />
            <TextInput
              label="Discount on Services Text"
              placeholder="Enter title"
              value={config.discountBannerText}
              onChange={(value) => onConfigChange("discountBannerText", value)}
            />
            <TextArea
              label="Disclaimer Text"
              value={config.topDisclaimer}
              onChange={(value) => onConfigChange("topDisclaimer", value)}
              rows={8}
            />
            <TextArea
              label="Subscribili Disclaimer Text"
              value={config.bottomDisclaimer}
              onChange={(value) => onConfigChange("bottomDisclaimer", value)}
              rows={8}
            />
          </div>
        </section>

        <section className="rounded-[8px] px-4 py-5 text-white" style={{ backgroundColor: TOKENS.panelDark }}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h2 className="font-display text-[16px] font-medium leading-5 tracking-[-0.64px]">Preview Controls</h2>
              <p className="text-[14px] font-normal leading-5 tracking-[-0.56px] text-white/80">
                Fixed pages stay at 1600 x 2240. PDF export captures the artboards directly instead of using print.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-3">
                <span className="block text-[14px] font-normal leading-5 tracking-[-0.56px] text-white">Zoom: {zoom}%</span>
                <input
                  className="h-5 w-full accent-[#16ADFF]"
                  type="range"
                  min={30}
                  max={80}
                  step={2}
                  value={zoom}
                  onChange={(event) => onZoomChange(Number(event.target.value))}
                />
              </label>
              <button
                className="flex h-12 w-full items-center justify-center rounded-xl bg-white px-5 py-3 font-display text-[16px] font-normal leading-5 tracking-[-0.64px] transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-300"
                style={{ color: TOKENS.textPrimary }}
                disabled={isExporting}
                onClick={onExportPdf}
                type="button"
              >
                {isExporting ? "Generating PDF..." : "Export PDF"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
}
