// Irregular item kit — footprints calibrated against the visible assets.
Object.assign(catalog,{
 sock:{c:'sock',asset:asset('assets/items/sock-white-irregular-v1.webp'),shape:[[1,0],[1,1]]},
 dryer:{c:'dryer',asset:asset('assets/items/hair-dryer-irregular-v1.webp'),shape:[[1,1,1],[0,1,0]]},
 hanger:{c:'hanger',asset:asset('assets/items/wooden-hanger-irregular-v1.webp'),shape:[[0,1,0],[1,1,1]]},
 pan:{c:'pan',asset:asset('assets/items/frying-pan-irregular-v1.webp'),shape:[[1,1,1,0],[1,1,0,0]]},
 bottle:{c:'bottle',asset:asset('assets/items/water-bottle-irregular-v1.webp'),shape:[[1],[1]]},
 headphones:{c:'headphones',asset:asset('assets/items/headphones-u-irregular-v1.webp'),shape:[[1,1,1],[1,0,1]]},
 umbrella:{c:'umbrella',asset:asset('assets/items/umbrella-closed-v1.webp'),shape:[[1],[1],[1],[1]]}
});

// Block 1: levels 1–5 all use the same 4x4 box.
// Difficulty rises inside the block while the box size stays constant.
levels.splice(0,levels.length,
 {rows:4,cols:4,items:['bottle','sock','mug']},
 {rows:4,cols:4,items:['dryer','bottle','sock','mug']},
 {rows:4,cols:4,items:['hanger','bottle','sock','mug']},
 {rows:4,cols:4,items:['dryer','hanger','bottle','sock']},
 {rows:4,cols:4,items:['pan','headphones','sock','bottle']}
);

// game.js has already performed its initial load before this extension is evaluated.
level=0;
load();
