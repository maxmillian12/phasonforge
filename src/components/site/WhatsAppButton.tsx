import { MessageCircle } from "lucide-react";
import { SITE } from "@/lib/site";

export function WhatsAppButton() {
  const message = "Hello Phason Engineering, I'd like to enquire about your services.";
  const url = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <a
      href={url}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full grid place-items-center bg-[#25D366] text-white shadow-lg hover:scale-105 transition-transform"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
