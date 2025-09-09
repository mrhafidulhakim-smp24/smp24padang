import { getContactInfo } from '@/lib/data/contact';
import ContactForm from './form';

export default async function ContactAdminPage() {
    const contactInfo = await getContactInfo();

    return <ContactForm initialData={contactInfo} />;
}