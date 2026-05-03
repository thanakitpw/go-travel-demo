import type { I18n } from '@/lib/i18n';

export type Faq = {
  id: string;
  question: I18n;
  answer: I18n;
};

export const faqs: Faq[] = [
  {
    id: 'q1',
    question: { th: 'ราคาทัวร์รวมอะไรบ้าง?', en: "What's included in the tour price?" },
    answer: {
      th: 'ราคารวมตั๋วเครื่องบิน โรงแรม อาหารตามรายการ รถนำเที่ยว และไกด์ภาษาไทย ส่วนค่าวีซ่า ทิปไกด์ และประกันการเดินทางส่วนบุคคลไม่รวม',
      en: 'Includes flights, hotel, listed meals, tour transport, and Thai-speaking guide. Excludes visa fee, guide tips, and personal travel insurance.',
    },
  },
  {
    id: 'q2',
    question: { th: 'จองทัวร์ต้องจ่ายมัดจำเท่าไหร่?', en: 'How much deposit is required to book?' },
    answer: {
      th: 'ต้องวางมัดจำ 50% เพื่อจองที่นั่ง ส่วนยอดที่เหลือจ่ายก่อนวันเดินทาง 30 วัน',
      en: 'A 50% deposit secures your booking. The remaining balance is due 30 days before departure.',
    },
  },
  {
    id: 'q3',
    question: { th: 'ขนาดกลุ่มต่ำสุดและสูงสุดเท่าไหร่?', en: 'What is the minimum and maximum group size?' },
    answer: {
      th: 'Join Group ออกเดินทางเริ่มต้น 4 ท่าน สูงสุด 29 ท่านต่อรอบ Private Group รับ 4-16 ท่าน',
      en: 'Join Group departs from 4 travelers up to 29 per departure. Private Group accepts 4-16 travelers.',
    },
  },
  {
    id: 'q4',
    question: { th: 'ยกเลิกแล้วได้เงินคืนไหม?', en: 'Can I cancel and get a refund?' },
    answer: {
      th: 'ยกเลิกก่อนเดินทาง 45 วันคืนเต็มจำนวน 30-44 วันคืน 50% น้อยกว่า 30 วันไม่คืนเงิน',
      en: 'Cancel 45+ days before: full refund. 30-44 days: 50% refund. Less than 30 days: no refund.',
    },
  },
  {
    id: 'q5',
    question: { th: 'มีบริการเช่ารถพร้อมคนขับไหม?', en: 'Do you offer car + driver rental?' },
    answer: {
      th: 'มีครับ เลือกขนาดได้ตั้งแต่ 4-16 ที่นั่ง ราคาเริ่มต้น 2,500 บาท/วัน ดูรายละเอียดที่หน้า "เช่ารถ + คนขับ"',
      en: 'Yes — choose from 4 to 16-seat vehicles, starting at THB 2,500/day. See the "Car + Driver" page for details.',
    },
  },
  {
    id: 'q6',
    question: { th: 'รับชำระเงินแบบไหนบ้าง?', en: 'What payment methods do you accept?' },
    answer: {
      th: 'รับชำระผ่าน QR PromptPay บัตรเครดิต และโอนผ่านธนาคารทุกแห่ง',
      en: 'We accept QR PromptPay, credit card, and bank transfer.',
    },
  },
];
