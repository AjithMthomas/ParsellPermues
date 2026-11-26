import { Plus, ShoppingBag, Truck } from "lucide-react";
import { site } from "@/lib/site";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

const STEPS = [
  { icon: ShoppingBag, t: "Fill your bag", d: "Pick a fragrance and a size. Add as many as you like, or the His & Hers Duo." },
  { icon: WhatsAppIcon, t: "Send it on WhatsApp", d: "One tap opens a chat with every item and the total already written. Send it as it is." },
  { icon: Truck, t: "We confirm and deliver", d: "We reply in the same chat with availability and delivery details, then ship it to you." },
];

const FAQ = [
  { q: "How do I place an order?", a: "Add fragrances to your bag and press Place order on WhatsApp. The message is written for you; you only send it. We confirm the order and delivery in that chat." },
  { q: "Do you deliver across India?", a: "Yes. Tell us your city in the chat and we confirm the delivery details with your order." },
  { q: "Which size should I choose?", a: `The 8 ml trio (${"₹899"}) is three small bottles of one fragrance, good for trying or travelling. 30 ml (₹999) is an everyday size, 50 ml (₹1,199) a signature size, and 100 ml (₹1,599) the best value per ml.` },
  { q: "Are these for men or for women?", a: "Each fragrance is marked For Her, For Him or For Everyone to help you choose, but wear what you love. Pura Elin Lush and Pura Santal are made to be shared." },
  { q: "Can I ask before I buy?", a: `Of course. Message us on WhatsApp at ${site.whatsappDisplay} or email ${site.email} and we will help you choose.` },
];

export function OrderFaq() {
  return (
    <section className="section bg-sand" id="order" aria-labelledby="order-title">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow rule">How to order</p>
          <h2 id="order-title" className="display h2 m-0">
            Three steps, <span className="script">one message</span>
          </h2>
        </div>
        <ol className="steps list-none p-0 m-0">
          {STEPS.map((s, i) => (
            <li key={s.t} className="step">
              <div className="flex items-center justify-between">
                <s.icon size={28} />
                <span className="display text-[34px] text-gold">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="display text-[24px] font-normal mt-5 mb-2">{s.t}</h3>
              <p className="m-0 text-ink-2">{s.d}</p>
            </li>
          ))}
        </ol>
        <div className="faq mt-16 max-w-[880px] mx-auto" id="faq">
          <h3 className="display h3 mb-6 text-center">Questions</h3>
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>
                {f.q} <Plus />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
