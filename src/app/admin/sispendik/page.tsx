import { getAllKelas, getAllJenisSampah } from './actions';
import SispendikClient from './client-page';

export default async function SispendikAdminPage() {
    // Fetch initial data
    const [kelasResponse, jenisSampahResponse] = await Promise.all([
        getAllKelas(),
        getAllJenisSampah(),
    ]);

    const kelas = kelasResponse.data || [];
    const jenisSampah = jenisSampahResponse.data || [];

    if (kelasResponse.error || jenisSampahResponse.error) {
        return (
            <div className="p-4">
                <div className="rounded-md bg-destructive/15 p-3">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-5 w-5 text-destructive"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-destructive">
                                Error
                            </h3>
                            <div className="mt-2 text-sm text-destructive">
                                {kelasResponse.error ||
                                    jenisSampahResponse.error}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">
                    Bank Sampah Digital
                </h2>
                <p className="text-muted-foreground">
                    Kelola data sampah per kelas dan lihat statistik pengumpulan
                    sampah
                </p>
            </div>

            <SispendikClient kelas={kelas} jenisSampah={jenisSampah} />
        </div>
    );
}
