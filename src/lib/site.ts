export const SITE = {
  name: "Phason Engineering Works Limited",
  shortName: "Phason Engineering",
  tagline: "Structures That Stand The Test Of Time",
  phone: "+255 767 071788",
  phoneRaw: "+255767071788",
  email: "phasonengineering@gmail.com",
  addressLines: [
    "Mezzanine Floor, Alfa Plaza",
    "Ada Estate Street, Chabruma Road",
    "P.O. Box 373, Dar es Salaam, Tanzania",
  ],
  whatsapp: "255767071788",
  social: {
    facebook: "#",
    instagram: "#",
    linkedin: "#",
  },
};

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/agricultural-supplies", label: "Supplies" },
  { to: "/blog", label: "Insights" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;
