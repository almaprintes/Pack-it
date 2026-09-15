// Irregular item kit — DEV 0.0.79
// Footprints follow the visible silhouette and support the game's existing 0°/90° rotation.
Object.assign(catalog,{
 sock:{c:'sock',asset:asset('assets/items/sock-white-irregular-v1.webp'),shape:[[1,0,0],[1,1,0],[0,1,1]]},
 dryer:{c:'dryer',asset:asset('assets/items/hair-dryer-irregular-v1.webp'),shape:[[1,1,1],[0,1,0],[0,1,0]]},
 hanger:{c:'hanger',asset:asset('assets/items/wooden-hanger-irregular-v1.webp'),shape:[[1,0,1],[1,1,1]]},
 pan:{c:'pan',asset:asset('assets/items/frying-pan-irregular-v1.webp'),shape:[[1,1,1,0],[1,1,1,1]]},
 bottle:{c:'bottle',asset:asset('assets/items/water-bottle-irregular-v1.webp'),shape:[[1],[1],[1],[1]]},
 headphones:{c:'headphones',asset:asset('assets/items/headphones-u-irregular-v1.webp'),shape:[[1,0,1],[1,1,1]]},
 umbrella:{c:'umbrella',asset:asset('assets/items/umbrella-closed-v1.webp'),shape:[[1],[1],[1],[1]]}
});

// Solver-verified 8x6 puzzle: 45/48 occupied cells.
// 1 sock (5) + 2 dryers (10) + 2 hangers (10) + pan (7)
// + bottle (4) + headphones (5) + closed umbrella (4) = 45.
levels.splice(0,1,['sock','dryer','dryer','hanger','hanger','pan','bottle','headphones','umbrella']);

// game.js has already performed its initial load before this extension is evaluated.
// Reload level 1 once so the new verified puzzle is what the player sees.
level=0;
load();
