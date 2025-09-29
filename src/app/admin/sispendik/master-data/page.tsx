import { getAllJenisSampah } from '../actions';
import MasterDataClient from './client-page';

export default async function MasterDataPage() {
    const { data = [], error } = await getAllJenisSampah();

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Convert string hargaPerKg to number for the client component
    const convertedData = data.map((item) => ({
        ...item,
        hargaPerKg: parseFloat(item.hargaPerKg),
    }));

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">
                    Master Data Sampah
                </h2>
                <p className="text-muted-foreground">
                    Kelola jenis sampah dan harga per kilogram
                </p>
            </div>

            <MasterDataClient initialData={convertedData} />
        </div>
    );
}
