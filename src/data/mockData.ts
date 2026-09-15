import { ServiceItem } from '../types';

export const LOGO_URL = "/logo.png";

// Phone/WhatsApp numbers are NOT stored here.
// They are fetched live from Firestore (settings/business) via the admin panel
// and resolved at runtime through AppContext → openActionModal.
export const SERVICES: ServiceItem[] = [
  {
    id: 'spare-parts',
    title: 'Spare Parts',
    description: 'Genuine and certified aftermarket components sourced rapidly for all major vehicle models.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVZq5Ykcj8SGyKmuIg9d6iQkVO4bCyhACC2_j6gnS9vhJF0TrYGa5hmyxOTx0j4qMorhSL-zFQfElJvX55Ti3812y3_s2_Hymb2jZM2232MT8lFXPo0R_c5wNiklK78oG6YSFpCqM_WMdTYmvUa6eZw9k_YYEez0Y5SMM5928OLXo54A9H0ethXuXcdIeoIc3tYMIfjRr2xhesLK4b28QGZ3Pct_pOb5ExVasrjzKOkoCHnOvNKHssMA',
    type: 'inquiry'
  },
  {
    id: 'towing',
    title: 'Towing',
    description: '24/7 rapid response roadside assistance and secure vehicle transportation services.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnX-xjuKty2a555KCnJSRWu2OYuyjswvg5hGmf8Xb7cfzBnMY_QftqTbKJKk4d_CJCeCPImdHl6Jua4qT2NAGXcJo3lKRcM6dOkm_07lovSB4dkX6bv4O5YFV_1JsFGvNJICV7rktCnUtMz9k6nzsg0IYY5AlRKSbxEh2e7A4_ziNUzS62PRuowYTTGQp56QS2Xrl2-r52AbIxTnMlcGSpY0T6y15WZX8CcP1LoVbR2_TbUwc837TyAw',
    type: 'contact'
  },
  {
    id: 'repairing',
    title: 'Repairing',
    description: 'Expert diagnostics, routine maintenance, and complex mechanical repairs by certified technicians.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjvJNRKeoc8oktt5pDCBtvsX_yVJKEsPvNTnD8FJ8JLTJGmc-g6NeVR_xt-vBV_RSM2MrLxX7YnQvzprh3zAeiyVcxbysNuZ7ATaJrsN9P4ffZ_j5OSCE7iautm-UTkpiE2csV2iMfH-Lhc5r7LDzHVWH8-6N_bC8QlXOQZMajkcCqBh8mpOfRF5pmT3ElJJyjqapRrg4R9VDxLF2dpMQBeEEEdtyW3oVHJx6eRek3ZdgkhgyO08iC9w',
    type: 'contact'
  },
  {
    id: 'buy-vehicles',
    title: 'Buy Vehicles',
    description: 'Browse our curated inventory of thoroughly inspected, pre-owned, and new automobiles.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8YV2u6TWHBDNVTKR5LJogo-AuI0sBe70FLvXkEu-BkNBcSbG0szzHS9h_XfuS4rHGbgzklBkE2GYl5-A_7It3L_IiaIC7kEcFQg79io7A8R_yqjfBTmKNEsYPRuDIjVIJNHmnCyI0glWixxo0bygr2Zb_92awqk8ME_DmsR8cFvcUlDOZCEYKK4u0NjUXbwU8vbKgUSu79_AelfavcVc_ewEZsHlXN-TjUo5y_oeJjBHd17qk0OdnfQ',
    type: 'contact'
  },
  {
    id: 'sell-vehicles',
    title: 'Sell Vehicles',
    description: 'Get competitive, transparent valuations and instant offers for your current vehicle.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkwjyzErsPBE-R4xU0HzFBdvPJ8WEei_ty0lxwzkztzz1RQb1966LDa0kF1XT8xG71pLjpI8cHt-nAKNWRRggbJjdoENiP-hFmuVwK_aTp-_KXTr141ARdSt9pyjM-Bjz8JEmbo3H8aNouFE2Tw-FwjRiJ7AOmzs-3fAOw3BUYA0kVTJCEiR9iUPeM3mdkGsxFkZJuary8JW3vYYeFTg0SlzCwr3AkoYnOMnInjU6gRmp5zsdMTWZFsw',
    type: 'contact'
  },
  {
    id: 'other-services',
    title: 'Other Services',
    description: 'Custom modifications, detailing, insurance handling, and specialized automotive consultations.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMZi_Qx27a23FTEZLiJhRpA5vGp4twt-1t6waheib-Pn9aVjJc4jYkLoBB1K88cSsBFNq2mjkzx3ANGRLP8sRX65q4Uqrnz_AXRRCNbqjUWJ_gJ7CnNNxEx2E7VKpoAq12MKDRqh3K_ZkakKyicBIIEZtlAJf0ucerZ5emh5TlEcp4D5IeFamG7vk3lEwtqHjnvGtpfDTfEKvm_O6lXy8j7Jm3GrW3Bo4FmO7SB4mqebHz0-WZ8UlUFA',
    type: 'contact'
  }
];
