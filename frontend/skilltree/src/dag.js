import * as d3 from 'd3';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "infinity-e0f55.firebaseapp.com",
  databaseURL: "https://infinity-e0f55-default-rtdb.firebaseio.com",
  projectId: "infinity-e0f55",
  storageBucket: "infinity-e0f55.appspot.com",
  messagingSenderId: "120929977477",
  appId: "1:120929977477:web:45dc9989f834f69a9195ec",
  measurementId: "G-PFFQDN2MHX"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

(async () => {
  const snapshot = await get(ref(db, 'template/skills'));
  const skillData = snapshot.val();

  const statList = [
    "Constitution", "Willpower", "Spirit", "Presence", "Dexterity",
    "Strength", "Instinct", "Intelligence", "Wisdom"
  ];
  const nodes = [];
  const links = [];

  statList.forEach((stat) => {
    nodes.push({ id: stat, isStat: true, title: stat });
    const skills = Object.keys(skillData[stat]);
    for (let j = 0; j < skills.length; j++) {
      const skill = skills[j];
      const nodeId = `${stat}-${skill}`;
      nodes.push({
        id: nodeId,
        title: skill,
        stat: stat,
        description: skillData[stat][skill]?.description || '',
        isStat: false,
        index: j,
        count: skills.length
      });
      links.push({ source: stat, target: nodeId });
    }
  });

  const width = 2500;
  const height = 2500;
  const svg = d3.select("svg")
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
    const node = nodes.find(n => n.id === stat);
    node.angle = angle;
    node.radius = statRadius;
    node.x = width / 2 + Math.cos(angle) * statRadius;
    node.y = height / 2 + Math.sin(angle) * statRadius;
  });

  const skillCounts = statList.map(stat => Object.keys(skillData[stat]).length);
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

  container.append("g")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("x1", d => nodes.find(n => n.id === d.source).x)
    .attr("y1", d => nodes.find(n => n.id === d.source).y)
    .attr("x2", d => nodes.find(n => n.id === d.target).x)
    .attr("y2", d => nodes.find(n => n.id === d.target).y)
    .attr("stroke", d => color(d.source))
    .attr("stroke-width", 1);

  const nodeGroup = container.append("g")
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g")
    .attr("transform", d => `translate(${d.x},${d.y})`);

  nodeGroup.append("circle")
    .attr("r", d => d.isStat ? 20 : 5.5)
    .attr("fill", d => color(d.stat || d.id))
    .on("mouseover", function (event, d) {
      if (!d.isStat) {
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("background", "#222")
          .style("color", "#fff")
          .style("padding", "6px 10px")
          .style("border-radius", "6px")
          .style("pointer-events", "none")
          .style("font-size", "13px")
          .html(`<strong>${d.title}</strong><br>${d.description}`);
        tooltip.style("left", `${event.pageX + 12}px`)
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

  nodeGroup.append("text")
    .text(d => d.isStat ? d.title : "")
    .attr("dy", "-1.7em")
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-weight", "bold")
    .attr("font-size", "16px")
    .attr("transform", "rotate(0)");

  const zoom = d3.zoom()
    .scaleExtent([0.1, 3])
    .on("zoom", (event) => {
      container.attr("transform", event.transform);
    });

  svg.call(zoom);

  const scale = 1.7;
  setTimeout(() => {
      const statNodes = nodes.filter(n => n.isStat);
      const avgX = d3.mean(statNodes, d => d.x);
      const avgY = d3.mean(statNodes, d => d.y);
      const tx = (width / 2) - avgX * scale;
      const ty = (height / 2) - avgY * scale;
    svg.call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
  }, 100);
})();