document.addEventListener("DOMContentLoaded", () => {

    let mutantsData = {};

    fetch("mutants.json")
        .then(response => response.json())
        .then(data => {
            mutantsData = data;
            fillMutantsTable(); // Llenamos la tabla después de cargar los datos
        })
        .catch(error => console.error("❌ Error loading JSON:", error));
    
    function getAbilityImageTxT(abilityName) {
        const abilityImages = {
            "Boost": "images/boost.png",
            "Retaliate": "images/retaliate.png",
            "Weaken": "images/weaken.png",
            "Wound": "images/wound.png",
            "Regeneration": "images/regeneration.png",
            "Shield": "images/shield.png"
        };
        
        return `<img src="${abilityImages[abilityName]}" alt="${abilityName}" width="40">`;
    }

    // Función para llenar la tabla con los datos de los mutantes
    function fillMutantsTable() {
        const tableBody = document.querySelector("#mutantsAll tbody");
        tableBody.innerHTML = '';  // Limpiar la tabla antes de llenarla

        // Verifica si mutantsData tiene datos
        if (Object.keys(mutantsData).length === 0) {
            console.error("No mutants data found!");
            return;
        }

        // Recorre cada mutante y agrega una fila
        Object.values(mutantsData).forEach(mutant => {
            const row = document.createElement("tr");

            // Determinar la URL de la imagen según el tipo
            let mutantImageUrl;
            if (["Legendary", "Heroic", "Bingo", "Secret", "PvP"].includes(mutant.type)) {
                mutantImageUrl = `https://s-ak.kobojo.com/mutants/assets/thumbnails/specimen_${mutant.id.toLowerCase()}_platinum.png`;
            } else if (["Exclusive", "Seasonal", "VideoGame", "Gacha"].includes(mutant.type)) {
                mutantImageUrl = `https://s-ak.kobojo.com/mutants/assets/thumbnails/specimen_${mutant.id.toLowerCase()}.png`;
            } else if (mutant.type === "Zodiac") {
                mutantImageUrl = `https://s-ak.kobojo.com/mutants/assets/thumbnails/specimen_${mutant.id.toLowerCase()}_silver.png`;
            }

            // Determinar la URL de la imagen de tipo
            let typeImageUrl = '';
            if (mutant.type === "Legendary") {
                typeImageUrl = "images/legend.png";
            } else if (mutant.type === "Heroic") {
                typeImageUrl = "images/heroic.png";
            } else if (mutant.type === "Exclusive") {
                typeImageUrl = "images/exclusive.png";
            } else if (mutant.type === "Seasonal") {
                typeImageUrl = "images/seasonal.png";
            } else if (mutant.type === "VideoGame") {
                typeImageUrl = "images/videogame.png";
            } else if (mutant.type === "Zodiac") {
                typeImageUrl = "images/zodiac.png";
            } else if (mutant.type === "Gacha") {
                typeImageUrl = "images/gacha.png";
            } else if (mutant.type === "PvP") {
                typeImageUrl = "images/pvp.png";
            } else if (mutant.type === "Bingo") {
                typeImageUrl = "images/bingo.png";
            } else if (mutant.type === "Secret") {
                typeImageUrl = "images/secret.png";
            }

            // Aquí extraemos los genes de la ID del mutante
            const mutantIdPrefix = mutant.id.split("_")[0].toLowerCase();
            const atk1Letter = mutantIdPrefix.charAt(0); // La primera letra del ID
            const atk2Letter = mutantIdPrefix.charAt(1); // La segunda letra del ID (si existe)

            // Si el mutante tiene más de una letra en el ID, mostramos dos imágenes
            let geneImages = '';
            if (atk2Letter) {
                // Si hay dos letras, mostramos ambas
                geneImages = `
                    <img src="images/gene_${atk1Letter}.png" alt="Gene 1" width="30">
                    <img src="images/gene_${atk2Letter}.png" alt="Gene 2" width="30">
                `;
            } else {
                // Si solo hay una letra, mostramos solo esa imagen
                geneImages = `<img src="images/gene_${atk1Letter}.png" alt="Gene" width="30">`;
            }

            let rawLife, rawAtk1p, rawAtk2p, rawAbility;

            // Si el mutante es de tipo "Gacha", el cálculo es diferente
            if (mutant.type === "Gacha") {
                rawLife = mutant.life * ((25 / 10) + 0.9) * 2;
                rawAtk1p = mutant.atk1p * ((25 / 10) + 0.9) * 2;
                rawAtk2p = mutant.atk2p * ((25 / 10) + 0.9) * 2;
                rawAbility = mutant.abilityp / 100 * mutant.atk1p * ((25 / 10) + 0.9) * 2;
            } else if (mutant.type === "Exclusive" || mutant.type === "VideoGame" || mutant.type === "Seasonal"){
                rawLife = mutant.life * ((25 / 10) + 0.9);
                rawAtk1p = mutant.atk1p * ((25 / 10) + 0.9);
                rawAtk2p = mutant.atk2p * ((25 / 10) + 0.9);
                rawAbility = mutant.abilityp  / 100 * mutant.atk1p * ((25 / 10) + 0.9);
            }else if (mutant.type === "Zodiac"){
                rawLife = mutant.life * ((25 / 10) + 0.9) * 1.3;
                rawAtk1p = mutant.atk1p * ((25 / 10) + 0.9) * 1.3;
                rawAtk2p = mutant.atk2p * ((25 / 10) + 0.9) * 1.3;
                rawAbility = mutant.abilityp  / 100 * mutant.atk1p * ((25 / 10) + 0.9);
            } else {
                rawLife = mutant.life * ((25 / 10) + 0.9) * 2;
                rawAtk1p = mutant.atk1p * ((25 / 10) + 0.9) * 2;
                rawAtk2p = mutant.atk2p * ((25 / 10) + 0.9) * 2;
                rawAbility = mutant.abilityp  / 100 * mutant.atk1p * ((25 / 10) + 0.9) *  2;
            }

            // Redondear los resultados a números enteros
            rawLife = parseInt(rawLife);
            rawAtk1p = parseInt(rawAtk1p);
            rawAtk2p = parseInt(rawAtk2p);
            rawAbility = parseInt(rawAbility);

            // Agregar fila sin la columna ID
            row.innerHTML = `
                <td><img src="${mutantImageUrl}" alt="${mutant.name}" width="50"></td>
                <td>${mutant.name}</td>
                <td>${mutant.nameEsp}</td>
                <td>${geneImages}</td>
                <td><img src="${typeImageUrl}" alt="${mutant.type}" width="40"></td>
                <td>${getAbilityImageTxT(mutant.nameAbility)}</td>
                <td>${mutant.abilityp}<p>%</p></td>
                <td>${rawLife}</td>
                <td>${rawAtk1p}</td>
                <td>${rawAtk2p}</td>
                <td>${mutant.speed}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    window.sortTable = function(columnIndex) {
        const table = document.getElementById("mutantsAll");
        const rows = Array.from(table.querySelectorAll("tbody tr"));
        const ascending = table.querySelectorAll("th")[columnIndex].classList.contains('ascending');

        // Ordenar las filas según el contenido de la columna seleccionada
        rows.sort((rowA, rowB) => {
            const cellA = rowA.children[columnIndex].innerText;
            const cellB = rowB.children[columnIndex].innerText;

            // Convertir a números si es posible (para columnas Life, Atk1p, Atk2p, Speed)
            const valueA = isNaN(cellA) ? cellA : parseFloat(cellA);
            const valueB = isNaN(cellB) ? cellB : parseFloat(cellB);

            // Comparar los valores
            if (valueA < valueB) return ascending ? 1 : -1;
            if (valueA > valueB) return ascending ? -1 : 1;
            return 0;
        });

        // Volver a agregar las filas al cuerpo de la tabla
        rows.forEach(row => table.querySelector("tbody").appendChild(row));

        // Alternar la clase 'ascending' en el encabezado
        table.querySelectorAll("th").forEach(th => th.classList.remove('ascending', 'descending'));
        table.querySelectorAll("th")[columnIndex].classList.add(ascending ? 'descending' : 'ascending');
    }

});
