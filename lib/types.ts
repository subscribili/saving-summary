export type Plan = {
  id: string;
  name: string;
};

export type FeeItem = {
  id: string;
  category: string;
  cptCode: string;
  description: string;
  values: Record<string, string>;
};

export type FeeScheduleConfig = {
  title: string;
  topDisclaimer: string;
  bottomDisclaimer: string;
  discountBannerText: string;
  headerRowColor: string;
  categoryRowColor: string;
  discountBannerColor: string;
  logoDataUrl: string | null;
};

export type FeeScheduleDocument = {
  config: FeeScheduleConfig;
  plans: Plan[];
  items: FeeItem[];
};

export type TableSegment = {
  category: string;
  items: FeeItem[];
};

export type DocumentPageModel = {
  index: number;
  showIntro: boolean;
  showTableHeader: boolean;
  segments: TableSegment[];
  showOutro: boolean;
};

export type ParsedSheetResult = {
  plans: Plan[];
  items: FeeItem[];
};
