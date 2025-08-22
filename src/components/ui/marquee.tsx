import { Badge } from "@/components/ui/badge";

interface MarqueeItem {
  type: 'Berita' | 'Prestasi' | 'Pengumuman';
  text: string;
}

interface MarqueeProps {
  items: MarqueeItem[];
}

export function Marquee({ items }: MarqueeProps) {
  const marqueeContent = items.map((item, index) => (
    <span key={index} className="mx-8 text-sm text-foreground">
      <Badge 
        variant={item.type === 'Prestasi' ? 'default' : 'secondary'} 
        className={item.type === 'Prestasi' ? 'bg-primary text-primary-foreground' : ''}
      >
        {item.type}
      </Badge>
      <span className="ml-2">{item.text}</span>
    </span>
  ));

  return (
    <div className="relative flex w-full overflow-x-hidden bg-accent/10 py-3 border-y border-accent/20">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        {marqueeContent}
      </div>
      <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center py-3">
        {marqueeContent}
      </div>
    </div>
  );
}
