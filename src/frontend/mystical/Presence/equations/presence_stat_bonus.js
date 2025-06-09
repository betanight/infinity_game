export function getPresenceStatBonus(presenceScore) {
  return {
    constitutionBonus: Math.floor(presenceScore / 2),
    strengthBonus: Math.floor(presenceScore / 5),
  };
}
