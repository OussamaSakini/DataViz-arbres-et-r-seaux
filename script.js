// Dimensions du SVG
const margin = { top: 100, right: 50, bottom: 50, left: 100 },
    width = 960 - margin.left - margin.right,
    height = 960 - margin.top - margin.bottom;

// Ajout du SVG
const svg = d3.select("#visu-tp4")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Chargement des données
d3.json("https://lyondataviz.github.io/teaching/lyon1-m2/2024/data/got_social_graph.json").then(data => {
    const nodes = data.nodes;
    const links = data.links;

    // Multiplication des poids des liens par 10 pour renforcer la visibilité
    links.forEach(link => link.weight *= 10);

    // Échelles de positionnement
    const echellexy = d3.scaleBand()
        .domain(d3.range(nodes.length)) // Domaine basé sur le nombre de personnages
        .range([0, width]) // La largeur totale pour l'échelle
        .paddingInner(0.1)
        .align(0.5);

    // Échelle de couleurs pour les zones
    const zoneScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Création de la matrice d'adjacence avec symétrie
    const matrix = createAdjacencyMatrix(nodes, links, undefined, true);

    // Ajout des axes
    const rows = svg.append("g")
        .selectAll(".row-label")
        .data(nodes)
        .enter()
        .append("text")
        .attr("class", "row-label")
        .attr("x", -10)
        .attr("y", (d, i) => echellexy(i) + echellexy.bandwidth() / 2)
        .text(d => d.character)
        .style("font-size", "10px")
        .style("text-anchor", "end");

    const columns = svg.append("g")
        .selectAll(".column-label")
        .data(nodes)
        .enter()
        .append("text")
        .attr("class", "column-label")
        .attr("x", (d, i) => echellexy(i) + echellexy.bandwidth() / 2)
        .attr("y", -10)
        .text(d => d.character)
        .style("font-size", "10px")
        .style("text-anchor", "start")
        .attr("transform", (d, i) => `rotate(-90, ${echellexy(i) + echellexy.bandwidth() / 2}, -10)`);

    const matrixViz = svg.selectAll("rect")
        .data(matrix)
        .enter()
        .append("rect")
        .attr("x", d => echellexy(d.x))
        .attr("y", d => echellexy(d.y))
        .attr("width", echellexy.bandwidth())
        .attr("height", echellexy.bandwidth())
        .style("fill", d => (d.zone_s === d.zone_t ? zoneScale(d.zone_s) : "#eee"))
        .style("opacity", d => d.weight > 0 ? d.weight / 100 : 0)
        .style("stroke", "black")
        .style("stroke-width", ".2px");

function update(newPositions) {
    // Vérification des indices et réarrangement des nœuds
    const sortedNodes = newPositions.map(index => nodes[index]);

    console.log("Nouvelles positions triées :", sortedNodes.map(d => d.character));

    // Mise à jour du domaine de l'échelle
    echellexy.domain(newPositions);

    // Animation pour les noms des lignes (axes Y)
    rows.data(sortedNodes) // Associez les nouveaux nœuds triés
        .transition()
        .duration(1000)
        .attr("y", (d, i) => echellexy(i) + echellexy.bandwidth() / 2);

    // Animation pour les noms des colonnes (axes X)
    columns.data(sortedNodes) // Associez les nouveaux nœuds triés
        .transition()
        .duration(1000)
        .attr("x", (d, i) => echellexy(i) + echellexy.bandwidth() / 2)
        .attr("transform", (d, i) => `rotate(-90, ${echellexy(i) + echellexy.bandwidth() / 2}, -10)`);

    // Animation pour les rectangles de la matrice
    matrixViz.data(matrix) // Les données de la matrice restent inchangées
        .transition()
        .duration(1000)
        .attr("x", d => echellexy(d.x))
        .attr("y", d => echellexy(d.y));
}

// Gestion de l'événement de changement dans le menu
d3.select("#sort-options").on("change", function () {
    const sortValue = d3.select(this).property("value");
    if (sortValue === "appearances") {
        update(appearances);
    } else if (sortValue === "zones") {
        update(zones);
    } else if (sortValue === "influences") {
        update(influences);
    }
});


});

var appearances = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
  60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78,
  79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97,
  98, 99, 100, 101, 102, 103, 104, 105, 106,
];
var zones = [
  0, 1, 6, 16, 50, 67, 72, 73, 77, 78, 79, 80, 81, 83, 84, 85, 86, 87, 88, 11,
  18, 31, 32, 34, 35, 36, 39, 40, 66, 96, 97, 10, 17, 24, 25, 26, 27, 28, 29, 2,
  3, 4, 5, 7, 12, 14, 15, 21, 30, 33, 37, 38, 41, 43, 44, 45, 46, 47, 48, 49,
  68, 69, 70, 71, 74, 75, 76, 89, 90, 91, 92, 94, 95, 98, 99, 100, 101, 104,
  106, 42, 63, 64, 82, 93, 105, 8, 9, 13, 19, 20, 65, 103, 22, 23, 51, 52, 53,
  54, 55, 56, 57, 58, 59, 60, 61, 62, 102,
];
var influences = [
  4, 16, 41, 39, 2, 5, 12, 65, 3, 15, 66, 1, 10, 42, 102, 19, 6, 14, 103, 37,
  21, 11, 32, 34, 70, 7, 33, 38, 46, 49, 75, 9, 17, 22, 45, 56, 60, 68, 74, 81,
  20, 27, 30, 31, 44, 48, 67, 71, 77, 84, 93, 0, 13, 18, 24, 25, 29, 40, 43, 47,
  51, 52, 54, 55, 76, 80, 82, 85, 87, 88, 100, 35, 61, 72, 78, 79, 91, 92, 95,
  8, 26, 28, 36, 58, 73, 86, 90, 94, 97, 98, 104, 23, 50, 53, 57, 59, 62, 63,
  64, 69, 83, 89, 96, 99, 101, 105, 106,
];

// Fonction pour créer la matrice d'adjacence
function createAdjacencyMatrix(nodes, edges, positions = undefined, symetric = false) {
    const edgeHash = {};
    edges.forEach(edge => {
        edgeHash[`${edge.source}-${edge.target}`] = edge;
    });

    const matrix = [];
    nodes.forEach((nodeA, i) => {
        nodes.forEach((nodeB, j) => {
            const id = `${nodeA.id}-${nodeB.id}`;
            const edge = edgeHash[id];
            const grid = {
                id: id,
                x: i,
                y: j,
                weight: edge ? edge.weight : 0,
                name_s: nodeA.character,
                name_t: nodeB.character,
                zone_s: nodeA.zone,
                zone_t: nodeB.zone,
            };
            if (symetric && edgeHash[`${nodeB.id}-${nodeA.id}`]) {
                grid.weight += edgeHash[`${nodeB.id}-${nodeA.id}`].weight;
            }
            matrix.push(grid);
        });
    });
    return matrix;
}
