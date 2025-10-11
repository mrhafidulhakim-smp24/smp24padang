import dynamic from 'next/dynamic';
import SispendikSkeleton from './sispendik-skeleton';

const SispendikClientPage = dynamic(
    () => import('@/app/sispendik/client-page'),
    { 
        loading: () => <SispendikSkeleton />,
        ssr: false 
    },
);

export default function Page() {
    return <SispendikClientPage />;
}