import { getStaff } from './actions';
import StaffClientPage from './staff-client';

export default async function StaffPage() {
    const staff = await getStaff();
    return <StaffClientPage initialStaff={staff} />;
}
