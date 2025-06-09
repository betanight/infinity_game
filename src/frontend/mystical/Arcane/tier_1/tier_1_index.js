import { defineFireSkills } from "./fire.js";
import { defineFrostSkills } from "./frost.js";
import { defineLightningSkills } from "./lightning.js";
import { definePoisonSkills } from "./poison.js";
import { defineWaterSkills } from "./water.js";
import { defineWindSkills } from "./wind.js";
import { defineWoodSkills } from "./wood.js";
import { defineEarthSkills } from "./earth.js";

// master function to define all Tier 1 Arcane spells
export function defineAllTier1Skills(db) {
  defineFireSkills(db);
  defineFrostSkills(db);
  defineLightningSkills(db);
  definePoisonSkills(db);
  defineWaterSkills(db);
  defineWindSkills(db);
  defineWoodSkills(db);
  defineEarthSkills(db);
}
