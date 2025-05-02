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
  for (const stat in statNodes) {
    const center = statNodes[stat];
    const skills = Object.keys(skillsByStat[stat] || {});
    const coords = getBranchCoordinates(center.x, center.y, center.angle, skills.length, 100);

    coords.forEach((coord, idx) => {
      const skillName = skills[idx];
      if (!skillName) return;

      skillNodeMap.push({
        stat,
        skill: skillName,
        x: coord.x,
        y: coord.y,
        r: skillNodeRadius
      });

      ctx.beginPath();
      ctx.arc(coord.x, coord.y, skillNodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#999";
      ctx.fill();

      ctx.font = "10px Arial";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText(skillName, coord.x, coord.y - skillNodeRadius - 2);
    });
  }
}

export function getHoveredSkill(mouseX, mouseY, skillNodeMap) {
  for (const node of skillNodeMap) {
    const dx = mouseX - node.x;
    const dy = mouseY - node.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= node.r) {
      return node;
    }
  }
  return null;
}