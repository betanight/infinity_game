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

export function drawSkillNodes(ctx, statNodes, skillsByStat, skillNodeRadius, skillNodeMap) {
  for (const stat in skillsByStat) {
    const statCenter = statNodes[stat];
    if (!statCenter) continue;

    const skillNames = Object.keys(skillsByStat[stat]);
    const scatteredPositions = getScatteredSkillPositions(
      statCenter.angle,
      skillNames.length
    );

    skillNames.forEach((skill, i) => {
      const { x, y } = scatteredPositions[i];

      ctx.beginPath();
      ctx.arc(x, y, skillNodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "lightgray";
      ctx.fill();

      skillNodeMap.push({ x, y, stat, skill });
    });
  }
}

export function getHoveredSkill(mouseX, mouseY, skillNodeMap) {
  for (const node of skillNodeMap) {
    const dx = mouseX - node.x;
    const dy = mouseY - node.y;
    if (Math.sqrt(dx * dx + dy * dy) <= node.r) {
      return node;
    }
  }
  return null;
}

export function getScatteredSkillPositions(statAngle, skillCount, innerRadius = 150, outerRadius = 400) {
  const positions = [];
  const sliceWidth = (Math.PI * 2) / 10;
  const startAngle = statAngle - sliceWidth / 2;
  const endAngle = statAngle + sliceWidth / 2;
  const minDistance = 40;

  for (let i = 0; i < skillCount; i++) {
    let tries = 0;
    let placed = false;

    while (!placed && tries < 100) {
      const angle = startAngle + Math.random() * (endAngle - startAngle);
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      let valid = true;
      for (const pos of positions) {
        const dx = x - pos.x;
        const dy = y - pos.y;
        if (Math.sqrt(dx * dx + dy * dy) < minDistance) {
          valid = false;
          break;
        }
      }

      if (valid) {
        positions.push({ x, y, angle });
        placed = true;
      }

      tries++;
    }
  }

  return positions;
}
