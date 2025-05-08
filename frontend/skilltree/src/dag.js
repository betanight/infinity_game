import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.8.5/+esm";

export async function renderSkillTree(characterData) {
  const response = await fetch(
    "https://infinity-e0f55-default-rtdb.firebaseio.com/template.json"
  );
  const template = await response.json();
  const skillData = template.skills;
  console.log("Fetched skillData:", skillData);

  const statList = [
    "Constitution",
    "Willpower",
    "Spirit",
    "Presence",
    "Dexterity",
    "Strength",
    "Instinct",
    "Intelligence",
    "Wisdom",
  ];

  const nodes = [];
  const links = [];

  statList.forEach((stat) => {
    nodes.push({ id: stat, isStat: true, title: stat });
    const skills = Object.keys(skillData[stat]);
    for (let j = 0; j < skills.length; j++) {
      const skill = skills[j];
      const value = characterData.skills?.[stat]?.[skill] || 0;
      nodes.push({
        id: `${stat}-${skill}`,
        title: skill,
        stat: stat,
        description: skillData[stat][skill]?.description || "",
        isStat: false,
        value,
        index: j,
        count: skills.length,
      });
      links.push({ source: stat, target: `${stat}-${skill}` });
    }
  });

  const width = 2500;
  const height = 2500;
  const svg = d3
    .select("svg")
    .attr("viewBox", [0, 0, width, height].join(" "))
    .style("background", "#111");

  const container = svg.append("g").attr("class", "zoom-container");
  const color = d3.scaleOrdinal(d3.schemeTableau10);

  const statRadius = 250;
  const skillRadiusStart = 240;
  const skillSpacing = 30;

  const statAngleMap = {};
  const maxFanWidth = Math.PI / 4.5;
  const minFanWidth = Math.PI / 5;

  const angleStep = (2 * Math.PI) / statList.length;
  statList.forEach((stat, i) => {
    const angle = i * angleStep;
    statAngleMap[stat] = angle;
    const node = nodes.find((n) => n.id === stat);
    node.angle = angle;
    node.radius = statRadius;
    node.x = width / 2 + Math.cos(angle) * statRadius;
    node.y = height / 2 + Math.sin(angle) * statRadius;
  });

  const skillCounts = statList.map(
    (stat) => Object.keys(skillData[stat]).length
  );
  const maxSkills = Math.max(...skillCounts);
  const minSkills = Math.min(...skillCounts);

  nodes.forEach((node) => {
    if (!node.isStat) {
      const statAngle = statAngleMap[node.stat];
      const count = node.count;
      const norm = (count - minSkills) / (maxSkills - minSkills + 1e-6);
      const fanWidth = maxFanWidth - (maxFanWidth - minFanWidth) * norm;
      const offset = (node.index - (count - 1) / 2) * (fanWidth / count);
      const angle = statAngle + offset;
      const radius = skillRadiusStart + node.index * skillSpacing;
      node.angle = angle;
      node.radius = radius;
      node.x = width / 2 + Math.cos(angle) * radius;
      node.y = height / 2 + Math.sin(angle) * radius;
    }
  });

  container
    .append("g")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("x1", (d) => nodes.find((n) => n.id === d.source).x)
    .attr("y1", (d) => nodes.find((n) => n.id === d.source).y)
    .attr("x2", (d) => nodes.find((n) => n.id === d.target).x)
    .attr("y2", (d) => nodes.find((n) => n.id === d.target).y)
    .attr("stroke", (d) => {
      const targetNode = nodes.find((n) => n.id === d.target);
      return targetNode.value > 0 ? color(d.source) : "#666";
    })
    .attr("stroke-width", 1);

  const nodeGroup = container
    .append("g")
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${d.x},${d.y})`);

  nodeGroup
    .append("circle")
    .attr("r", (d) => (d.isStat ? 20 : 5.5))
    .attr("fill", (d) => {
      if (d.isStat) return color(d.id); // Stat nodes keep color
      return d.value > 0 ? color(d.stat) : "#666"; // Skill nodes
    })
    .on("mouseover", function (event, d) {
      if (!d.isStat) {
        const tooltip = d3
          .select("body")
          .append("div")
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("background", "#222")
          .style("color", "#fff")
          .style("padding", "6px 10px")
          .style("border-radius", "6px")
          .style("pointer-events", "none")
          .style("font-size", "13px")
          .html(`<strong>${d.title}</strong><br>${d.description}`);
        tooltip
          .style("left", `${event.pageX + 12}px`)
          .style("top", `${event.pageY + 12}px`);
      }
    })
    .on("mousemove", function (event) {
      d3.select(".tooltip")
        .style("left", `${event.pageX + 12}px`)
        .style("top", `${event.pageY + 12}px`);
    })
    .on("mouseout", function () {
      d3.select(".tooltip").remove();
    });

  nodeGroup
    .append("text")
    .text((d) => (d.isStat ? d.title : ""))
    .attr("dy", "-1.7em")
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-weight", "bold")
    .attr("font-size", "16px")
    .attr("transform", "rotate(0)");

  const zoom = d3
    .zoom()
    .scaleExtent([0.1, 3])
    .on("zoom", (event) => {
      container.attr("transform", event.transform);
    });

  svg.call(zoom);

  const scale = 1.7;
  setTimeout(() => {
    const statNodes = nodes.filter((n) => n.isStat);
    const avgX = d3.mean(statNodes, (d) => d.x);
    const avgY = d3.mean(statNodes, (d) => d.y);
    const tx = width / 2 - avgX * scale;
    const ty = height / 2 - avgY * scale;
    svg.call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
  }, 100);

  // Calculate total skill points
  let totalPoints = 0;
  Object.values(characterData.skills || {}).forEach((skillGroup) => {
    Object.values(skillGroup).forEach((val) => {
      totalPoints += val;
    });
  });

  // Display name and points at center
  container
    .append("text")
    .attr("x", width / 2)
    .attr("y", height / 2 - 20)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", "24px")
    .attr("font-weight", "bold")
    .text(characterData.meta?.character_id || "Unnamed Character");

  container
    .append("rect")
    .attr("x", width / 2 - 30)
    .attr("y", height / 2 + 10)
    .attr("width", 60)
    .attr("height", 30)
    .attr("fill", "#222")
    .attr("stroke", "white")
    .attr("rx", 5)
    .attr("ry", 5);

  container
    .append("text")
    .attr("x", width / 2)
    .attr("y", height / 2 + 30)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", "16px")
    .text(`${totalPoints}/6`);
}
