// DEV 0.0.58 — cable geometry, visual size and anchor are independent.
// Loose cable: 3x3 footprint. Rolled cable: 1x2 collision footprint.
// The rolled WebP keeps its accepted visual size and is centered on the
// logical 1x2 / 2x1 footprint without changing scale.
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

    // Preserve the exact accepted visual canvas size.
    art.style.width = (2 * cw) + 'px';
    art.style.height = (2 * ch) + 'px';
    art.style.maxWidth = 'none';
    art.style.maxHeight = 'none';

    // Anchor the visual canvas to the centre of the logical footprint.
    // .item-art is absolute, so left/top must be explicit after its parent
    // changes from 1x2 to 2x1 on rotation.
    art.style.left = '50%';
    art.style.top = '50%';
    art.style.transformOrigin = '50% 50%';
    art.style.transform = `translate(-50%,-50%) rotate(${e._st.rot * 90}deg)`;
  };
} catch (e) {}
