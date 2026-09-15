// DEV 0.0.55 — cable visual/grid fit only.
// Loose cable: exact 3x3 footprint. Rolled cable: exact 1x2 footprint.
try {
  catalog.cable.shape = [[1],[1]];
  catalog.cable.prepare.from = [[1,1,1],[1,1,1],[1,1,1]];
  catalog.cable.prepare.to = [[1],[1]];
} catch (e) {}
