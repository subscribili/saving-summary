import { DocumentPage } from "@/components/document-page";
import { getPreviewScale, pageMetrics } from "@/lib/pagination";
import { DocumentPageModel, FeeScheduleConfig, Plan } from "@/lib/types";

type DocumentPreviewProps = {
  config: FeeScheduleConfig;
  plans: Plan[];
  pages: DocumentPageModel[];
  zoom: number;
};

export function DocumentPreview({ config, plans, pages, zoom }: DocumentPreviewProps) {
  const scale = getPreviewScale(zoom);
  const scaledWidth = pageMetrics.width * scale;
  const scaledHeight = pageMetrics.height * scale;

  return (
    <section className="relative flex-1 overflow-auto rounded-[32px] border border-white/70 bg-[#dfe8f1]/70 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] print:overflow-visible print:rounded-none print:border-0 print:bg-white print:p-0 print:shadow-none">
      <div className="mb-5 flex items-center justify-between px-2 print:hidden">
        <div>
          <p className="font-display text-xs font-semibold uppercase tracking-[0.24em] text-sky-800">Document preview</p>
          <h2 className="font-display text-xl font-semibold tracking-[-0.04em] text-slate-900">Fixed artboards with stable pagination</h2>
        </div>
        <p className="rounded-full bg-white/90 px-4 py-2 text-sm text-slate-600 shadow-sm">
          {pages.length} page{pages.length === 1 ? "" : "s"}
        </p>
      </div>
      <div className="flex flex-col items-center gap-8 print:block">
        {pages.map((page) => (
          <div className="relative print:mb-0" key={page.index} style={{ width: scaledWidth, height: scaledHeight }}>
            <div
              className="origin-top-left shadow-[0_30px_90px_rgba(20,35,66,0.24)] print:shadow-none"
              style={{ transform: `scale(${scale})`, width: pageMetrics.width, height: pageMetrics.height }}
            >
              <DocumentPage config={config} page={page} plans={plans} />
            </div>
            <div className="absolute -left-2 -top-2 rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white print:hidden">
              Page {page.index + 1}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
