import { readFileSync } from "node:fs";
import { join } from "node:path";

export type MenuItem = {
  category: string;
  name: string;
  note: string;
  price: number; // cents
  favorite: boolean;
  image: { src: string; alt: string };
};

// Name → Pexels source photo id (served locally as public/images/<slug(name)>.webp). Keys must match the `name` column in menu-items.csv.
const images: Record<string, { id: number; alt: string }> = {
  Espresso: { id: 1233528, alt: "Espresso in a small glass cup on a wooden table" },
  Cortado: { id: 4011869, alt: "Cortado in a short glass in window light" },
  "Flat White": { id: 13623762, alt: "Flat white with a latte-art leaf in a white cup" },
  Cappuccino: { id: 4227012, alt: "Cappuccino with foam in a dark cup on a wooden table" },
  "Oat Milk Latte": { id: 20184870, alt: "Latte with heart latte art next to a carton of oat milk" },
  Mocha: { id: 213620, alt: "Mocha topped with whipped cream in a glass on a saucer" },
  "Butter Croissant": { id: 19296861, alt: "Golden butter croissants on a wooden board" },
  "Almond Croissant": { id: 8569409, alt: "Croissant on a plate next to a cup of coffee" },
  "Cinnamon Morning Bun": { id: 9443534, alt: "Sugar-dusted cinnamon morning bun" },
  "Blueberry Muffin": { id: 7935281, alt: "Blueberry muffins cooling on a wire rack" },
  "Banana Walnut Bread": { id: 1277202, alt: "Loaf of banana bread with a slice cut" },
  "Egg & Cheddar Breakfast Sandwich": { id: 2612340, alt: "Breakfast table with fried eggs, toasted sandwiches and coffee" },
  "Turkey Pesto on Ciabatta": { id: 30925485, alt: "Ciabatta sandwich with greens, tomato and cheese" },
  "Caprese Panini": { id: 1885578, alt: "Pressed panini with mozzarella and greens on a board" },
  "Ham & Gruyère Croque Monsieur": { id: 17780276, alt: "Toasted ham and cheese sandwich on a wooden board" },
  "Cold Brew": { id: 28901490, alt: "Cold brew over ice in a tall glass on the café counter" },
  "Iced Latte": { id: 7487380, alt: "Hand holding an iced latte with layered milk and espresso" },
  "Nitro Cold Brew": { id: 14802987, alt: "Creamy cold coffee in a ribbed glass on a dark tray" },
  "Iced Matcha Latte": { id: 29156485, alt: "Iced matcha latte in a short glass" },
  "Sparkling Lemonade": { id: 6411492, alt: "Glass of lemonade with a lemon slice on the rim" },
};

/** Minimal CSV parser: handles quoted fields with commas and doubled quotes. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const endRow = () => {
    row.push(field);
    rows.push(row);
    row = [];
    field = "";
  };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      endRow();
    } else field += c;
  }
  if (field || row.length) endRow();
  return rows.filter((r) => r.some((f) => f.trim()));
}

export function toMenu(csv: string): MenuItem[] {
  const [header, ...rows] = parseCsv(csv);
  const col = (name: string) => header.indexOf(name);
  return rows.map((r) => {
    const name = r[col("name")];
    const img = images[name];
    if (!img) throw new Error(`No image for menu item "${name}". Add it to lib/menu.ts.`);
    return {
      category: r[col("category")],
      name,
      note: r[col("description")],
      price: Math.round(Number(r[col("cost")]) * 100),
      favorite: r[col("house_favorite")] === "true",
      image: { src: `/images/${slug(name)}.webp`, alt: img.alt },
    };
  });
}

/** Groups items by category, keeping the order the CSV lists them in. */
export function byCategory(items: MenuItem[]) {
  const groups = new Map<string, MenuItem[]>();
  for (const i of items) groups.set(i.category, [...(groups.get(i.category) ?? []), i]);
  return [...groups].map(([title, items]) => ({ title, items }));
}

export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

// Read once at module scope: the file is static, so it lands in the prerendered shell.
export const menu = toMenu(readFileSync(join(process.cwd(), "docs/design/menu-items.csv"), "utf-8"));
