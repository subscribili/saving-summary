import { FeeScheduleDocument } from "@/lib/types";

function sanitizeFileName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "saving-summary";
}

export async function exportDocumentPdf(doc: FeeScheduleDocument) {
  const response = await fetch("/api/export-pdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(doc),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? "Failed to export PDF.");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const fileName = `${sanitizeFileName(doc.config.title)}.pdf`;
  const link = window.document.createElement("a");
  link.href = url;
  link.download = fileName;
  window.document.body.appendChild(link);
  link.click();
  window.document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
