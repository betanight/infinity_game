(async () => {
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

  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();

  const snapshot = await db.ref("template/skills").once("value");
  const skillData = snapshot.val();

  const nodes = [];
  for (const stat in skillData) {
    nodes.push({ id: stat, parentIds: [], title: stat });
    const skillGroup = skillData[stat];
    for (const skill in skillGroup) {
      nodes.push({
        id: `${stat}-${skill}`,
        parentIds: [stat],
        title: skill
      });
    }
  }

  const dag = d3dag.dagStratify()(nodes);
  const nodeRadius = 20;

  const layout = d3dag.sugiyama()
    .decross(d3dag.decrossTwoLayer())
    .nodeSize(() => [2 * Math.PI / dag.size(), 100])
    .coord(d3dag.coordRadial());

  const { width, height } = layout(dag);

  const svgSelection = d3.select("svg");
  svgSelection.attr("viewBox", [-width / 2, -height / 2, width, height].join(" "));
  const defs = svgSelection.append("defs");

  const steps = dag.size();
  const interp = d3.interpolateRainbow;
  const colorMap = new Map();
  for (const [i, node] of dag.idescendants().entries()) {
    colorMap.set(node.data.id, interp(i / steps));
  }

  const line = d3.lineRadial()
    .curve(d3.curveCatmullRom)
    .angle(d => d.x)
    .radius(d => d.y);

  svgSelection.append("g")
    .selectAll("path")
    .data(dag.links())
    .enter()
    .append("path")
    .attr("d", ({ points }) => line(points))
    .attr("fill", "none")
    .attr("stroke-width", 2)
    .attr("stroke", ({ source, target }) => {
      const gradId = encodeURIComponent(`${source.data.id}--${target.data.id}`);
      const grad = defs.append("linearGradient")
        .attr("id", gradId)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", source.x)
        .attr("x2", target.x)
        .attr("y1", source.y)
        .attr("y2", target.y);
      grad.append("stop").attr("offset", "0%").attr("stop-color", colorMap.get(source.data.id));
      grad.append("stop").attr("offset", "100%").attr("stop-color", colorMap.get(target.data.id));
      return `url(#${gradId})`;
    });

  const nodesGroup = svgSelection.append("g")
    .selectAll("g")
    .data(dag.descendants())
    .enter()
    .append("g")
    .attr("transform", d => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`);

  nodesGroup.append("circle")
    .attr("r", nodeRadius)
    .attr("fill", d => colorMap.get(d.data.id));

  nodesGroup.append("text")
    .text(d => d.data.title)
    .attr("dy", "0.35em")
    .attr("x", 0)
    .attr("text-anchor", "middle")
    .attr("transform", d => (d.x > Math.PI ? "rotate(180)" : null))
    .attr("fill", "white");
})();
