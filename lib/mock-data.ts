import { FeeScheduleDocument } from "@/lib/types";

export const DEFAULT_LOGO_PATH = "/dummy-logo.png";

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
    logoDataUrl: DEFAULT_LOGO_PATH,
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
