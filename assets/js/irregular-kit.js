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
 // Block 1 · 4x4
 {rows:4,cols:4,items:['bottle','sock','mug']},
 {rows:4,cols:4,items:['dryer','bottle','sock','mug']},
 {rows:4,cols:4,items:['hanger','bottle','sock','mug']},
 {rows:4,cols:4,items:['dryer','hanger','bottle','sock']},
 {rows:4,cols:4,items:['pan','headphones','sock','bottle']},
 // Block 2 · 5x4
 {rows:4,cols:5,items:['umbrella','hanger','sock','bottle','mug']},
 {rows:4,cols:5,items:['dryer','headphones','sock','bottle','mug']},
 {rows:4,cols:5,items:['pan','hanger','bottle','sock','mug']},
 {rows:4,cols:5,items:['umbrella','dryer','headphones','sock','bottle']},
 {rows:4,cols:5,items:['pan','headphones','hanger','sock','bottle']},
 // Block 3 · 6x5
 {rows:5,cols:6,items:['book','dryer','hanger','sock','bottle','mug']},
 {rows:5,cols:6,items:['camera','headphones','umbrella','sock','bottle','mug']},
 {rows:5,cols:6,items:['shoe','pan','hanger','sock','bottle','mug']},
 {rows:5,cols:6,items:['book','camera','dryer','headphones','sock','bottle']},
 {rows:5,cols:6,items:['shoe','pan','hanger','headphones','sock','bottle']},
 // Block 4 · 8x6
 {rows:6,cols:8,items:['book','camera','shoe','dryer','hanger','sock','bottle','mug']},
 {rows:6,cols:8,items:['book','camera','pan','headphones','umbrella','sock','bottle','mug']},
 {rows:6,cols:8,items:['book','shoe','dryer','hanger','headphones','sock','bottle','mug']},
 {rows:6,cols:8,items:['book','camera','shoe','pan','umbrella','headphones','sock','bottle']},
 {rows:6,cols:8,items:['book','camera','shoe','pan','dryer','hanger','headphones','umbrella','sock','bottle']},
 // Chapter 2 · Brian Air · passenger luggage after customs inspection
 {chapter:'brian',rows:4,cols:4,items:['bottle','sock','mug']},
 {chapter:'brian',rows:4,cols:4,items:['book','bottle','sock','mug']},
 {chapter:'brian',rows:4,cols:4,items:['dryer','bottle','sock','mug']},
 {chapter:'brian',rows:4,cols:4,items:['hanger','bottle','sock','mug']},
 {chapter:'brian',rows:4,cols:4,items:['pan','headphones','sock','bottle']},
 {chapter:'brian',rows:4,cols:5,items:['umbrella','hanger','sock','bottle','mug']},
 {chapter:'brian',rows:4,cols:5,items:['dryer','headphones','sock','bottle','mug']},
 {chapter:'brian',rows:4,cols:5,items:['pan','hanger','bottle','sock','mug']},
 {chapter:'brian',rows:4,cols:5,items:['umbrella','dryer','headphones','sock','bottle']},
 {chapter:'brian',rows:4,cols:5,items:['pan','headphones','hanger','sock','bottle']},
 {chapter:'brian',rows:5,cols:6,items:['book','dryer','hanger','sock','bottle','mug']},
 {chapter:'brian',rows:5,cols:6,items:['camera','headphones','umbrella','sock','bottle','mug']},
 {chapter:'brian',rows:5,cols:6,items:['shoe','pan','hanger','sock','bottle','mug']},
 {chapter:'brian',rows:5,cols:6,items:['book','camera','dryer','headphones','sock','bottle']},
 {chapter:'brian',rows:5,cols:6,items:['shoe','pan','hanger','headphones','sock','bottle']},
 {chapter:'brian',rows:6,cols:8,items:['book','camera','shoe','dryer','hanger','sock','bottle','mug']},
 {chapter:'brian',rows:6,cols:8,items:['book','camera','pan','headphones','umbrella','sock','bottle','mug']},
 {chapter:'brian',rows:6,cols:8,items:['book','shoe','dryer','hanger','headphones','sock','bottle','mug']},
 {chapter:'brian',rows:6,cols:8,items:['book','camera','shoe','pan','umbrella','headphones','sock','bottle']},
 {chapter:'brian',rows:6,cols:8,items:['book','camera','shoe','pan','dryer','hanger','headphones','umbrella','sock','bottle']}
);

// game.js has already performed its initial load before this extension is evaluated.
level=0;
load();
