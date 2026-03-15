import { FeeScheduleDocument } from "@/lib/types";

const defaultLogo = `
<svg width="420" height="100" viewBox="0 0 420 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="16" width="37" height="37" rx="8" fill="#1496DB"/>
  <path d="M22 27C25.866 27 29 30.134 29 34C29 37.866 25.866 41 22 41C18.134 41 15 37.866 15 34C15 30.134 18.134 27 22 27Z" fill="white"/>
  <path d="M18 43C22.4183 43 26 46.5817 26 51V53H18C15.7909 53 14 51.2091 14 49V47C14 44.7909 15.7909 43 18 43Z" fill="white"/>
  <path d="M56 31.5H126.12V38.34H73.84V45.36H118.74V51.9H73.84V68H56V31.5Z" fill="#0A5BA8"/>
  <path d="M136.2 68V40.86H153.12V68H136.2ZM144.66 37.74C141.06 37.74 138.24 35.1 138.24 31.92C138.24 28.74 141.06 26.1 144.66 26.1C148.26 26.1 151.08 28.68 151.08 31.92C151.08 35.16 148.26 37.74 144.66 37.74Z" fill="#0A5BA8"/>
  <path d="M163.24 68V40.86H179.5V45.18C181.72 42.12 186.04 39.84 191.14 39.84C199.24 39.84 204.7 45.36 204.7 54.18V68H187.78V56.82C187.78 53.1 185.92 50.82 182.68 50.82C179.38 50.82 177.22 53.1 177.22 56.82V68H163.24Z" fill="#0A5BA8"/>
  <path d="M221.938 68.96C212.398 68.96 205.738 62.96 205.738 54.42C205.738 45.88 212.518 39.84 222.418 39.84C228.358 39.84 233.338 42 236.098 45.78L226.738 52.2C225.778 50.64 224.038 49.74 222.238 49.74C219.178 49.74 216.838 51.84 216.838 54.42C216.838 57 219.178 59.1 222.238 59.1C224.098 59.1 225.838 58.2 226.738 56.64L236.098 63.06C233.338 66.84 228.298 68.96 221.938 68.96Z" fill="#0A5BA8"/>
  <path d="M252.216 68.96C242.136 68.96 235.176 62.96 235.176 54.42C235.176 45.88 242.256 39.84 251.616 39.84C260.916 39.84 267.216 45.48 267.216 54V57.6H248.376C249.336 60.06 251.736 61.68 255.216 61.68C258.276 61.68 260.856 60.84 262.836 59.16L267.876 64.62C264.696 67.38 259.776 68.96 252.216 68.96ZM248.196 51.96H255.456C255.216 49.08 253.176 47.28 251.616 47.28C249.816 47.28 248.556 48.72 248.196 51.96Z" fill="#0A5BA8"/>
</svg>
`;

export const defaultDocument: FeeScheduleDocument = {
  config: {
    title: "Subscriber Fee Schedule",
    topDisclaimer:
      'This fee schedule is exclusive to services provided by dental offices participating in DSO Plan(s). "Subscriber Savings" is defined as the percentage discount on a participating office\'s usual and customary fees normally charged to uninsured, self-pay patients. Unless stated otherwise in this fee schedule, plan discounts are not applicable to services carried out by a dental specialist or dental hygiene products. Member savings and plan incentives are specifically for participating dental offices.',
    bottomDisclaimer:
      "This is NOT INSURANCE, but rather a licensed dental savings plan offered through your local dental office. Members in good standing with their annual membership fee are eligible to receive transparent, member-only discounts from the normal retail fees that participating offices typically charge self-pay patients for dental services rendered. Members are obligated to pay for all dental services but will receive a discount on services rendered by participating dental providers.",
    discountBannerText: "20% OFF MOST OTHER DENTAL SERVICES",
    headerRowColor: "#0A4F8F",
    categoryRowColor: "#EAF4FB",
    discountBannerColor: "#0A4F8F",
    logoDataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(defaultLogo)}`,
  },
  plans: [
    { id: "adult", name: "Adult Plan" },
    { id: "child", name: "Child Plan" },
    { id: "perio", name: "Perio Plan" },
    { id: "loyalty", name: "Loyalty Plan" },
  ],
  items: [
    {
      id: "1",
      category: "Preventive & Diagnostic",
      cptCode: "D0120",
      description: "Periodic Exam",
      values: { adult: "$75", child: "No Charge x 2", perio: "No Charge x 2", loyalty: "No Charge x 2" },
    },
    {
      id: "2",
      category: "Preventive & Diagnostic",
      cptCode: "D1110",
      description: "Adult Cleaning",
      values: { adult: "$99", child: "No Charge x 2", perio: "--", loyalty: "--" },
    },
    {
      id: "3",
      category: "Preventive & Diagnostic",
      cptCode: "D1120",
      description: "Child Cleaning",
      values: { adult: "$75", child: "--", perio: "No Charge x 2", loyalty: "--" },
    },
    {
      id: "4",
      category: "Preventive & Diagnostic",
      cptCode: "D0210",
      description: "Full Mouth X-Rays",
      values: { adult: "No Charge x 1", child: "No Charge", perio: "No Charge", loyalty: "No Charge" },
    },
    {
      id: "5",
      category: "Preventive & Diagnostic",
      cptCode: "D0140",
      description: "Emergency Exam",
      values: { adult: "No Charge x 1", child: "No Charge", perio: "No Charge", loyalty: "No Charge" },
    },
    {
      id: "6",
      category: "Restorative",
      cptCode: "D2391",
      description: "Filling - 1 Surface, Posterior",
      values: { adult: "54% off", child: "54% off", perio: "54% off", loyalty: "54% off" },
    },
    {
      id: "7",
      category: "Restorative",
      cptCode: "D2392",
      description: "Filling - 2 Surface, Posterior",
      values: { adult: "64% off", child: "64% off", perio: "64% off", loyalty: "64% off" },
    },
    {
      id: "8",
      category: "Endodontics",
      cptCode: "D3310",
      description: "Root Canal, Anterior",
      values: { adult: "41% off", child: "41% off", perio: "41% off", loyalty: "41% off" },
    },
    {
      id: "9",
      category: "Periodontics",
      cptCode: "D4910",
      description: "Periodontal Maintenance",
      values: { adult: "63% off", child: "63% off", perio: "--", loyalty: "No Charge x 3" },
    },
    {
      id: "10",
      category: "Implants",
      cptCode: "D6010",
      description: "Surgical placement of an endosteal implant",
      values: { adult: "44% off", child: "44% off", perio: "44% off", loyalty: "44% off" },
    },
    {
      id: "11",
      category: "Implants",
      cptCode: "D6058",
      description: "Abutment supported porcelain crown",
      values: { adult: "39% off", child: "39% off", perio: "39% off", loyalty: "39% off" },
    },
    {
      id: "12",
      category: "Oral and Maxillofacial Surgery",
      cptCode: "D7210",
      description: "Extraction, erupted tooth",
      values: { adult: "46% off", child: "46% off", perio: "46% off", loyalty: "46% off" },
    }
  ]
};
