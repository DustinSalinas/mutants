document.addEventListener("DOMContentLoaded", () => {
    const mutantNameInput = document.getElementById("mutantName");
    const starLevelContainer = document.getElementById("starLevelContainer");
    const starLevelSelect = document.getElementById("starLevel");
    const calculateBtn = document.getElementById("calculateBtn");
    const newMutantBtn = document.getElementById("newMutantBtn");
    const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));
    const resultsDiv = document.getElementById("results");

    let mutantsData = {};

    const starBonuses = {
        "Bronze": 1.1,
        "Silver": 1.3,
        "Gold": 1.75,
        "Platinum": 2,
        "Gacha": 2
    };

    fetch("mutants.json")
        .then(response => response.json())
        .then(data => {
            mutantsData = data;
            fillMutantsTable();
        })
        .catch(error => console.error("❌ Error loading JSON:", error));

    // Buscar mutante por ID o nombre
    function findMutant(query) {
        return Object.values(mutantsData).find(mutant => mutant.name.toLowerCase() === query.toLowerCase() || mutant.nameEsp.toLowerCase() === query.toLowerCase());
    }

    // Buscar mutantes por nombre (mostrando el contenedor de estrellas)
    mutantNameInput.addEventListener("input", () => {
        const inputValue = mutantNameInput.value.trim().toLowerCase();
        if (inputValue) {
            const mutant = findMutant(inputValue);
            if (mutant) {
                starLevelContainer.style.display = "block";  // Mostrar el contenedor de estrellas
                updateStarLevels(mutant);  // Actualizar las estrellas disponibles
            } else {
                starLevelContainer.style.display = "none";
            }
        } else {
            starLevelContainer.style.display = "none";  // Ocultar el contenedor de estrellas si no hay nombre
        }
    });

    // Actualizar niveles de estrellas solo si el mutante tiene el tipo Gacha
    function updateStarLevels(mutant) {
        starLevelSelect.innerHTML = ""; // Limpiar las opciones previas
        if (mutant.stars) {
            if (mutant.name === "Vivaldi" || mutant.nameEsp === "Vivaldi") {
                // Si el mutante es de tipo Gacha, solo mostrar la opción "Gacha"
                const seasons = ["Base", "Spring", "Autumn", "Winter", "Summer", "Seasonal"];
                seasons.forEach(season => {
                    const option = document.createElement("option");
                    option.value = season;
                    option.textContent = season;
                    starLevelSelect.appendChild(option);
                });
            }else if (mutant.type === "Gacha") {
                // Si el mutante es de tipo Gacha, solo mostrar la opción "Gacha"
                const option = document.createElement("option");
                option.value = "Gacha";
                option.textContent = "Gacha";
                starLevelSelect.appendChild(option);
            } else {
                // Si el mutante no es de tipo Gacha, mostrar las estrellas tradicionales
                mutant.stars.forEach(star => {
                    const option = document.createElement("option");
                    option.value = star;
                    option.textContent = star;
                    starLevelSelect.appendChild(option);
                });
            }
        } else {
            // Si el mutante no tiene estrellas definidas
            starLevelSelect.innerHTML = "<option>No Stars Available</option>"; 
        }
    }

    // Calcular y mostrar resultados al presionar "Calculate"
    calculateBtn.addEventListener("click", () => {
        const query = mutantNameInput.value.trim();  // Buscar por nombre
        const mutant = findMutant(query);
        const levelInput = document.getElementById("levelInput").value;
        const level = parseInt(levelInput);

        if (mutant && !isNaN(level) && level > 0) {
            displayResults(mutant, level);
            resultsModal.show();
        } else {
            alert("❌ Mutant not found or invalid level!");
        }
    });

    // Mostrar resultados
    function displayResults(mutant, level) {
        // Mostrar la imagen correspondiente al tipo del mutante
        let typeImage;
        if (mutant.type === "Legendary") {
            typeImage = "images/legend.png";
        } else if (mutant.type === "Heroic") {
            typeImage = "images/heroic.png";
        } else if (mutant.type === "Seasonal") {
            typeImage = "images/seasonal.png";
        } else if (mutant.type === "Exclusive") {
            typeImage = "images/exclusive.png";
        } else if (mutant.type === "Secret") {
            typeImage = "images/secret.png";
        } else if (mutant.type === "VideoGame") {
            typeImage = "images/videogame.png";
        } else if (mutant.type === "Zodiac") {
            typeImage = "images/zodiac.png";
        } else if (mutant.type === "Gacha") {
            typeImage = "images/gacha.png";
        } else if (mutant.type === "PvP") {
            typeImage = "images/pvp.png";
        } else if (mutant.type === "Bingo") {
            typeImage = "images/bingo.png";
        } else if (mutant.type === "Community") {
            typeImage = "images/community.png";
        }

        const mutantIdPrefix = mutant.id.split("_")[0].toLowerCase();
        const atk1Letter = mutantIdPrefix.charAt(0); // La primera letra del ID
        const atk2Letter = mutantIdPrefix.charAt(1); // La segunda letra del ID (si existe)

        // Define los grupos de IDs especiales
        const invertedGeneIds = ["EC_13"]; // Genes invertidos
        const doubleNeutralIds = ["FF_05"]; // Dos ataques neutros
        const GenIdMissy = ["CA_99"]; // Para Missy
        const invertedSingleGeneIds = ["D_13"]; // Un solo gen, pero visualmente invertido
        const doubleSameGeneIds = ["C_14", "E_13"]; // Un solo gen repetido normalmente
        
        let gene1Images = '';
        let gene2Images = '';
        
        if (doubleNeutralIds.includes(mutant.id)) {
            // Dos ataques neutros
            gene1Images = `<img src="images/gene_all.png" alt="Gene 1" width="30">`;
            gene2Images = `<img src="images/gene_all.png" alt="Gene 2" width="30">`;
        
        } else if (invertedGeneIds.includes(mutant.id)) {
            // Genes invertidos
            gene1Images = `<img src="images/gene_${atk2Letter}.png" alt="Gene 1" width="30">`;
            gene2Images = `<img src="images/gene_${atk1Letter}.png" alt="Gene 2" width="30">`;
        
        } else if (GenIdMissy.includes(mutant.id)) {
            // Genes invertidos
            gene1Images = `<img src="images/gene_${atk2Letter}.png" alt="Gene 1" width="30">`;
            gene2Images = `<img src="images/gene_e.png" alt="Gene 2" width="30">`;
        
        } else if (invertedSingleGeneIds.includes(mutant.id)) {
            // Un solo gen mostrado invertido (repite pero visualmente invertido)
            gene1Images = `<img src="images/gene_all.png" alt="Gene 1" width="30">`;
            gene2Images = `<img src="images/gene_${atk1Letter}.png" alt="Gene 2" width="30">`;
        
        } else if (doubleSameGeneIds.includes(mutant.id)) {
            // Mismo gen dos veces, mostrado normalmente
            gene1Images = `<img src="images/gene_${atk1Letter}.png" alt="Gene 1" width="30">`;
            gene2Images = `<img src="images/gene_${atk1Letter}.png" alt="Gene 2" width="30">`;
        
        } else if (atk2Letter) {
            // Dos genes diferentes
            gene1Images = `<img src="images/gene_${atk1Letter}.png" alt="Gene 1" width="30">`;
            gene2Images = `<img src="images/gene_${atk2Letter}.png" alt="Gene 2" width="30">`;
        
        } else {
            // Un solo gen (por defecto muestra uno y gene_all)
            gene1Images = `<img src="images/gene_${atk1Letter}.png" alt="Gene 1" width="30">`;
            gene2Images = `<img src="images/gene_all.png" alt="Gene 2" width="30">`;
        }

        // Calculamos las estadísticas basadas en las estrellas seleccionadas
        const starLevel = starLevelSelect.value;
        const bonus = starBonuses[starLevel] || 0;  // Si no se selecciona ninguna estrella, bonus será 0
        
        let rawLife, rawAtk1p, rawAtk2p, rawAbility;

        // Si el mutante es de tipo "Gacha", el cálculo es diferente
        if (mutant.name === "Vivaldi" || mutant.nameEsp === "Vivaldi") {
            // Lógica de estadísticas base para Vivaldi dependiendo de la estación
            switch (starLevel) {
                case "Spring":
                    rawLife = 2925 * ((level / 10) + 0.9); 
                    rawAtk1p = 1055 * ((level / 10) + 0.9);
                    rawAtk2p = 1055 * ((level / 10) + 0.9);
                    if (level < 25) {
                        rawAbility = mutant.ability / 100 * 1055 * ((level / 10) + 0.9);
                    } else {
                        rawAbility = mutant.abilityp / 100 * 1055 * ((level / 10) + 0.9);
                    }
                    break;
                case "Summer":
                    rawLife = 3014 * ((level / 10) + 0.9);
                    rawAtk1p = 1024 * ((level / 10) + 0.9);
                    rawAtk2p = 1024 * ((level / 10) + 0.9);
                    if (level < 25) {
                        rawAbility = mutant.ability / 100 * 1024 * ((level / 10) + 0.9);
                    } else {
                        rawAbility = mutant.abilityp / 100 * 1024 * ((level / 10) + 0.9);
                    }
                    break;
                case "Autumn":
                    rawLife = 2836 * ((level / 10) + 0.9);
                    rawAtk1p = 1086 * ((level / 10) + 0.9);
                    rawAtk2p = 1086 * ((level / 10) + 0.9);
                    if (level < 25) {
                        rawAbility = mutant.ability / 100 * 1086 * ((level / 10) + 0.9);
                    } else {
                        rawAbility = mutant.abilityp / 100 * 1086 * ((level / 10) + 0.9);
                    }
                    break;
                case "Winter":
                    rawLife = 3191 * ((level / 10) + 0.9);
                    rawAtk1p = 960 * ((level / 10) + 0.9);
                    rawAtk2p = 960 * ((level / 10) + 0.9);
                    if (level < 25) {
                        rawAbility = mutant.ability / 100 * 960 * ((level / 10) + 0.9);
                    } else {
                        rawAbility = mutant.abilityp / 100 * 960 * ((level / 10) + 0.9);
                    }
                    break;
                case "Winter Bug":
                    rawLife = 3191 * ((level / 10) + 0.9) * 1.75;
                    rawAtk1p = 960 * ((level / 10) + 0.9) * 1.75;
                    rawAtk2p = 960 * ((level / 10) + 0.9) * 1.75;
                    if (level < 25) {
                        rawAbility = mutant.ability / 100 * 960 * ((level / 10) + 0.9) * 1.75;
                    } else {
                        rawAbility = mutant.abilityp / 100 * 960 * ((level / 10) + 0.9) * 1.75;
                    }
                    break;
                case "Seasonal":
                    rawLife = 2600 * ((level / 10) + 0.9);
                    rawAtk1p = 1170 * ((level / 10) + 0.9);
                    rawAtk2p = 1170 * ((level / 10) + 0.9);
                    if (level < 25) {
                        rawAbility = mutant.ability / 100 * 1170 * ((level / 10) + 0.9);
                    } else {
                        rawAbility = mutant.abilityp / 100 * 1170 * ((level / 10) + 0.9);
                    }
                    break;
                case "Base":
                    rawLife = mutant.life * ((level / 10) + 0.9);
                    rawAtk1p = mutant.atk1p * ((level / 10) + 0.9);
                    rawAtk2p = mutant.atk2p * ((level / 10) + 0.9);
                    if (level < 25) {
                        rawAbility = mutant.ability / 100 * mutant.atk1p * ((level / 10) + 0.9);
                    } else {
                        rawAbility = mutant.abilityp / 100 * mutant.atk1p * ((level / 10) + 0.9);
                    }
                    break;
            }
        } else if (mutant.type === "Gacha") {
            // Extra lógica para el cálculo de Gacha (esto es solo un ejemplo)
            rawLife = mutant.life * ((level / 10) + 0.9) * bonus; // Multiplicador extra para Gacha
            rawAtk1p = mutant.atk1p * ((level / 10) + 0.9) * bonus;
            rawAtk2p = mutant.atk2p * ((level / 10) + 0.9) * bonus;
            if (level < 25) {
                rawAbility = mutant.ability / 100 * mutant.atk1p * ((level / 10) + 0.9) * bonus;
            } else {
                rawAbility = mutant.abilityp / 100 * mutant.atk1p * ((level / 10) + 0.9) * bonus;
            }
        } else {
            // Calcula los valores normales para mutantes no-Gacha
            if (starLevel === "No Star" || !starLevel) {
                rawLife = mutant.life * ((level / 10) + 0.9);
                rawAtk1p = mutant.atk1p * ((level / 10) + 0.9);
                rawAtk2p = mutant.atk2p * ((level / 10) + 0.9);
                if (level < 25) {
                    rawAbility = mutant.ability / 100 * mutant.atk1p * ((level / 10) + 0.9);
                } else {
                    rawAbility = mutant.abilityp / 100 * mutant.atk1p * ((level / 10) + 0.9);
                }
            } else {
                // Si se selecciona una estrella, aplicar el bonus de estrella
                rawLife = mutant.life * ((level / 10) + 0.9) * bonus;
                rawAtk1p = mutant.atk1p * ((level / 10) + 0.9) * bonus;
                rawAtk2p = mutant.atk2p * ((level / 10) + 0.9) * bonus;
                if (level < 25) {
                    rawAbility = mutant.ability / 100 * mutant.atk1p * ((level / 10) + 0.9) * bonus;
                } else {
                    rawAbility = mutant.abilityp  / 100 * mutant.atk1p * ((level / 10) + 0.9) *  bonus;
                }
            }
        }

        // Redondear los resultados a números enteros
        rawLife = parseInt(rawLife);
        rawAtk1p = parseInt(rawAtk1p);
        rawAtk2p = parseInt(rawAtk2p);
        rawAbility = parseInt(rawAbility);

        // Mostrar los resultados en el modal
        resultsDiv.innerHTML = ` 
            <img src="${mutant.image}" alt="${mutant.name}" width="100" id="mutantImage"><br> 
            <strong>Name:</strong> ${mutant.name}<br> 
            <img src="${typeImage}" alt="Type" width="50"><br> 
            <strong>Level:</strong> ${level}<br> 
            <img src="images/life_icon.png" alt="Life" width="30"> ${rawLife}<br> 
            <img src="${getAbilityImage(mutant.nameAbility)}" width="35">${rawAbility}<br>
            ${gene1Images} ${rawAtk1p}<br>
            ${gene2Images} ${rawAtk2p}<br> 
            <img src="images/speed_icon.png" alt="Speed" width="30"> ${mutant.speed}<br>
        `;

        // Colocar la imagen del mutante con el id 'mutantImage' dentro del modal
        const mutantImage = document.getElementById("mutantImage");
        updateMutantImage(starLevel, mutantImage, mutant); // Llamamos a la función que actualizará la imagen
    }

    // Función para obtener la imagen de la habilidad según el nombre de la habilidad
    function getAbilityImage(abilityName) {
    const abilityImages = {
        "Boost": "images/boost.png",
        "Retaliate": "images/retaliate.png",
        "Weaken": "images/weaken.png",
        "Wound": "images/wound.png",
        "Regeneration": "images/regeneration.png",
        "Shield": "images/shield.png"
    };

    return abilityImages[abilityName] || "images/default_ability.png"; // Imagen predeterminada si no coincide
    }

    function getAbilityImageTxT(abilityName) {
        const abilityImages = {
            "Boost": "images/boost.png",
            "Retaliate": "images/retaliate.png",
            "Weaken": "images/weaken.png",
            "Wound": "images/wound.png",
            "Regeneration": "images/regeneration.png",
            "Shield": "images/shield.png"
        };
        
    
        return `<img src="${abilityImages[abilityName]}" alt="${abilityName}" width="40">`; // Imagen predeterminada si no coincide
    }
    
    function updateMutantImage(starLevel, mutantImage, mutant) {
        if (mutant) {
            const baseImageUrl = mutant.image; // Usamos la imagen base que tiene el mutante

            if (starLevel === "Bronze") {
                mutantImage.src = baseImageUrl.replace(".png", "_bronze.png");
            } else if (starLevel === "Silver") {
                mutantImage.src = baseImageUrl.replace(".png", "_silver.png");
            } else if (starLevel === "Gold") {
                mutantImage.src = baseImageUrl.replace(".png", "_gold.png");
            } else if (starLevel === "Platinum") {
                mutantImage.src = baseImageUrl.replace(".png", "_platinum.png");
            } else if (starLevel === "Spring") {
                mutantImage.src = baseImageUrl.replace(".png", "_spring.png");
            } else if (starLevel === "Autumn") {
                mutantImage.src = baseImageUrl.replace(".png", "_autumn.png");
            } else if (starLevel === "Winter") {
                mutantImage.src = baseImageUrl.replace(".png", "_winter.png");
            } else if (starLevel === "Winter Bug") {
                mutantImage.src = baseImageUrl.replace(".png", "_winter.png");
            } else if (starLevel === "Summer") {
                mutantImage.src = baseImageUrl.replace(".png", "_summer.png");
            } else {
                mutantImage.src = baseImageUrl; // Para "No Star" o si no se selecciona ninguna estrella
            }
        }
    }

    // Función para llenar la tabla con los datos de los mutantes
    function fillMutantsTable() {
        const tableBody = document.querySelector("#mutantsTable tbody");
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
            } else if (["Exclusive", "Seasonal", "VideoGame", "Community", "Gacha"].includes(mutant.type)) {
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
            } else if (mutant.type === "Community") {
                typeImageUrl = "images/community.png";
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
    
            // Agregar fila sin la columna ID
            row.innerHTML = `
                <td><img src="${mutantImageUrl}" alt="${mutant.name}" width="50"></td>
                <td>${mutant.name}</td>
                <td>${mutant.nameEsp}</td>
                <td>${geneImages}</td>
                <td><img src="${typeImageUrl}" alt="${mutant.type}" width="40"></td>
                <td>${getAbilityImageTxT(mutant.nameAbility)}</td>
                <td>${mutant.abilityp}<p>%</p></td>
            `;
    
            // Añadir evento de click para abrir el modal con la información del mutante
            row.addEventListener("click", () => openMutantModal(mutant));
    
            tableBody.appendChild(row);
        });
    }  

    // Consultar un nuevo mutante
    newMutantBtn.addEventListener("click", () => {
        mutantNameInput.value = '';
        document.getElementById("levelInput").value = '';
        starLevelContainer.style.display = "none";
        resultsDiv.innerHTML = '';
        resultsModal.hide();
    });
});
