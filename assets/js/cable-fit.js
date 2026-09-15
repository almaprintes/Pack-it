// DEV 0.0.56 — cable geometry and visual size are intentionally independent.
// Loose cable: 3x3 footprint. Rolled cable: 1x2 collision footprint,
// while preserving the visual size it had before the footprint was reduced.
try {
  catalog.cable.shape = [[1],[1]];
  catalog.cable.prepare.from = [[1,1,1],[1,1,1],[1,1,1]];
  catalog.cable.prepare.to = [[1],[1]];

  const syncArtBase = syncArt;
  syncArt = function(e) {
    if (!(e?._st?.name === 'cable' && e._st.prepared)) {
      return syncArtBase(e);
    }
    const art = e.querySelector('.item-art');
    if (!art) return;
    const b = box.getBoundingClientRect();
    const cw = b.width / COLS;
    const ch = b.height / ROWS;
    // Keep the rolled WebP at the former 2x2 visual canvas size.
    // Only shape/collision/snapping use the 1x2 footprint.
    art.style.width = (2 * cw) + 'px';
    art.style.height = (2 * ch) + 'px';
    art.style.maxWidth = 'none';
    art.style.maxHeight = 'none';
    art.style.transform = `translate(-50%,-50%) rotate(${e._st.rot * 90}deg)`;
  };
} catch (e) {}
