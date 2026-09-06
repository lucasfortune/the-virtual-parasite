---
layout: doc
title: Electron Microscopy Example
---

# Electron Microscopy Denoising

Removing directional noise — scan lines, streaks, reconstruction artifacts — from EM volumes with the routed pipeline.

## The Challenge

EM volumes typically mix:

- **Shot/read noise** — random, pixel-independent
- **Directional structure** — scan lines from the acquisition, detector streaks, and in tomograms the directional artifacts of the reconstruction

Plain Noise2Void removes the random component but can leave the directional one: neighboring pixels share correlated noise, and the blind-spot network copies it from context. Whether that matters for *your* volume is exactly what ASN2V measures before training.

## Dense EM (FIB-SEM / COSEM-style)

Dense cellular material with bright resin background — `bg_side="light"`:

```python
from autoStructN2V.pipeline import run_pipeline

summary = run_pipeline({
    "input_data": "cosem_stack.tif",
    "output_dir": "./results",
    "experiment_name": "cosem_routed",
    "mask": {"source": "extractor",
             "extractor": {"bg_side": "light"}},
})
print(summary["branch"], "|", summary["route_reason"])
```

## Cryo-ET Tomograms

On the real tomograms tested in the paper, flatness-only background selection worked best — `bg_side="off"`:

```python
"mask": {"source": "extractor", "extractor": {"bg_side": "off"}}
```

Tomogram noise is often anisotropic (missing wedge, reconstruction direction), which is precisely the directional correlation the spine mask captures.

## What to Expect

- **Seconds after start** you have the routing decision and (on the StructN2V route) the discovered mask — inspect both before the training run commits GPU time.
- **On the PhantEM EM benchmark**, the routed method reaches a five-seed mean Pearson of **0.668 vs 0.582 for plain N2V**, matching an oracle mask built from the true noise under identical design rules.
- **On volumes without usable directional structure**, the router falls back to plain N2V — the correct treatment, discovered automatically.

Always look at the residual (`create_difference_map(noisy, denoised)`): it should contain noise, not biology.

## Try It on Open Data

The full pipeline runs out of the box on the [PhantEM benchmark pairs](https://doi.org/10.5281/zenodo.22084921) (six EM volumes with clean ground truth, `bg_side="off"`) — the [Basic Usage tutorial](/autostructn2v/docs/tutorials/basic-usage) walks through it step by step. The paper's split-sum tilt-series experiment uses the open Zenodo record 14922032 (Kim et al. 2025).

## Adapting to Your Data

- Set `bg_side` for your contrast: `'light'` (bright resin), `'dark'` (dark background), `'off'` (flatness-only)
- If the mask looks implausible, check `bg_side` first, then point `bg_box` at a known-empty region
- See [Configuration](/autostructn2v/docs/user-guide/configuration) for all options — and prefer the presets/defaults; they are validated operating points
