import dynamic from 'next/dynamic';

const SispendikClientPage = dynamic(
    () => import('@/app/sispendik/client-page'),
    { ssr: false },
);

export default function Page() {
    return <SispendikClientPage />;
}
