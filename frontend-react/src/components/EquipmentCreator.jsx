import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { ref, get, push } from 'firebase/database';

function EquipmentCreator() {
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [rarity, setRarity] = useState('Common');
  const [bonus, setBonus] = useState('Strength');
  const [value, setValue] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [players, setPlayers] = useState({});
  const [weaponRange, setWeaponRange] = useState('');

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      const snapshot = await get(ref(db, "characters"));
      const data = snapshot.val() || {};
      setPlayers(data);
    } catch (err) {
      console.error("Error loading players:", err);
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory('');
    setWeaponRange('');
  };

  const handleWeaponRangeChange = (range) => {
    setWeaponRange(range);
    setCategory('');
  };

  const getCategoryOptions = () => {
    if (type === 'Armor') {
      return ['Light', 'Heavy', 'Unarmored'];
    } else if (type === 'weapon') {
      if (weaponRange === 'Melee') {
        return ['Sword', 'Axe', 'Staff', 'Dagger'];
      } else if (weaponRange === 'Ranged') {
        return ['Bow', 'Longbow', 'Crossbow', 'Heavy Crossbow', 'Dart', 'Sling'];
      }
      return [];
    } else if (type === 'item') {
      return ['Potion', 'Ring', 'Scroll'];
    }
    return [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!type || !category || !selectedPlayer) {
      alert("Please fill in type, category, and select a player.");
      return;
    }

    const itemData = {
      name: category,
      category,
      rarity,
      bonuses: [{ type: bonus, value }],
    };

    try {
      const refPath = `characters/${selectedPlayer.toLowerCase()}/Equipment/${type}`;
      await push(ref(db, refPath), itemData);
      alert(`✅ Equipment created for ${selectedPlayer}: ${category}`);
      
      // Reset form
      setType('');
      setCategory('');
      setRarity('Common');
      setBonus('Strength');
      setValue(0);
      setSelectedPlayer('');
      setWeaponRange('');
    } catch (err) {
      console.error("❌ Error pushing equipment:", err);
      alert(`Failed to create equipment: ${err.message}`);
    }
  };

  return (
    <div className="equipment-creator">
      <h2>Create Equipment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="equip-type">Type:</label>
          <select
            id="equip-type"
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
            required
          >
            <option value="">-- Select Type --</option>
            <option value="Armor">Armor</option>
            <option value="weapon">Weapon</option>
            <option value="item">Item</option>
          </select>
        </div>

        {type === 'weapon' && (
          <div>
            <label htmlFor="weapon-range">Weapon Type:</label>
            <select
              id="weapon-range"
              value={weaponRange}
              onChange={(e) => handleWeaponRangeChange(e.target.value)}
              required
            >
              <option value="">-- Select Weapon Type --</option>
              <option value="Melee">Melee</option>
              <option value="Ranged">Ranged</option>
            </select>
          </div>
        )}

        <div>
          <label htmlFor="equip-category">Category:</label>
          <select
            id="equip-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">-- Select Category --</option>
            {getCategoryOptions().map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="equip-rarity">Rarity:</label>
          <select
            id="equip-rarity"
            value={rarity}
            onChange={(e) => setRarity(e.target.value)}
            required
          >
            <option value="Common">Common</option>
            <option value="Uncommon">Uncommon</option>
            <option value="Rare">Rare</option>
            <option value="Epic">Epic</option>
            <option value="Legendary">Legendary</option>
          </select>
        </div>

        <div>
          <label htmlFor="equip-bonus">Bonus Type:</label>
          <select
            id="equip-bonus"
            value={bonus}
            onChange={(e) => setBonus(e.target.value)}
            required
          >
            <option value="Strength">Strength</option>
            <option value="Dexterity">Dexterity</option>
            <option value="Constitution">Constitution</option>
            <option value="Intelligence">Intelligence</option>
            <option value="Wisdom">Wisdom</option>
            <option value="Charisma">Charisma</option>
          </select>
        </div>

        <div>
          <label htmlFor="equip-value">Bonus Value:</label>
          <select
            id="equip-value"
            value={value}
            onChange={(e) => setValue(parseInt(e.target.value))}
            required
          >
            {Array.from({ length: 11 }, (_, i) => i - 5).map(n => (
              <option key={n} value={n}>{n >= 0 ? `+${n}` : n}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="equip-player">Player:</label>
          <select
            id="equip-player"
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            required
          >
            <option value="">-- Select Player --</option>
            {Object.keys(players).map(player => (
              <option key={player} value={player}>{player}</option>
            ))}
          </select>
        </div>

        <button type="submit">Create Equipment</button>
      </form>
    </div>
  );
}

export default EquipmentCreator; 