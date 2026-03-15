import { FeeItem, ParsedSheetResult, Plan } from "@/lib/types";

const GOOGLE_SHEET_PATTERN = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;

function sanitizeId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function normalizeHeader(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, " ");
}

function isCodeHeader(value: string) {
  const normalized = normalizeHeader(value);
  return normalized === "cpt code" || normalized === "procedure code" || normalized === "cpt";
}

function isDescriptionHeader(value: string) {
  const normalized = normalizeHeader(value);
  return normalized === "description" || normalized === "procedure description";
}

function isCategoryHeader(value: string) {
  return normalizeHeader(value) === "category";
}

function isEmptyCell(value: string | undefined) {
  return !value || value.trim().length === 0;
}

export function buildGoogleSheetCsvUrl(input: string) {
  const url = new URL(input);
  const match = url.pathname.match(GOOGLE_SHEET_PATTERN);

  if (!match) {
    throw new Error("Invalid Google Sheet URL.");
  }

  const spreadsheetId = match[1];
  const gid = url.searchParams.get("gid") ?? "0";

  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
}

export function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let inQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const current = csv[index];
    const next = csv[index + 1];

    if (current === '"') {
      if (inQuotes && next === '"') {
        value += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (current === "," && !inQuotes) {
      row.push(value.trim());
      value = "";
      continue;
    }

    if ((current === "\n" || current === "\r") && !inQuotes) {
      if (current === "\r" && next === "\n") {
        index += 1;
      }

      row.push(value.trim());
      if (row.some((cell) => cell.length > 0)) {
        rows.push(row);
      }
      row = [];
      value = "";
      continue;
    }

    value += current;
  }

  row.push(value.trim());
  if (row.some((cell) => cell.length > 0)) {
    rows.push(row);
  }

  return rows;
}

export function mapRowsToDocument(rows: string[][]): ParsedSheetResult {
  const [header, ...body] = rows;

  if (!header || header.length < 3) {
    throw new Error("Sheet must include procedure code, description, and at least one plan column.");
  }

  const explicitCategoryMode = isCategoryHeader(header[0]) && isCodeHeader(header[1]) && isDescriptionHeader(header[2]);
  const implicitCategoryMode = isCodeHeader(header[0]) && isDescriptionHeader(header[1]);

  if (!explicitCategoryMode && !implicitCategoryMode) {
    throw new Error(
      "Expected either Category | CPT Code | Description | Plan... or CPT Code | Procedure Description | Plan...",
    );
  }

  const planHeaders = explicitCategoryMode ? header.slice(3) : header.slice(2);

  if (planHeaders.length === 0) {
    throw new Error("Sheet must include at least one plan column.");
  }

  const plans: Plan[] = planHeaders.map((name, index) => ({
    id: sanitizeId(name || `plan-${index + 1}`),
    name: name || `Plan ${index + 1}`,
  }));

  const items: FeeItem[] = [];
  let currentCategory = "Uncategorized";

  body.forEach((cells, index) => {
    if (explicitCategoryMode) {
      const [category, cptCode, description, ...values] = cells;

      if (isEmptyCell(cptCode) && isEmptyCell(description) && values.every(isEmptyCell)) {
        return;
      }

      const mappedValues = plans.reduce<Record<string, string>>((accumulator, plan, planIndex) => {
        accumulator[plan.id] = values[planIndex] || "--";
        return accumulator;
      }, {});

      items.push({
        id: `${sanitizeId(category || currentCategory)}-${sanitizeId(cptCode || `row-${index}`)}-${index}`,
        category: category || currentCategory,
        cptCode: cptCode || "--",
        description: description || "Untitled procedure",
        values: mappedValues,
      });

      return;
    }

    const [firstCell, description, ...values] = cells;
    const isCategoryRow = !isEmptyCell(firstCell) && isEmptyCell(description) && values.every(isEmptyCell);

    if (isCategoryRow) {
      currentCategory = firstCell;
      return;
    }

    if (isEmptyCell(firstCell) && isEmptyCell(description) && values.every(isEmptyCell)) {
      return;
    }

    const mappedValues = plans.reduce<Record<string, string>>((accumulator, plan, planIndex) => {
      accumulator[plan.id] = values[planIndex] || "--";
      return accumulator;
    }, {});

    items.push({
      id: `${sanitizeId(currentCategory)}-${sanitizeId(firstCell || `row-${index}`)}-${index}`,
      category: currentCategory,
      cptCode: firstCell || "--",
      description: description || "Untitled procedure",
      values: mappedValues,
    });
  });

  return { plans, items };
}
