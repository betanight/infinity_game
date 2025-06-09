import { db } from "./firebase.js";
import { strengthSkills } from "../src/frontend/skilltree/src/strength/index.js";
import { defineAllTier1Skills } from "../src/frontend/mystical/Arcane/tier_1/tier_1_index.js";
import { defineMonkSkills } from "../src/frontend/mystical/Willpower/tier_1/monk.js";
import { defineSpiritSkills } from "../src/frontend/mystical/Spirit/tier_1/young.js";
import { defineRankOneSkills } from "../src/frontend/mystical/Presence/tier_1/rank_1.js";

const fullTemplate = {
  meta: {
    character_id: "",
    level: 1,
    experience: 0,
    experience_to_next: 1000,
    available_skill_points: 6,
    rank: "G-",
    unlocked_trees: {
      Willpower: false,
      Spirit: false,
      Arcane: false,
      Presence: false,
    },
  },

  primary_scores: {
    Strength: 1,
    Dexterity: 1,
    Constitution: 1,
    Intelligence: 1,
    Wisdom: 1,
    Charisma: 1,
  },
  secondary_scores: {
    Willpower: 0,
    Spirit: 0,
    Arcane: 0,
    Presence: 0,
  },
  equipment: {
    weapon: null,
    armor: null,
    accessories: [],
    inventory: [],
  },
  skills: {
    Strength: strengthSkills,
    Dexterity: {
      Acrobatics: {
        description: "Perform flips, rolls, and agile maneuvers with grace.",
        boost: ["melee:accuracy", "move:speed", "armor:none", "armor:light"],
        effective_value: 0,
      },
      "Aimed Shot": {
        description:
          "Precisely fire or throw projectiles at distant or moving targets.",
        boost: ["ranged:accuracy"],
        effective_value: 0,
      },
      Ambidexterity: {
        description:
          "Use both hands with equal proficiency for tasks or combat.",
        boost: ["melee:accuracy", "ranged:accuracy"],
        effective_value: 0,
      },
      "Missile Snaring": {
        description: "Catch incoming projectiles with swift movements.",
        boost: ["armor:none", "armor:light"],
        effective_value: 0,
      },
      Balance: {
        description:
          "Maintain footing on unstable, narrow, or hazardous surfaces.",
        boost: ["armor:none", "armor:light"],
        effective_value: 0,
      },
      "Blade Precision": {
        description: "Strike with pinpoint accuracy using bladed weapons.",
        boost: ["damage:melee", "melee:accuracy"],
        effective_value: 0,
      },
      "Critical Chance": {
        description: "Increase the likelihood of delivering critical strikes.",
        boost: ["combat:critical-chance"],
        effective_value: 0,
      },
      "Critical Damage": {
        description: "Enhance the power of critical hits when they occur.",
        boost: ["combat:critical-damage"],
        effective_value: 0,
      },
      "Dual Precision": {
        description:
          "Wield two weapons with synchronized precision and timing.",
        boost: ["access:dual-wielding-options"],
        effective_value: 0,
      },
      "Escape Artist": {
        description: "Slip free from bindings, grapples, or tight spaces.",
        boost: ["skill:escape-artist"],
        effective_value: 0,
      },
      Evasion: {
        description:
          "Dodge attacks and avoid area effects with fluid movements.",
        boost: ["move:speed", "armor:none", "armor:light"],
        effective_value: 0,
      },
      Lockpicking: {
        description: "Bypass locks and secured doors using fine manual skills.",
        boost: ["skill:lockpicking"],
        effective_value: 0,
      },
      "Precision Throwing": {
        description: "Throw objects or weapons with surgical precision.",
        boost: ["damage:ranged", "ranged:accuracy"],
        effective_value: 0,
      },
      "Quick Draw": {
        description:
          "Rapidly draw weapons to gain advantage in combat. [(M/R)Acc+, (H)Armor+]",
        boost: [
          "melee:accuracy",
          "ranged:accuracy",
          "armor:none",
          "armor:light",
        ],
        effective_value: 0,
      },
      "Reflex Training": {
        description: "React faster to threats and stimuli in your environment.",
        boost: ["melee:accuracy", "move:speed", "armor:none", "armor:light"],
        effective_value: 0,
      },
      "Sleight of Hand": {
        description:
          "Manipulate objects discreetly for magic tricks, theft, or escape.",
        boost: ["skill:sleight-of-hand", "melee:accuracy"],
        effective_value: 0,
      },
      Stealth: {
        description: "Move silently and avoid detection from enemies.",
        boost: ["stealth"],
        effective_value: 0,
      },
      "Throwing Combo": {
        description:
          "Chain multiple thrown attacks together for maximum effect.",
        boost: ["action-point"],
        effective_value: 0,
      },
      "Trigger Discipline": {
        description:
          "Improve accuracy and safety when using firearms or ranged tools.",
        boost: ["ranged:accuracy"],
        effective_value: 0,
      },
      "Vital Point Targeting": {
        description: "Strike weak points to disable enemies swiftly.",
        boost: ["melee:accuracy", "ranged:accuracy", "combat:critical-damage"],
        effective_value: 0,
      },
      "Weapon Finesse": {
        description:
          "Apply agility instead of strength to attacks with light weapons.",
        boost: ["damage:melee", "melee:accuracy", "armor:none", "armor:light"],
        effective_value: 0,
      },
      "Whip Control": {
        description: "Master flexible weapons such as whips or chains.",
        boost: ["access:[weapon-type]-whip"],
        effective_value: 0,
      },
    },

    Constitution: {
      "Acid Resistance": {
        description: "Reduce the effects of corrosive substances.",
        boost: ["skill:acid-resistance"],
        effective_value: 0,
      },
      Adaptability: {
        description:
          "Adjust to harsh environments and unexpected challenges more easily.",
        boost: ["armor"],
        effective_value: 0,
      },
      "Blood Circulation": {
        description: "Maintain consistent body performance under stress.",
        boost: ["health"],
        effective_value: 0,
      },
      "Bludgeoning Resistance": {
        description: "Reduce damage from blunt weapons or impacts.",
        boost: ["armor"],
        effective_value: 0,
      },
      "Breath Control": {
        description:
          "Hold breath for long durations or function in low-oxygen environments.",
        boost: ["skill:breath-control"],
        effective_value: 0,
      },
      "Cold Resistance": {
        description: "Withstand freezing temperatures and harsh climates.",
        boost: ["skill:cold-resistance"],
        effective_value: 0,
      },
      "Core Strength": {
        description: "Improve internal body strength and stability.",
        boost: ["health", "armor"],
        effective_value: 0,
      },
      "Disease Resistance": {
        description: "Natural resilience against infections and illnesses.",
        boost: ["skill:disease-resistance"],
        effective_value: 0,
      },
      Endurance: {
        description:
          "Sustain physical activity over extended periods without fatigue.",
        boost: ["health"],
        effective_value: 0,
      },
      "Fat Storage": {
        description: "Efficiently manage bodily energy reserves.",
        boost: ["health"],
        effective_value: 0,
      },
      "Fire Resistance": {
        description: "Reduce or negate damage from fire-based attacks.",
        boost: ["skill:fire-resistance"],
        effective_value: 0,
      },
      "Force Resistance": {
        description: "Resist magical or concussive force effects.",
        boost: ["skill:force-resistance"],
        effective_value: 0,
      },
      "Frost Resistance": {
        description: "Minimize harm from freezing or icy conditions.",
        boost: ["skill:frost-resistance"],
        effective_value: 0,
      },
      "Heat Resistance": {
        description: "Endure extreme heat and dehydration.",
        boost: ["skill:heat-resistance"],
        effective_value: 0,
      },
      "Hunger Tolerance": {
        description: "Function effectively with minimal food intake.",
        boost: ["skill:hunger-tolerance"],
        effective_value: 0,
      },
      "Lightning Resistance": {
        description: "Deflect or ground electrical damage sources.",
        boost: ["skill:lightning-resistance"],
        effective_value: 0,
      },
      Longevity: {
        description: "Extend life expectancy and reduce aging effects.",
        boost: ["health"],
        effective_value: 0,
      },
      "Natural Healing": {
        description: "Regenerate from wounds and recover health over time.",
        boost: ["health"],
        effective_value: 0,
      },
      "Pain Tolerance": {
        description: "Resist pain from injury or strenuous exertion.",
        boost: ["health"],
        effective_value: 0,
      },
      "Physical Perseverance": {
        description:
          "Push through intense physical strain to complete difficult tasks.",
        boost: ["health", "armor", "movement"],
        effective_value: 0,
      },
      "Piercing Resistance": {
        description: "Withstand stabs and punctures from sharp objects.",
        boost: ["skill:piercing-resistance", "armor"],
        effective_value: 0,
      },
      "Poison Resistance": {
        description: "Mitigate damage and effects from toxins.",
        boost: ["skill:poison-resistance"],
        effective_value: 0,
      },
      "Recovery Boost": {
        description: "Accelerate physical healing from injuries.",
        boost: ["access:short-rest"],
        effective_value: 0,
      },
      "Stun Resistance": {
        description: "Survive trauma from blunt force or energy-based attacks.",
        boost: ["skill:stun-resistance"],
        effective_value: 0,
      },
      "Slashing Resistance": {
        description: "Deflect or reduce injury from cutting attacks.",
        boost: ["skill:slashing-resistance", "armor"],
        effective_value: 0,
      },
      "Sleep Efficiency": {
        description: "Require less sleep while maintaining full performance.",
        boost: ["short-rest"],
        effective_value: 0,
      },
      "Stamina Recovery": {
        description: "Recover quickly from exhaustion or fatigue.",
        boost: ["short-rest"],
        effective_value: 0,
      },
      "Stress Resistance": {
        description: "Perform well under high-pressure situations.",
        boost: ["skill:stress-resistance"],
        effective_value: 0,
      },
      "Thunder Resistance": {
        description: "Endure damage from forceful sound or vibrations.",
        boost: ["skill:thunder-resistance"],
        effective_value: 0,
      },
      Toughness: {
        description: "Reduce the severity of injuries taken.",
        boost: ["health", "armor"],
        effective_value: 0,
      },
      "Toxin Resistance": {
        description: "Withstand poisons and harmful substances.",
        boost: ["skill:toxin-resistance"],
        effective_value: 0,
      },
      Vitality: {
        description: "Enhance overall physical robustness and health.",
        boost: ["health"],
        effective_value: 0,
      },
    },

    Intelligence: {
      Arcana: {
        description:
          "Recall knowledge related to magic, spells, and mystical traditions.",
        boost: ["energy:accuracy", "damage:raw[arcane]"],
        effective_value: 0,
      },
      Codebreaking: {
        description:
          "Decipher encrypted messages, hidden languages, and secret codes.",
        boost: ["skill:codebreaking"],
        effective_value: 0,
      },
      "Cognitive Adaptability": {
        description:
          "Quickly shift mental focus to solve new or changing problems.",
        boost: ["skill:cognitive-adaptability"],
        effective_value: 0,
      },
      Engineering: {
        description:
          "Apply scientific principles to design structures, machines, and tools.",
        boost: ["skill:engineering"],
        effective_value: 0,
      },
      History: {
        description:
          "Recall important historical events, cultures, and legendary figures.",
        boost: ["skill:history"],
        effective_value: 0,
      },
      "Illusion Analysis": {
        description:
          "Recognize and mentally dismantle illusions and falsehoods.",
        boost: ["skill:illusion-analysis"],
        effective_value: 0,
      },
      Investigation: {
        description:
          "Search for hidden clues, inconsistencies, or small details others miss.",
        boost: ["skill:investigation"],
        effective_value: 0,
      },
      "Knowledge Synthesis": {
        description:
          "Combine disparate fields of knowledge into new theories or ideas.",
        boost: ["skill:knowledge-synthesis"],
        effective_value: 0,
      },
      Linguistics: {
        description: "Understand and learn new languages quickly and fluently.",
        boost: ["skill:linguistics"],
        effective_value: 0,
      },
      Logic: {
        description:
          "Apply deductive reasoning to solve puzzles and uncover truths.",
        boost: ["skill:logic"],
        effective_value: 0,
      },
      "Magical Theory": {
        description:
          "Comprehend the underlying mechanisms behind magical phenomena.",
        boost: ["energy:accuracy", "damage:raw[arcane]"],
        effective_value: 0,
      },
      Mathematics: {
        description:
          "Perform advanced calculations and geometric problem-solving.",
        boost: ["skill:mathematics"],
        effective_value: 0,
      },
      "Memory Recall": {
        description:
          "Retrieve specific memories with great clarity and detail.",
        boost: ["skill:memory-recall"],
        effective_value: 0,
      },
      "Mental Fortitude": {
        description:
          "Resist mental domination, psychic assault, and confusion effects.",
        boost: ["skill:psychic-resistance"],
        effective_value: 0,
      },
      "Mind Resistance": {
        description:
          "Protect your mind against mental intrusions and manipulation.",
        boost: ["skill:mental-resistance"],
        effective_value: 0,
      },
      "Occult Knowledge": {
        description:
          "Understand esoteric and forbidden subjects beyond mortal ken.",
        boost: ["energy:accuracy"],
        effective_value: 0,
      },
      "Psychic Defense": {
        description:
          "Form mental shields to block psychic and telepathic attacks.",
        boost: ["skill:mind-shielding"],
        effective_value: 0,
      },
      "Religious Studies": {
        description:
          "Comprehend theology, divine orders, and mythological systems.",
        boost: ["skill:religion"],
        effective_value: 0,
      },
      "Strategic Foresight": {
        description:
          "Predict enemy actions and devise effective countermeasures.",
        boost: [
          "melee:accuracy",
          "ranged:accuracy",
          "energy:accuracy",
          "damage:raw",
        ],
        effective_value: 0,
      },
      "Tactical Planning": {
        description:
          "Organize battlefield tactics and small-unit coordination.",
        boost: [
          "melee:accuracy",
          "ranged:accuracy",
          "energy:accuracy",
          "damage:raw",
        ],
        effective_value: 0,
      },
    },

    Wisdom: {
      "Absorptive Listening": {
        description:
          "Absorb spoken knowledge and stories with precision and understanding.",
        boost: ["skill:absorptive-listening"],
        effective_value: 0,
      },
      "Caution Awareness": {
        description: "Perceive dangers before they strike.",
        boost: ["skill:caution-awareness"],
        effective_value: 0,
      },
      "Conflict De-escalation": {
        description:
          "Defuse hostile situations through insight and calm influence.",
        boost: ["skill:de-escalation"],
        effective_value: 0,
      },
      "Consequential Thinking": {
        description:
          "Predict outcomes based on observed behavior and decisions.",
        boost: ["skill:learn"],
        effective_value: 0,
      },
      "Crisis Perception": {
        description: "Stay calm and process fast-moving danger effectively.",
        boost: ["skill:stress-resistance"],
        effective_value: 0,
      },
      "Cultural Fluency": {
        description:
          "Understand cultural practices, customs, and expectations.",
        boost: ["skill:culture"],
        effective_value: 0,
      },
      "Experience Recall": {
        description: "Draw on personal past experiences to make decisions.",
        boost: ["skill:recall"],
        effective_value: 0,
      },
      "Foresight Temperance": {
        description: "Balance future planning with patience and timing.",
        boost: ["skill:deep-thought"],
        effective_value: 0,
      },
      "Guidance Instinct": {
        description:
          "Help others find purpose and direction through intuition.",
        boost: ["skill:instict"],
        effective_value: 0,
      },
      Insight: {
        description:
          "Understand intentions and hidden truths through subtle cues.",
        boost: [
          "skill:insight",
          "melee:accuracy",
          "ranged:accuracy",
          "energy:accuracy",
          "damage:raw",
        ],
        effective_value: 0,
      },
      "Interpersonal Balance": {
        description: "Maintain calm, respectful dynamics in conversations.",
        boost: ["skill:mindset"],
        effective_value: 0,
      },
      "Introspective Growth": {
        description:
          "Learn from past mistakes and evolve mentally and emotionally.",
        boost: ["wisdom"],
        effective_value: 0,
      },
      "Lesson Retention": {
        description: "Retain lessons learned through experience and study.",
        boost: ["skill:learn"],
        effective_value: 0,
      },
      "Memory Anchoring": {
        description: "Tie memories to emotions and context for quick recall.",
        boost: ["skill:memory"],
        effective_value: 0,
      },
      "Mentorship Awareness": {
        description: "Recognize the growth and needs of others over time.",
        boost: ["skill:leadership"],
        effective_value: 0,
      },
      "Moral Discernment": {
        description: "Sense ethical balance and right action instinctively.",
        boost: ["skill:moral"],
        effective_value: 0,
      },
      "Observation Logging": {
        description:
          "Track and mentally record details from your surroundings.",
        boost: [
          "melee:accuracy",
          "ranged:accuracy",
          "energy:accuracy",
          "damage:raw",
        ],
        effective_value: 0,
      },
      "Patience Discipline": {
        description: "Remain focused and restrained when provoked.",
        boost: ["skill:mindset"],
        effective_value: 0,
      },
      "Pattern Recognition": {
        description:
          "Identify trends and repeated behaviors to anticipate outcomes.",
        boost: ["skill:learn"],
        effective_value: 0,
      },
      "Practical Judgment": {
        description: "Choose realistic and effective responses under pressure.",
        boost: ["skill:leadership", "skill:mindset"],
        effective_value: 0,
      },
      "Situational Awareness": {
        description:
          "Constantly assess your environment for threats and openings.",
        boost: [
          "melee:accuracy",
          "ranged:accuracy",
          "energy:accuracy",
          "damage:raw",
        ],
        effective_value: 0,
      },
      "Spiritual Intuition": {
        description: "Sense spiritual forces and meanings beyond the material.",
        boost: ["skill:spiritual-sense"],
        effective_value: 0,
      },
      "Wisdom Reception": {
        description:
          "Take in teachings and advice without ego or defensiveness.",
        boost: ["skill:learn", "skill:mindset"],
        effective_value: 0,
      },
      Perception: {
        description: "Percieve your surroundings, using all of your senses",
        boost: ["skill:perception"],
        effective_value: 0,
      },
    },

    Charisma: {
      "Ambassadorial Presence": {
        description:
          "Represent your group with authority and grace in foreign lands.",
        boost: ["skill:presence"],
        effective_value: 0,
      },
      "Audience Reading": {
        description: "Gauge the reactions and moods of a crowd or listener.",
        boost: ["skill:audience-reading"],
        effective_value: 0,
      },
      Boast: {
        description: "Impress others with your accomplishments or bravado.",
        boost: ["skill:boast"],
        effective_value: 0,
      },
      Charm: {
        description:
          "Influence others through likability and subtle persuasion.",
        boost: ["skill:charm"],
        effective_value: 0,
      },
      "Courtly Etiquette": {
        description:
          "Navigate noble courts and aristocratic society with grace.",
        boost: ["skill:etiquette"],
        effective_value: 0,
      },
      Debate: {
        description: "Argue logically and convincingly to sway opinions.",
        boost: ["skill:debate"],
        effective_value: 0,
      },
      Deception: {
        description: "Convince others of falsehoods with confidence.",
        boost: ["skill:deception"],
        effective_value: 0,
      },
      Diplomacy: {
        description: "Facilitate agreements and prevent conflict through tact.",
        boost: ["skill:diplomacy"],
        effective_value: 0,
      },
      "Disguise Demeanor": {
        description: "Adopt alternate identities and mannerisms seamlessly.",
        boost: ["skill:disguise"],
        effective_value: 0,
      },
      "Feign Innocence": {
        description: "Appear guiltless or harmless when accused.",
        boost: ["skill:deception"],
        effective_value: 0,
      },
      Flattery: {
        description: "Compliment strategically to gain favor.",
        boost: ["skill:flattery"],
        effective_value: 0,
      },
      "Gossip Management": {
        description:
          "Control rumors and reputation through social maneuvering.",
        boost: ["skill:gossip"],
        effective_value: 0,
      },
      Haggle: {
        description: "Negotiate prices and terms in your favor.",
        boost: ["skill:haggle"],
        effective_value: 0,
      },
      "Inspire Courage": {
        description: "Rally others with words of bravery and resolve.",
        boost: ["skill:inspire"],
        effective_value: 0,
      },
      Intimidation: {
        description: "Use fear to assert dominance or compel behavior.",
        boost: ["skill:intimidation"],
        effective_value: 0,
      },
      Leadership: {
        description:
          "Command respect and inspire loyalty through action and presence.",
        boost: ["skill:leadership"],
        effective_value: 0,
      },
      "Lie Detection": {
        description: "Sense dishonesty in others through behavioral cues.",
        boost: ["skill:insight"],
        effective_value: 0,
      },
      "Mock Duel": {
        description: "Engage in playful combat to prove dominance socially.",
        boost: ["skill:mock"],
        effective_value: 0,
      },
      Oratory: {
        description: "Deliver formal speeches that inform or inspire.",
        boost: ["skill:speech"],
        effective_value: 0,
      },
      Performance: {
        description: "Captivate an audience through music, acting, or dance.",
        boost: ["skill:performance"],
        effective_value: 0,
      },
      Persuasion: {
        description: "Convince others to accept your ideas or proposals.",
        boost: ["skill:persuasion"],
        effective_value: 0,
      },
      "Public Speaking": {
        description: "Speak confidently and clearly before groups.",
        boost: ["skill:speech"],
        effective_value: 0,
      },
      "Rally Troops": {
        description: "Inspire fighters to press on with renewed vigor.",
        boost: ["skill:rally"],
        effective_value: 0,
      },
      "Read the Room": {
        description:
          "Discern unspoken tension, moods, and dynamics in a group.",
        boost: ["skill:insight"],
        effective_value: 0,
      },
      Seduction: {
        description: "Use charm and allure to achieve personal goals.",
        boost: ["skill:seduction"],
        effective_value: 0,
      },
      "Smooth Talk": {
        description: "Get out of trouble or persuade without facts.",
        boost: ["skill:persuasion"],
        effective_value: 0,
      },
      "Soul Resonance": {
        description: "Align emotionally and spiritually with anothers essence.",
        boost: ["skill:understanding"],
        effective_value: 0,
      },
      "Stage Presence": {
        description: "Own the space around you and demand attention.",
        boost: ["skill:speech", "skill:leadership"],
        effective_value: 0,
      },
      Storyweaving: {
        description: "Tell compelling tales that inform, persuade, or mystify.",
        boost: ["skill:storyweaving"],
        effective_value: 0,
      },
    },

    Willpower: {}, // defineMonkSkills function does this

    Spirit: {}, // defineSpiritSkills function does this

    Arcane: {}, // defineAllTier1Skills function does this

    Presence: {}, // defineAllRankOneSkills function does this
  },
};

db.ref("template")
  .set(fullTemplate)
  .then(() => {
    console.log("✅ Template uploaded to Firebase.");
    defineAllTier1Skills(db); // arcane
    defineMonkSkills(db); // willpower
    defineSpiritSkills(db); // Spirit
    defineRankOneSkills(db); // Presence
  })
  .catch((error) => console.error("❌ Failed to upload:", error));
