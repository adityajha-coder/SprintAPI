// SprintAPI — Universal Data Pusher

// // Please read important.md for full information and instructions on
// how to use this script.

const fs = require('fs');
const path = require('path');

const TARGET = "tools"; // Options: "apis" | "tools" | "vsc-ext" | "chrome-ext"

const NEW_ITEMS = [
  // { name: "Example Tool", desc: "Description here.", url: "https://example.com", cat: "Core Utilities" },
  // { name: "Example API", desc: "API description.", url: "https://api.example.com", category: "Miscellaneous", auth: "API Key", cors: true, pricing: "Free" },
  // { name: "Example Extension", desc: "Extension description.", id: "publisher.extension-id", cat: "Essentials" },
];

const DATA_DIR = path.join(__dirname, '..', 'data');

const FILES = {
  apis:         path.join(DATA_DIR, 'apis.json'),
  tools:        path.join(DATA_DIR, 'tools.json'),
  'vsc-ext':    path.join(DATA_DIR, 'extensions.json'),
  'chrome-ext': path.join(DATA_DIR, 'chrome-extensions.json'),
};

// Load all data
const allData = {};
for (const [key, filePath] of Object.entries(FILES)) {
  allData[key] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Build a global set of ALL names across ALL files (for duplicate detection)
function extractNames(data, type) {
  if (type === 'apis') {
    // apis.json is a flat array of objects
    return data.map(item => item.name.toLowerCase());
  }
  // tools, extensions, chrome-extensions use { cat, items: [...] }
  return data.flatMap(cat => cat.items.map(item => item.name.toLowerCase()));
}

const globalNames = new Set();
for (const [type, data] of Object.entries(allData)) {
  for (const name of extractNames(data, type)) {
    globalNames.add(name);
  }
}

console.log(`\nScanned all 4 JSON files — ${globalNames.size} total unique items found.`);

// Filter out duplicates
const toAdd = NEW_ITEMS.filter(item => {
  if (globalNames.has(item.name.toLowerCase())) {
    console.log(`  [skip] Duplicate: "${item.name}"`);
    return false;
  }
  return true;
});

if (toAdd.length === 0) {
  console.log(`\nNothing to add — all ${NEW_ITEMS.length} items are duplicates or list is empty.\n`);
  process.exit(0);
}

console.log(`\nAdding ${toAdd.length} new item(s) to ${TARGET}...\n`);

// Push items into the target file
const targetData = allData[TARGET];

if (TARGET === 'apis') {
  // apis.json is a flat array — just push directly
  for (const item of toAdd) {
    const entry = {
      name: item.name,
      desc: item.desc,
      url: item.url,
      category: item.category,
      auth: item.auth || 'None',
      cors: item.cors !== undefined ? item.cors : true,
      pricing: item.pricing || 'Free',
    };
    targetData.push(entry);
    console.log(`  [+] ${item.name} -> ${item.category}`);
  }
} else {
  // tools, vsc-ext, chrome-ext use { cat, items: [...] }
  for (const item of toAdd) {
    const catName = item.cat;
    if (!catName) {
      console.log(`  [warn] Skipping "${item.name}" — no "cat" field specified.`);
      continue;
    }

    let catEntry = targetData.find(c => c.cat === catName);
    if (!catEntry) {
      catEntry = { cat: catName, items: [] };
      targetData.push(catEntry);
      console.log(`  [new] Created category: "${catName}"`);
    }

    // Build the item object based on target type
    const entry = { name: item.name, desc: item.desc };

    if (TARGET === 'tools') {
      entry.url = item.url;
    } else if (TARGET === 'vsc-ext') {
      entry.id = item.id;
    } else if (TARGET === 'chrome-ext') {
      entry.id = item.id;
      if (item.icon) entry.icon = item.icon;
    }

    catEntry.items.push(entry);
    console.log(`  [+] ${item.name} -> ${catName}`);
  }
}

// Write back
fs.writeFileSync(FILES[TARGET], JSON.stringify(targetData, null, 2));
console.log(`\nDone! Wrote ${toAdd.length} item(s) to ${path.basename(FILES[TARGET])}\n`);
