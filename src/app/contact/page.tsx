import type { Metadata } from 'next';
import ContactView from '@/components/contact/contact-view';
import { getContactInfo } from '@/lib/data/contact';

import FaqAccordion from '@/components/faq/faq-accordion';

export const metadata: Metadata = {
    title: 'Hubungi SMPN 24 Padang | Alamat, Telepon, Email & Peta Lokasi',
    description:
        'Dapatkan informasi kontak lengkap SMPN 24 Padang. Temukan alamat, nomor telepon, email, dan peta lokasi sekolah kami.',
};

export default async function ContactPage() {
    const contactInfo = await getContactInfo();
    return (
        <ContactView contactInfo={contactInfo} faqSection={<FaqAccordion />} />
    );
}
