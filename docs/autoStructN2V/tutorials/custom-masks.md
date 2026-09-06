# Tutorial: Baselines & Custom Masks

Run plain N2V, train with a hand-made kernel, and reuse the paper's frozen masks — all through the same pipeline.

## Why This Matters

Every baseline in the ASN2V paper runs through the identical pipeline, differing **only** in the mask source. That's the fair-comparison design, and it's available to you: swap `mask.source` and nothing else changes.

## Plain N2V (`source='center'`)

```python
from autoStructN2V.pipeline import run_pipeline

summary = run_pipeline({
    "input_data": "/path/to/noisy_stack.tif",
    "output_dir": "./results",
    "experiment_name": "n2v_baseline",
    "mask": {"source": "center", "center_size": 1},
})
```

`center_size` (odd) widens the blind spot — a 3×3 center kernel is a cheap robustness trick against slightly correlated noise, at the cost of context.

## A Custom Kernel (`source='file'`)

Any small 2D boolean `.npy` array works as a StructN2V kernel. Build one by hand:

```python
import numpy as np

kernel = np.zeros((3, 11), dtype=bool)   # horizontal line, span 11
kernel[1, :] = True                       # the center row
np.save("h11.npy", kernel)
```

```python
summary = run_pipeline({
    "input_data": "/path/to/noisy_stack.tif",
    "output_dir": "./results",
    "experiment_name": "manual_structn2v",
    "mask": {"source": "file", "file_path": "h11.npy"},
})
```

Conventions to respect: odd dimensions, the center pixel is the prediction position, and the kernel should be 180°-symmetric (correlation is symmetric).

## Reuse a Discovered Mask

Quickstart 1 saves `discovered_mask.npy`. Freezing a discovered mask and training it via `source='file'` gives you bit-identical reruns without re-measuring:

```python
mask, info = extractor.extract_mask(stack)
np.save("frozen_mask.npy", mask)
# later, on the same or a sibling volume:
"mask": {"source": "file", "file_path": "frozen_mask.npy"}
```

## The Paper's Frozen Kernels

The repository ships `masks/` with the exact kernels behind the paper's mask sweep — 6 volumes × 4 arms plus 3 canned presets, listed in `masks/masks_manifest.json` with shapes and pixel counts:

| Kernel family | Meaning |
|---------------|---------|
| `<vol>_d_spine.npy` | The discovered spine mask (strict) |
| `<vol>_e_spine_f05.npy` | The spine with the ρ≥0.05 floor — **the shipped method's arm** |
| `<vol>_f_oracle.npy` | Oracle mask built from the true noise (benchmark only) |
| `<vol>_c_region.npy` | Legacy region-style mask (ablation) |
| `b_v11.npy`, `b_h11.npy`, `b_x11.npy` | Canned presets: vertical / horizontal / cross, span 11 |

`experiments/make_masks.py` regenerates them bit-identically from the volumes.

```python
"mask": {"source": "file", "file_path": "masks/Brno_e_spine_f05.npy"}
```

## When Would You Use a Manual Mask?

- You know the pattern (e.g., pure horizontal scan lines) and want the minimal kernel without measurement
- You want to reproduce or extend the paper's sweep
- You froze a mask from one volume and want to apply it to sibling acquisitions

For everything else, prefer `source='extractor'` — the measurement is cheaper than guessing, and the router tells you when masking isn't warranted at all.

## Related

- [Spine Mask Extraction](/autostructn2v/docs/concepts/spine-mask-extraction) — the design rules discovered masks follow
- [Configuration](/autostructn2v/docs/user-guide/configuration) — the `mask` block reference
