import roadImg from "@/assets/project-road.jpg";
import apartmentsImg from "@/assets/project-apartments.jpg";
import culvertImg from "@/assets/project-culvert.jpg";
import officeImg from "@/assets/project-office.jpg";
import waterImg from "@/assets/project-water.jpg";
import equipmentImg from "@/assets/equipment.jpg";

export type Service = {
  slug: string;
  title: string;
  category: "Engineering" | "Supply";
  short: string;
  features: string[];
  icon: string;
};

export const SERVICES: Service[] = [
  {
    slug: "civil-engineering",
    title: "Civil Engineering",
    category: "Engineering",
    short:
      "Roads, bridges, drainage and structural solutions delivered to international standards.",
    features: [
      "Road construction and maintenance",
      "Bridge and culvert construction",
      "Water supply and drainage systems",
      "Structural engineering solutions",
    ],
    icon: "HardHat",
  },
  {
    slug: "construction-management",
    title: "Construction Management",
    category: "Engineering",
    short:
      "End-to-end oversight that keeps your project on budget, on schedule and on spec.",
    features: [
      "Project planning & scheduling",
      "Budget & cost control",
      "Quality assurance",
      "Risk mitigation",
    ],
    icon: "ClipboardCheck",
  },
  {
    slug: "structural-engineering",
    title: "Structural Engineering",
    category: "Engineering",
    short:
      "Residential, commercial and industrial buildings — design and build, refurbishment and fit-out.",
    features: [
      "Residential, commercial & industrial builds",
      "Renovation and refurbishment",
      "Interior fit-outs",
      "Design and build solutions",
    ],
    icon: "Building2",
  },
  {
    slug: "electrical-engineering",
    title: "Electrical Engineering",
    category: "Engineering",
    short:
      "Power systems, distribution and renewable energy installations across all sectors.",
    features: [
      "Electrical installations (residential / commercial / industrial)",
      "Power distribution and transmission",
      "Solar and renewable energy systems",
      "Maintenance and troubleshooting",
    ],
    icon: "Zap",
  },
  {
    slug: "sulphur-supply",
    title: "Sulphur & Industrial Products",
    category: "Supply",
    short:
      "Industrial and agricultural sulphur supplied in bulk with safe handling and logistics.",
    features: [
      "Industrial Sulphur supply",
      "Agricultural Sulphur products",
      "Bulk and customized orders",
      "Safe handling and delivery",
    ],
    icon: "FlaskConical",
  },
  {
    slug: "packaging-supply",
    title: "Duty Bags & Packaging",
    category: "Supply",
    short:
      "Heavy-duty sacks and customized packaging for agriculture, industry and distribution.",
    features: [
      "Duty bags and heavy-duty sacks",
      "Agricultural & industrial packaging",
      "Customized packaging solutions",
      "Bulk supply for wholesalers",
    ],
    icon: "Package",
  },
  {
    slug: "general-supply",
    title: "General Supply of Goods",
    category: "Supply",
    short:
      "Office, industrial and construction materials sourced and delivered with reliability.",
    features: [
      "Office supplies and consumables",
      "Industrial & construction materials",
      "Safety equipment & accessories",
      "Specialized procurement",
    ],
    icon: "Boxes",
  },
  {
    slug: "equipment-hire",
    title: "Equipment Hire & Transport",
    category: "Supply",
    short:
      "Heavy equipment rental and transport services for projects of any scale and duration.",
    features: [
      "Equipment hire (short & long term)",
      "Project & field transport",
      "Goods transportation",
      "Operator-led machinery",
    ],
    icon: "Truck",
  },
  {
    slug: "procurement-logistics",
    title: "Procurement & Logistics",
    category: "Supply",
    short:
      "Sourcing, distribution and supply chain coordination tailored to your operation.",
    features: [
      "Product sourcing & procurement",
      "Delivery & distribution management",
      "Supply chain coordination",
      "Inventory support",
    ],
    icon: "Workflow",
  },
];

export type Project = {
  slug: string;
  title: string;
  category: "Roads" | "Buildings" | "Water" | "Civil";
  location: string;
  year: number;
  image: string;
  description: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "kauzeni-mhanha-road",
    title: "Kauzeni–Mhanha Road & Culvert Works",
    category: "Roads",
    location: "Tanzania",
    year: 2024,
    image: roadImg,
    description:
      "Spot improvement of the Kauzeni–Mhanha (2km), Vikumburu Secondary (1.5km), PLK–Marsdumbo (2km) roads, periodic maintenance of Chole–Kihare–Vikumburu (3km) and Boga–Ngongele (1km), plus construction of culverts along Kauzeni–Mhanga, Palaka–Marumbo and Vikumburu Secondary corridors.",
  },
  {
    slug: "ngongele-boga-spot-improvement",
    title: "Ngongele–Boga Spot Improvement",
    category: "Roads",
    location: "Tanzania",
    year: 2024,
    image: culvertImg,
    description:
      "Spot improvement of the Ngongele–Boga 0.3km section, installation of pipe culvert (1 No.) and erosion-protection works of culvert at Ch. 0+1800. Contract No. AE/092/2023-24/CR/W/93.",
  },
  {
    slug: "dar-residential-apartments",
    title: "Residential Apartment Building",
    category: "Buildings",
    location: "Dar es Salaam",
    year: 2023,
    image: apartmentsImg,
    description:
      "Architectural design and construction of a residential apartment complex in Dar es Salaam, including civil works, finishes and external works.",
  },
  {
    slug: "commissioner-for-lands-office",
    title: "Commissioner for Lands Office",
    category: "Buildings",
    location: "Njombe & Iringa",
    year: 2023,
    image: officeImg,
    description:
      "Construction of Commissioner for Lands Office buildings in Njombe and Iringa regions — full structural, electrical and finishing works.",
  },
  {
    slug: "bupu-piped-water-scheme",
    title: "Bupu Village Piped Water Scheme",
    category: "Water",
    location: "Mkuranga, Coast Region",
    year: 2024,
    image: waterImg,
    description:
      "Construction of a piped water scheme: 25 cu.m raised tank, 10 distribution points, ferro-cement jar for rainwater harvesting, pump house and installation of pump and generator at Bupu village.",
  },
  {
    slug: "heavy-equipment-fleet",
    title: "Heavy Equipment Fleet & Operations",
    category: "Civil",
    location: "Nationwide",
    year: 2025,
    image: equipmentImg,
    description:
      "Owned and operator-led fleet of excavators, dump trucks, motor graders, bulldozers, concrete plants and water bowsers deployed across active projects.",
  },
];

export const STATS = [
  { value: 10, suffix: "+", label: "Years of experience" },
  { value: 50, suffix: "+", label: "Projects delivered" },
  { value: 80, suffix: "+", label: "Skilled professionals" },
  { value: 100, suffix: "+", label: "Pieces of equipment" },
];

export const VALUES = [
  { title: "Integrity & Honesty", desc: "We do what we say. Every contract, every site, every time." },
  { title: "Innovation", desc: "Cutting-edge methods and technology applied to local conditions." },
  { title: "Quality & Excellence", desc: "Engineered for safety, durability and the long term." },
  { title: "Professionalism", desc: "A skilled team, clear communication and disciplined execution." },
];

export const EQUIPMENT = [
  ["Excavators", 7], ["Dump Trucks", 10], ["Service Vehicles", 10],
  ["Motor Graders", 5], ["Backhoe Excavators", 5], ["Bulldozers", 5],
  ["Double Drum Vibrator Rollers", 5], ["Wheel Loaders", 5], ["Tipping Trucks", 5],
  ["Rough Terrain Cranes", 5], ["Generators", 5], ["Water Pumps", 15],
  ["Concrete Pumps", 5], ["Concrete Batching Plants", 3], ["Concrete Truck Mixers", 5],
  ["Water Bowsers", 10], ["Concrete Mixers", 20], ["Poker Machines", 20],
] as const;

export const PERSONNEL = [
  ["Civil Engineers", 5], ["Quantity Surveyors", 3], ["Environmental Engineers", 3],
  ["Electrical Engineers", 5], ["Mechanical Engineers", 3], ["Telecommunication Engineers", 2],
  ["Architects", 3], ["Land Surveyors", 3], ["Site Foremen", 6],
  ["Health & Safety Officers", 4], ["Social Officers", 3], ["Procurement", 2],
  ["Accountants", 3], ["Human Resources", 2], ["Artisans", 10],
  ["Machine Operators", 10], ["Drivers", 10],
] as const;

export const TESTIMONIALS = [
  {
    name: "Engineer M. Kimaro",
    role: "Project Director",
    company: "Public Works Agency",
    message: "Phason delivered the road and culvert works ahead of schedule with quality that exceeded contract specifications. A truly dependable partner.",
  },
  {
    name: "S. Mwakitalu",
    role: "Property Developer",
    company: "Dar es Salaam",
    message: "From design to handover, the team handled our apartment build with discipline and professionalism. Highly recommended.",
  },
  {
    name: "District Engineer",
    role: "Local Government",
    company: "Mkuranga District",
    message: "Their water scheme works in Bupu village transformed access for the community. Solid execution and excellent community engagement.",
  },
];

export const FAQS = [
  {
    q: "Where is Phason Engineering Works Limited based?",
    a: "Our head office is at Mezzanine Floor, Alfa Plaza, Ada Estate Street, Chabruma Road, P.O. Box 373, Dar es Salaam, Tanzania.",
  },
  {
    q: "What types of projects do you undertake?",
    a: "Civil engineering (roads, bridges, drainage), structural building works, electrical installations and renewable energy systems, plus full construction management for projects of any scale.",
  },
  {
    q: "Do you offer supply and procurement services?",
    a: "Yes — we supply industrial and agricultural sulphur, packaging materials, general goods, equipment hire, transport and full procurement & logistics services.",
  },
  {
    q: "Can you mobilise equipment to remote sites?",
    a: "Yes. Our owned fleet of excavators, dump trucks, graders, bulldozers, batching plants and water bowsers is deployable nationwide.",
  },
  {
    q: "How do I request a quote?",
    a: "Use the contact form, email phasonengineering@gmail.com or call +255 767 071788. We respond to all enquiries within one business day.",
  },
];

export const POSTS = [
  {
    slug: "building-roads-that-last",
    title: "Building Roads That Last in East Africa",
    date: "2025-09-12",
    excerpt: "How proper drainage design and culvert placement extend the life of rural road networks across Tanzania.",
    image: roadImg,
    body: "Rural road durability in tropical climates depends as much on drainage as on the wearing course. In our spot-improvement programmes we lead with hydrology: we map the catchment, size culverts to a 25-year storm event, and protect outlets with rip-rap or concrete aprons. The result is a road that survives the rainy season — year after year.",
  },
  {
    slug: "solar-for-industry",
    title: "Solar Power for Tanzanian Industry",
    date: "2025-08-04",
    excerpt: "Why hybrid solar systems are now the most cost-effective option for warehouses and factories.",
    image: equipmentImg,
    body: "With grid tariffs rising and panel costs falling, hybrid PV systems pay back in 3–4 years for most industrial customers. We design from the load profile up, ensuring the system actually matches how the facility uses energy.",
  },
  {
    slug: "managing-rural-water-projects",
    title: "Managing Rural Water Schemes",
    date: "2025-06-21",
    excerpt: "Lessons from the Bupu village piped water project in Mkuranga district.",
    image: waterImg,
    body: "Sustainability of rural water schemes depends on community ownership. On the Bupu project we paired the technical works with operator training and a clear maintenance plan handed over to the village water committee.",
  },
];
