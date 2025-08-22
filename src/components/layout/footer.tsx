"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary/90 text-primary-foreground">
      <div className="container mx-auto grid grid-cols-1 gap-12 px-4 py-12 md:grid-cols-3">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.jpg" alt="SMPN 24 Padang Logo" width={40} height={40} className="h-8 w-auto rounded-full" />
            <span className="font-headline text-xl font-bold text-white">
              SMPN 24 Padang
            </span>
          </Link>
          <p className="text-primary-foreground/80">
            Membina Pikiran, Membentuk Masa Depan. Jelajahi dunia pembelajaran dan penemuan kami.
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="text-primary-foreground/80 transition-colors hover:text-white"><Facebook className="h-6 w-6" /></Link>
            <Link href="#" className="text-primary-foreground/80 transition-colors hover:text-white"><Twitter className="h-6 w-6" /></Link>
            <Link href="#" className="text-primary-foreground/80 transition-colors hover:text-white"><Instagram className="h-6 w-6" /></Link>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-headline text-lg font-semibold text-white">Hubungi Kami</h3>
          <ul className="space-y-2 text-primary-foreground/80">
            <li className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
              <span>Jalan Pendidikan 123, Padang, Indonesia</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 flex-shrink-0 text-accent" />
              <span>+62 123 456 7890</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 flex-shrink-0 text-accent" />
              <span>info@smpn24padang.sch.id</span>
            </li>
          </ul>
        </div>

        <div className="overflow-hidden rounded-lg">
           <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127658.42323933454!2d100.30403372938502!3d-0.934582235948764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b942e2b117bb%3A0xb8468cb5c3b84a8!2sPadang%2C%20Padang%20City%2C%20West%20Sumatra!5e0!3m2!1sen!2sid!4v1683808332992!5m2!1sen!2sid"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Peta Lokasi Sekolah"
           ></iframe>
        </div>
      </div>
      <div className="bg-primary py-4">
        <div className="container mx-auto px-4 text-center text-sm text-primary-foreground/70">
          <p>© {currentYear} SMPN 24 Padang. Hak Cipta Dilindungi Undang-Undang.</p>
        </div>
      </div>
    </footer>
  );
}
