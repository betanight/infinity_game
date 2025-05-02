export function getBranchCoordinates(centerX, centerY, baseAngle, count, distance) {
  const coords = [];
  const arcSpan = Math.PI / 2;

  if (count <= 0) return coords;
  if (count === 1) {
    const x = centerX + distance * Math.cos(baseAngle);
    const y = centerY + distance * Math.sin(baseAngle);
    coords.push({ x, y, angle: baseAngle });
    return coords;
  }

  const start = baseAngle - arcSpan / 2;

  for (let i = 0; i < count; i++) {
    const angle = start + (arcSpan * i) / (count - 1);
    const x = centerX + distance * Math.cos(angle);
    const y = centerY + distance * Math.sin(angle);
    coords.push({ x, y, angle });
  }

  return coords;
}

export function drawSkillNodes(ctx, statNodes, skillsByStat, characterData, skillNodeRadius, skillNodeMap, centerX, centerY) {
  for (const stat in skillsByStat) {
    const statCenter = statNodes[stat];
    if (!statCenter) continue;

    const skillNames = Object.keys(skillsByStat[stat]);
    if (skillNames.length === 0) continue;

    const scatteredPositions = getScatteredSkillPositions(
      statCenter.angle,
      skillNames.length,
      centerX,
      centerY
    );

    skillNames.forEach((skill, i) => {
      const { x, y } = scatteredPositions[i];
      const currentValue = characterData.skills?.[stat]?.[skill] || 0;

      ctx.beginPath();
      ctx.arc(x, y, skillNodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = currentValue > 0 ? "#3e8ed0" : "lightgray";
      ctx.fill();

      if (currentValue > 0) {
        ctx.fillStyle = "white";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(currentValue, x, y + 4);
      }

      skillNodeMap.push({ x, y, r: skillNodeRadius, stat, skill });
    });
  }
}
export function getHoveredSkill(mouseX, mouseY, skillNodeMap) {
  for (const node of skillNodeMap) {
    const dx = mouseX - node.x;
    const dy = mouseY - node.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance <= 10) {
      return node;
    }
  }
  return null;
}

export function getScatteredSkillPositions(statAngle, skillCount, centerX, centerY, innerRadius = 250, spread = 1000) {
  const positions = [];
  const sliceWidth = (Math.PI * 2) / 10;
  const startAngle = statAngle - (sliceWidth / 2) * 0.9;
  const endAngle = statAngle + (sliceWidth / 2) * 0.9;

  for (let i = 0; i < skillCount; i++) {
    const angle = startAngle + Math.random() * (endAngle - startAngle);
    const radius = innerRadius + (i / skillCount) * spread + Math.random() * 50;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    positions.push({ x, y, angle });
  }

  return positions;
}