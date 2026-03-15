import { DocumentPageModel, FeeItem, FeeScheduleDocument } from "@/lib/types";

const PAGE_HEIGHT = 2240;
const PAGE_WIDTH = 1600;
const PAGE_PADDING_X = 80;
const PAGE_PADDING_Y = 120;
const CONTENT_HEIGHT = PAGE_HEIGHT - PAGE_PADDING_Y * 2;

const INTRO_HEIGHT = 316;
const TABLE_HEADER_HEIGHT = 56;
const CATEGORY_HEIGHT = 56;
const ROW_HEIGHT = 56;
const OUTRO_HEIGHT = 232;

function groupItems(items: FeeItem[]) {
  return items.reduce<Map<string, FeeItem[]>>((accumulator, item) => {
    const existing = accumulator.get(item.category) ?? [];
    existing.push(item);
    accumulator.set(item.category, existing);
    return accumulator;
  }, new Map<string, FeeItem[]>());
}

function createPage(index: number, showIntro: boolean): DocumentPageModel {
  return {
    index,
    showIntro,
    showTableHeader: true,
    segments: [],
    showOutro: false,
  };
}

export function paginateDocument(document: FeeScheduleDocument): DocumentPageModel[] {
  const pages: DocumentPageModel[] = [];
  let page = createPage(0, true);
  let remaining = CONTENT_HEIGHT - INTRO_HEIGHT - TABLE_HEADER_HEIGHT;

  const grouped = groupItems(document.items);

  for (const [category, items] of grouped.entries()) {
    let itemIndex = 0;

    while (itemIndex < items.length) {
      const categoryMinimum = CATEGORY_HEIGHT + ROW_HEIGHT;

      if (remaining < categoryMinimum) {
        pages.push(page);
        page = createPage(pages.length, false);
        remaining = CONTENT_HEIGHT - TABLE_HEADER_HEIGHT;
      }

      const segmentItems: FeeItem[] = [];
      let segmentStarted = false;

      while (itemIndex < items.length) {
        const needed = (segmentStarted ? 0 : CATEGORY_HEIGHT) + ROW_HEIGHT;
        if (remaining < needed) {
          break;
        }

        if (!segmentStarted) {
          remaining -= CATEGORY_HEIGHT;
          segmentStarted = true;
        }

        remaining -= ROW_HEIGHT;
        segmentItems.push(items[itemIndex]);
        itemIndex += 1;
      }

      if (segmentItems.length === 0) {
        pages.push(page);
        page = createPage(pages.length, false);
        remaining = CONTENT_HEIGHT - TABLE_HEADER_HEIGHT;
        continue;
      }

      page.segments.push({
        category,
        items: segmentItems,
      });
    }
  }

  if (remaining < OUTRO_HEIGHT) {
    pages.push(page);
    page = createPage(pages.length, false);
  }

  page.showOutro = true;
  pages.push(page);

  return pages;
}

export function getPreviewScale(zoom: number) {
  return Number((zoom / 100).toFixed(2));
}

export const pageMetrics = {
  width: PAGE_WIDTH,
  height: PAGE_HEIGHT,
  paddingX: PAGE_PADDING_X,
  paddingY: PAGE_PADDING_Y,
};
