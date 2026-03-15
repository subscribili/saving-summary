import Image from "next/image";
import { pageMetrics } from "@/lib/pagination";
import { DocumentPageModel, FeeScheduleConfig, Plan } from "@/lib/types";

type DocumentPageProps = {
  config: FeeScheduleConfig;
  plans: Plan[];
  page: DocumentPageModel;
  exportTarget?: boolean;
};

const CELL_BORDER_COLOR = "#E4EAF1";
const CELL_BORDER_WIDTH = "0.75px";

function LogoHeader({ logoDataUrl }: { logoDataUrl: string | null }) {
  if (!logoDataUrl) {
    return <div className="h-[64px]" />;
  }

  return (
    <div className="flex h-[64px] items-center">
      <Image
        alt="Brand logo"
        className="max-h-[64px] w-auto object-contain object-left"
        height={64}
        src={logoDataUrl}
        unoptimized
        width={420}
      />
    </div>
  );
}

function DisclaimerBlock({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <p className={`font-display text-justify text-[20px] font-normal leading-[24px] tracking-[-0.03em] text-[#4A5462] ${className ?? ""}`}>
      {content}
    </p>
  );
}

function PoweredBySubscribiliMark() {
  return (
    <Image
      alt="Powered by Subscribili"
      className="max-h-[48px] w-auto"
      height={48}
      src="/poweredby-subscribili-logo.png"
      unoptimized
      width={214}
    />
  );
}

function FeeScheduleTable({
  page,
  plans,
  config,
}: {
  page: DocumentPageModel;
  plans: Plan[];
  config: FeeScheduleConfig;
}) {
  const columns = `160px minmax(0,1fr) repeat(${plans.length}, 160px)`;
  const hasTableContent = page.segments.some((segment) => segment.items.length > 0);

  if (!hasTableContent) {
    return null;
  }

  return (
    <div className="overflow-hidden border-l" style={{ borderColor: CELL_BORDER_COLOR, borderWidth: CELL_BORDER_WIDTH }}>
      <div className="grid min-h-14" style={{ gridTemplateColumns: columns }}>
        <div
          className="font-display flex items-center border-b border-r px-5 text-[16px] font-normal leading-[22px] tracking-[-0.04em] text-white"
          style={{ backgroundColor: config.headerRowColor, borderColor: "rgba(255,255,255,0.24)", borderWidth: CELL_BORDER_WIDTH }}
        >
          CPT Code
        </div>
        <div
          className="font-display flex items-center border-b border-r px-5 text-[16px] font-normal leading-[22px] tracking-[-0.04em] text-white"
          style={{ backgroundColor: config.headerRowColor, borderColor: "rgba(255,255,255,0.24)", borderWidth: CELL_BORDER_WIDTH }}
        >
          Procedure Description
        </div>
        {plans.map((plan) => (
          <div
            className="font-display flex items-center justify-center border-b border-r px-5 text-center text-[16px] font-normal leading-[22px] tracking-[-0.04em] text-white"
            key={plan.id}
            style={{ backgroundColor: config.headerRowColor, borderColor: "rgba(255,255,255,0.24)", borderWidth: CELL_BORDER_WIDTH }}
          >
            {plan.name}
          </div>
        ))}
      </div>
      {page.segments.map((segment, index) => (
        <div key={`${segment.category}-${index}`}>
          <div
            className="font-display flex min-h-14 items-center border-b border-r px-5 text-[16px] font-medium leading-[20px] tracking-[-0.02em] text-[#25272C]"
            style={{ backgroundColor: config.categoryRowColor, borderColor: CELL_BORDER_COLOR, borderWidth: CELL_BORDER_WIDTH }}
          >
            {segment.category}
          </div>
          {segment.items.map((item) => (
            <div className="grid min-h-14" key={item.id} style={{ gridTemplateColumns: columns }}>
              <div
                className="font-display flex items-center border-b border-r bg-white px-5 text-[16px] font-normal leading-[22px] tracking-[-0.04em] text-[#25272C]"
                style={{ borderColor: CELL_BORDER_COLOR, borderWidth: CELL_BORDER_WIDTH }}
              >
                {item.cptCode}
              </div>
              <div
                className="font-display flex items-center border-b border-r bg-white px-5 text-[16px] font-normal leading-[22px] tracking-[-0.04em] text-[#25272C]"
                style={{ borderColor: CELL_BORDER_COLOR, borderWidth: CELL_BORDER_WIDTH }}
              >
                {item.description}
              </div>
              {plans.map((plan) => (
                <div
                  className="font-display flex items-center justify-center border-b border-r bg-white px-5 text-center text-[16px] font-normal leading-[22px] tracking-[-0.04em] text-[#25272C]"
                  key={plan.id}
                  style={{ borderColor: CELL_BORDER_COLOR, borderWidth: CELL_BORDER_WIDTH }}
                >
                  {item.values[plan.id] ?? "--"}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function DiscountBanner({ color, text }: { color: string; text: string }) {
  return (
    <div
      className="font-display flex min-h-14 items-center justify-center px-8 text-center text-[18px] font-medium leading-[22px] tracking-[-0.04em] text-white"
      style={{ backgroundColor: color }}
    >
      {text}
    </div>
  );
}

export function DocumentPage({ config, plans, page, exportTarget = false }: DocumentPageProps) {
  return (
    <article
      className="relative overflow-hidden bg-white print:mb-0 print:break-after-page"
      data-document-page="true"
      data-export-page={exportTarget ? "true" : undefined}
      style={{
        width: pageMetrics.width,
        height: pageMetrics.height,
        padding: `${pageMetrics.paddingY}px ${pageMetrics.paddingX}px`,
      }}
    >
      <div className="flex flex-col">
        {page.showIntro ? (
          <div className="mb-12 flex flex-col gap-16">
            <LogoHeader logoDataUrl={config.logoDataUrl} />
            <div className="space-y-4">
              <h1 className="font-display text-left text-[36px] font-medium leading-[40px] tracking-[-0.04em] text-[#22211F]">
                {config.title}
              </h1>
              <DisclaimerBlock content={config.topDisclaimer} />
            </div>
          </div>
        ) : null}

        <FeeScheduleTable config={config} page={page} plans={plans} />

        {page.showOutro ? (
          <div className="mt-10 space-y-8">
            <DiscountBanner color={config.discountBannerColor} text={config.discountBannerText} />
            <DisclaimerBlock content={config.bottomDisclaimer} />
            <div className="flex justify-end">
              <PoweredBySubscribiliMark />
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
