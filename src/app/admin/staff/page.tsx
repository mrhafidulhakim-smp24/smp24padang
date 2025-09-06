import { getStaff } from './actions';
import StaffClientPage from '@/components/admin/staff/staff-client';

export default async function StaffPage() {
    const staff = await getStaff();
    return <StaffClientPage initialStaff={staff} />;
}
