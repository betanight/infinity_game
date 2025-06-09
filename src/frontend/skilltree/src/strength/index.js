import { strengthActiveSkills } from "./active_skills.js";
import { strengthPassiveSkills } from "./passive_skills.js";

// Combine active and passive skills for each tier
export const strengthSkills = {
  "Tier 1": {
    ...strengthActiveSkills["Tier 1"],
    ...strengthPassiveSkills["Tier 1"],
  },
  "Tier 2": {
    ...strengthActiveSkills["Tier 2"],
    ...strengthPassiveSkills["Tier 2"],
  },
  "Tier 3": {
    ...strengthActiveSkills["Tier 3"],
    ...strengthPassiveSkills["Tier 3"],
  },
  "Tier 4": {
    ...strengthActiveSkills["Tier 4"],
    ...strengthPassiveSkills["Tier 4"],
  },
  "Tier 5": {
    ...strengthActiveSkills["Tier 5"],
    ...strengthPassiveSkills["Tier 5"],
  },
  "Final Tier": {
    ...strengthActiveSkills["Final Tier"],
    ...strengthPassiveSkills["Final Tier"],
  },
};
