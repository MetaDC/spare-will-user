import { ServiceItem, SparePart } from "../types";

// ---------------------------------------------------------------------------
// DUMMY INVENTORY — fallback shown when Firestore inventory is empty
// (development / testing). Remove or ignore once real data is in the database.
// ---------------------------------------------------------------------------
// export const DUMMY_INVENTORY: SparePart[] = [
//   { id: 'dummy-001', name: 'Oil Filter',              partNumber: 'OF-2341',      brand: 'Bosch',       category: 'Engine',     subcategory: 'Filters',     status: 'active', compatibleVehicles: 'Toyota, Honda, Nissan' },
//   { id: 'dummy-002', name: 'Air Filter',              partNumber: 'AF-5512',      brand: 'K&N',         category: 'Engine',     subcategory: 'Filters',     status: 'active', compatibleVehicles: 'Universal fit' },
//   { id: 'dummy-003', name: 'Fuel Filter',             partNumber: 'FF-8823',      brand: 'Denso',       category: 'Engine',     subcategory: 'Filters',     status: 'active', compatibleVehicles: 'Toyota Corolla, Yaris' },
//   { id: 'dummy-004', name: 'Cabin Air Filter',        partNumber: 'CAF-1109',     brand: 'Fram',        category: 'Cabin',      subcategory: 'Filters',     status: 'active', compatibleVehicles: 'Honda Civic, Accord' },
//   { id: 'dummy-005', name: 'Brake Pads Front',        partNumber: 'BP-F440',      brand: 'Brembo',      category: 'Brakes',     subcategory: 'Pads',        status: 'active', compatibleVehicles: 'Nissan Altima, Sentra' },
//   { id: 'dummy-006', name: 'Brake Pads Rear',         partNumber: 'BP-R220',      brand: 'Brembo',      category: 'Brakes',     subcategory: 'Pads',        status: 'active', compatibleVehicles: 'Toyota Camry, Avalon' },
//   { id: 'dummy-007', name: 'Brake Disc Rotor',        partNumber: 'DR-3306',      brand: 'ATE',         category: 'Brakes',     subcategory: 'Rotors',      status: 'active', compatibleVehicles: 'Honda CR-V, HR-V' },
//   { id: 'dummy-008', name: 'Brake Caliper',           partNumber: 'BC-7741',      brand: 'TRW',         category: 'Brakes',     subcategory: 'Calipers',    status: 'active', compatibleVehicles: 'Mitsubishi Lancer' },
//   { id: 'dummy-009', name: 'Spark Plugs Set of 4',    partNumber: 'SP-NGK-4',     brand: 'NGK',         category: 'Engine',     subcategory: 'Ignition',    status: 'active', compatibleVehicles: 'Universal 4-cylinder' },
//   { id: 'dummy-010', name: 'Timing Belt Kit',         partNumber: 'TB-KIT-HN',    brand: 'Gates',       category: 'Engine',     subcategory: 'Timing',      status: 'active', compatibleVehicles: 'Honda Jazz, Fit' },
//   { id: 'dummy-011', name: 'Alternator',              partNumber: 'ALT-9902',     brand: 'Denso',       category: 'Electrical', subcategory: 'Charging',    status: 'active', compatibleVehicles: 'Toyota Corolla 2005-2015' },
//   { id: 'dummy-012', name: 'Starter Motor',           partNumber: 'SM-7745',      brand: 'Bosch',       category: 'Electrical', subcategory: 'Starting',    status: 'active', compatibleVehicles: 'Nissan Sunny, Tiida' },
//   { id: 'dummy-013', name: 'Radiator',                partNumber: 'RAD-4421',     brand: 'Koyo',        category: 'Cooling',    subcategory: 'Radiator',    status: 'active', compatibleVehicles: 'Honda Civic 2006-2011' },
//   { id: 'dummy-014', name: 'Water Pump',              partNumber: 'WP-5531',      brand: 'Gates',       category: 'Cooling',    subcategory: 'Water Pump',  status: 'active', compatibleVehicles: 'Toyota Yaris, Vios' },
//   { id: 'dummy-015', name: 'Thermostat',              partNumber: 'TH-2281',      brand: 'Wahler',      category: 'Cooling',    subcategory: 'Thermostat',  status: 'active', compatibleVehicles: 'Mitsubishi Pajero' },
//   { id: 'dummy-016', name: 'Shock Absorber Front',    partNumber: 'SA-F990',      brand: 'Monroe',      category: 'Suspension', subcategory: 'Shocks',      status: 'active', compatibleVehicles: 'Toyota Hilux 2005-2015' },
//   { id: 'dummy-017', name: 'Shock Absorber Rear',     partNumber: 'SA-R880',      brand: 'KYB',         category: 'Suspension', subcategory: 'Shocks',      status: 'active', compatibleVehicles: 'Nissan Patrol Y61' },
//   { id: 'dummy-018', name: 'CV Joint Outer',          partNumber: 'CVJ-O3310',    brand: 'GKN',         category: 'Driveline',  subcategory: 'CV Joints',   status: 'active', compatibleVehicles: 'Honda Accord, Odyssey' },
//   { id: 'dummy-019', name: 'Serpentine Belt',         partNumber: 'SB-6PK1750',   brand: 'Continental', category: 'Engine',     subcategory: 'Belts',       status: 'active', compatibleVehicles: 'Universal' },
//   { id: 'dummy-020', name: 'Battery 60Ah',            partNumber: 'BAT-60AH-DIN', brand: 'Exide',       category: 'Electrical', subcategory: 'Battery',     status: 'active', compatibleVehicles: 'Universal' },
// ];

export const LOGO_URL = "/logo.png";

// Phone/WhatsApp numbers are NOT stored here.
// They are fetched live from Firestore (settings/business) via the admin panel
// and resolved at runtime through AppContext → openActionModal.
export const SERVICES: ServiceItem[] = [
  {
    id: "spare-parts",
    title: "Spare Parts",
    description:
      "Genuine and certified aftermarket components sourced rapidly for all major vehicle models.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBVZq5Ykcj8SGyKmuIg9d6iQkVO4bCyhACC2_j6gnS9vhJF0TrYGa5hmyxOTx0j4qMorhSL-zFQfElJvX55Ti3812y3_s2_Hymb2jZM2232MT8lFXPo0R_c5wNiklK78oG6YSFpCqM_WMdTYmvUa6eZw9k_YYEez0Y5SMM5928OLXo54A9H0ethXuXcdIeoIc3tYMIfjRr2xhesLK4b28QGZ3Pct_pOb5ExVasrjzKOkoCHnOvNKHssMA",
    type: "inquiry",
  },
  {
    id: "towing",
    title: "Towing",
    description:
      "24/7 rapid response roadside assistance and secure vehicle transportation services.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBnX-xjuKty2a555KCnJSRWu2OYuyjswvg5hGmf8Xb7cfzBnMY_QftqTbKJKk4d_CJCeCPImdHl6Jua4qT2NAGXcJo3lKRcM6dOkm_07lovSB4dkX6bv4O5YFV_1JsFGvNJICV7rktCnUtMz9k6nzsg0IYY5AlRKSbxEh2e7A4_ziNUzS62PRuowYTTGQp56QS2Xrl2-r52AbIxTnMlcGSpY0T6y15WZX8CcP1LoVbR2_TbUwc837TyAw",
    type: "contact",
  },
  {
    id: "repairing",
    title: "Repairing",
    description:
      "Expert diagnostics, routine maintenance, and complex mechanical repairs by certified technicians.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCjvJNRKeoc8oktt5pDCBtvsX_yVJKEsPvNTnD8FJ8JLTJGmc-g6NeVR_xt-vBV_RSM2MrLxX7YnQvzprh3zAeiyVcxbysNuZ7ATaJrsN9P4ffZ_j5OSCE7iautm-UTkpiE2csV2iMfH-Lhc5r7LDzHVWH8-6N_bC8QlXOQZMajkcCqBh8mpOfRF5pmT3ElJJyjqapRrg4R9VDxLF2dpMQBeEEEdtyW3oVHJx6eRek3ZdgkhgyO08iC9w",
    type: "contact",
  },
  {
    id: "buy-vehicles",
    title: "Buy Vehicles",
    description:
      "Browse our curated inventory of thoroughly inspected, pre-owned, and new automobiles.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD8YV2u6TWHBDNVTKR5LJogo-AuI0sBe70FLvXkEu-BkNBcSbG0szzHS9h_XfuS4rHGbgzklBkE2GYl5-A_7It3L_IiaIC7kEcFQg79io7A8R_yqjfBTmKNEsYPRuDIjVIJNHmnCyI0glWixxo0bygr2Zb_92awqk8ME_DmsR8cFvcUlDOZCEYKK4u0NjUXbwU8vbKgUSu79_AelfavcVc_ewEZsHlXN-TjUo5y_oeJjBHd17qk0OdnfQ",
    type: "contact",
  },
  {
    id: "sell-vehicles",
    title: "Sell Vehicles",
    description:
      "Get competitive, transparent valuations and instant offers for your current vehicle.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCkwjyzErsPBE-R4xU0HzFBdvPJ8WEei_ty0lxwzkztzz1RQb1966LDa0kF1XT8xG71pLjpI8cHt-nAKNWRRggbJjdoENiP-hFmuVwK_aTp-_KXTr141ARdSt9pyjM-Bjz8JEmbo3H8aNouFE2Tw-FwjRiJ7AOmzs-3fAOw3BUYA0kVTJCEiR9iUPeM3mdkGsxFkZJuary8JW3vYYeFTg0SlzCwr3AkoYnOMnInjU6gRmp5zsdMTWZFsw",
    type: "contact",
  },
  {
    id: "other-services",
    title: "Other Services",
    description:
      "Custom modifications, detailing, insurance handling, and specialized automotive consultations.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBMZi_Qx27a23FTEZLiJhRpA5vGp4twt-1t6waheib-Pn9aVjJc4jYkLoBB1K88cSsBFNq2mjkzx3ANGRLP8sRX65q4Uqrnz_AXRRCNbqjUWJ_gJ7CnNNxEx2E7VKpoAq12MKDRqh3K_ZkakKyicBIIEZtlAJf0ucerZ5emh5TlEcp4D5IeFamG7vk3lEwtqHjnvGtpfDTfEKvm_O6lXy8j7Jm3GrW3Bo4FmO7SB4mqebHz0-WZ8UlUFA",
    type: "contact",
  },
];
