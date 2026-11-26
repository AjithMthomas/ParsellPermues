import { Droplet, Sparkles, Truck } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

const ITEMS = [
  { icon: Droplet, t: "Eau de parfum in four sizes" },
  { icon: Sparkles, t: "Twelve fragrances, hers and his" },
  { icon: Truck, t: "Delivered across India" },
  { icon: WhatsAppIcon, t: "Order in one WhatsApp message" },
];

export function Trust() {
  return (
    <section className="trust" aria-label="Why Pura">
      <ul className="wrap">
        {ITEMS.map((i) => (
          <li key={i.t}>
            <i.icon size={26} />
            <span>{i.t}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
