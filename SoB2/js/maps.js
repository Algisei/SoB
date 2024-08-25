// maps.js

export const maps = [
    {
        name: 'Map 1',
        layout: [
            // Определение структуры карты
        ],
        enemies: [ /* Список противников на карте */ ]
    },
    {
        name: 'Map 2',
        layout: [
            // Определение структуры карты
        ],
        enemies: [ /* Список противников на карте */ ]
    }
];

export function loadMap(mapIndex) {
    const map = maps[mapIndex];
    console.log(`Loading map: ${map.name}`);
    // Логика загрузки карты
}
