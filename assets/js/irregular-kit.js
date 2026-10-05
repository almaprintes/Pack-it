// Irregular item kit — DEV 0.0.79
// Footprints follow the visible silhouette and support the game's existing 0°/90° rotation.
Object.assign(catalog,{
 sock:{c:'sock',asset:asset('assets/items/sock-white-irregular-v1.webp'),shape:[[1,0],[1,1]]},
 dryer:{c:'dryer',asset:asset('assets/items/hair-dryer-irregular-v1.webp'),shape:[[1,1,1],[0,1,0]]},
 hanger:{c:'hanger',asset:asset('assets/items/wooden-hanger-irregular-v1.webp'),shape:[[0,1,0],[1,1,1]]},
 pan:{c:'pan',asset:asset('assets/items/frying-pan-irregular-v1.webp'),shape:[[1,1,1,0],[1,1,0,0]]},
 bottle:{c:'bottle',asset:asset('assets/items/water-bottle-irregular-v1.webp'),shape:[[1],[1]]},
 headphones:{c:'headphones',asset:asset('assets/items/headphones-u-irregular-v1.webp'),shape:[[1,1,1],[1,0,1]]},
 umbrella:{c:'umbrella',asset:asset('assets/items/umbrella-closed-v1.webp'),shape:[[1],[1],[1],[1]]}
});

// Rebalanced level 1 after visual footprint calibration.
levels.splice(0,1,['sock','dryer','hanger','pan','bottle','headphones','umbrella']);

// game.js has already performed its initial load before this extension is evaluated.
// Reload level 1 once so the new verified puzzle is what the player sees.
level=0;
load();
