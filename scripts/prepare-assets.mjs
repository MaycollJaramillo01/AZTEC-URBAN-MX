import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const parentPackage = path.resolve(root, "..");
const originals = await fs
  .access(path.join(parentPackage, "inventario.json"))
  .then(() => parentPackage)
  .catch(() => path.join(root, "originals"));
const inventory = JSON.parse(
  await fs.readFile(path.join(originals, "inventario.json"), "utf8"),
);
// Reviewed individually against the original files; no account-to-location inference.
const selections = [
  [
    "grill-board",
    "aztecurbanmx-02",
    "food",
    "Grilled meat and purple cabbage on an Aztec wooden board",
    "Carne a la parrilla y col morada sobre una tabla de Aztec",
    "50% 50%",
  ],
  [
    "tacos-board",
    "aztecurbanmxtyler-08",
    "food",
    "Tacos topped with purple cabbage on a wooden serving board",
    "Tacos con col morada sobre una tabla de madera",
    "50% 50%",
  ],
  [
    "table-flavors",
    "aztecurbanmx-06",
    "food",
    "A colorful plate of food with a red drink on the table",
    "Un plato de comida y una bebida roja sobre la mesa",
    "50% 65%",
  ],
  [
    "green-cocktail",
    "aztecurbanmx-05",
    "drinks",
    "Green cocktail in a curved glass with a purple flower garnish",
    "Coctel verde en una copa curva con una flor morada",
    "50% 50%",
  ],
  [
    "aztec-interior",
    "aztecurbanmx-08",
    "atmosphere",
    "Aztec restaurant interior with colorful lighting, tables and a bar",
    "Interior de Aztec con iluminación de colores, mesas y barra",
    "50% 50%",
  ],
  [
    "cocktail-glasses",
    "aztecurbanmxtyler-10",
    "drinks",
    "Cocktail glasses displayed above colorful ceramic cups",
    "Copas de coctel sobre vasos de cerámica de colores",
    "50% 50%",
  ],
  [
    "cocktail-pour",
    "aztecurbanmxtyler-12",
    "drinks",
    "A drink being poured into a cut-glass cocktail glass",
    "Una bebida servida en una copa de cristal tallado",
    "50% 55%",
  ],
  [
    "grilled-seafood",
    "aztecurban2127-03",
    "food",
    "Grilled octopus with lime; the original photo reads Grilled Octopus",
    "Pulpo a la parrilla con limón; la foto original dice Grilled Octopus",
    "50% 50%",
  ],
];
const output = path.join(root, "public/images/aztec");
await fs.mkdir(output, { recursive: true });
const images = [];
for (const [id, originalId, category, altEn, altEs, focalPoint] of selections) {
  const original = inventory.find(
    (item) => path.basename(item.archivo, ".jpg") === originalId,
  );
  if (!original) throw new Error(`Missing original: ${originalId}`);
  const variants = [];
  for (const width of [...new Set([320, original.ancho])].sort(
    (a, b) => a - b,
  )) {
    const base = `${id}-${width}`;
    const source = path.join(originals, original.archivo);
    const pipeline = sharp(source)
      .rotate()
      .resize({ width, withoutEnlargement: true });
    const info = await pipeline
      .clone()
      .webp({ quality: 84 })
      .toFile(path.join(output, `${base}.webp`));
    await pipeline
      .jpeg({ quality: 87, mozjpeg: true })
      .toFile(path.join(output, `${base}.jpg`));
    variants.push({
      width: info.width,
      height: info.height,
      webp: `/images/aztec/${base}.webp`,
      jpeg: `/images/aztec/${base}.jpg`,
      bytes: info.size,
    });
  }
  const largest = variants.at(-1);
  images.push({
    id,
    localPath: largest.webp,
    width: largest.width,
    height: largest.height,
    variants,
    sourceAccount: original.cuenta,
    sourcePostUrl: original.origen,
    originalFile: original.archivo,
    sourceSha256: original.sha256,
    category,
    locationId: null,
    verifiedDishName: null,
    altEn,
    altEs,
    focalPoint,
    publicationApproval: "pending_client_review",
    approvedForPublication: false,
    sourceKind: original.origen.includes("/reel/") ? "reel_thumbnail" : "photo",
  });
}
await fs.mkdir(path.join(root, "src/data"), { recursive: true });
await fs.writeFile(
  path.join(root, "src/data/images.json"),
  JSON.stringify(images, null, 2) + "\n",
);
console.log(
  `Prepared ${images.length} reviewed photographs, ${images.reduce((sum, photo) => sum + photo.variants.length * 2, 0)} local derivatives. Originals unchanged.`,
);
