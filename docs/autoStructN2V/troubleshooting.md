# Troubleshooting

Common issues, what they mean, and what to do — measurement first, then training.

## Routing & Mask Discovery

### The router picked plain N2V but I expected structure

Usually correct behavior: `Dmax` below 0.012 means the measured noise carries no usable directional correlation, and structured masking would only cost the network context. Check `info["dmax"]` — a value far below the threshold on visibly striped data suggests a measurement problem instead (see the next items).

### `mask is None` / abstain reasons

| `reason` | Meaning | Action |
|----------|---------|--------|
| `nondirectional` | Dmax below threshold | Plain N2V is the right tool; if you disagree, check `bg_side` first |
| `degenerate` | The extracted mask collapsed to ≤ 1 px | Noise is barely structured; N2V route is appropriate |
| `isotropic` | Coherence gate (ships disabled) | Only seen with a custom `coherence_threshold` |
| `weak_leak` | `mask_rho2` below `min_mask_rho2` | Only seen when you enabled the optional leak gate |

### The mask looks wrong (mirrors specimen texture, implausible ACF)

The background selection is likely measuring on structure:

1. **Check `bg_side`** — wrong side means the "background" tiles sit on the specimen. `'light'` for dense EM, `'dark'` for fluorescence, `'off'` if unsure.
2. **Point at known background** with `bg_box=(y0, y1, x0, x1)`.
3. **Fix the structure scale** — `sigma=8` (or similar) instead of `'auto'` when auto-estimation misreads unusual noise.

### The mask misses a visible noise direction

Lower `rho_floor` (default 0.05) to admit weaker correlations, or `spine_thresh` (default 8.0) for a more sensitive significance cut. Regenerating takes seconds.

### The mask is large with faint tails

Raise `rho_floor` (0.10–0.15). Watch `mask_rho2`: if it barely drops, the removed pixels were dead weight. Prefer the floor over `max_pixels` — the floor removes by relevance, the cap by count.

### "Not enough background tiles"

The purity-first tiling could not find `min_tiles` tiles at any candidate purity. Densely filled images: try `bg_side='off'`, lower `purities`, smaller `tile_sizes`, or a `bg_box`.

## Training

### Out of memory

Reduce `batch_size` first (StructN2V branch trains at patch 256 in the publication recipe and is the usual culprit), then `patch_size`.

### Loss unstable / diverging

Lower the learning rate (publication value 1e-3; try 1e-4). Also check that your stack isn't float with a wild value range — set `normalize_method='zscore'`.

### Result over-smoothed or barely denoised

- Over-smoothed: mask too large — raise `rho_floor` and re-route
- Barely denoised: budget too small (raise `num_epochs` toward the validated 100) or the branch routed differently than you assumed — read `route_decision.json`

### StructN2V result collapsed / much worse than N2V

Check `norm_type`: the StructN2V branch must use `'group'`. Setting both branches to `'batch'` reproduces the documented BatchNorm collapse (Pearson ≈0.60); setting both to `'group'` regresses the N2V branch by up to −13 dB. The publication asymmetry (`'batch'`/`'group'`) is not optional.

### Legacy config errors

- *"the ring-Otsu 'stage1' path no longer exists"* — the old Stage-1-residual mask source is retired; use `mask.source='extractor'` (the raw-stack measurement) instead
- `mode='2.5d'` raises — v1.0 trains 2D only
- Old `stage1`/`stage2` recipe blocks are translated automatically; `legacy_extractor` blocks are dropped silently

## Environment

### CUDA not available

The pipeline falls back to CPU automatically (slow: 10–50×). For GPU, match the torch build to your CUDA driver — older drivers may need an explicit `+cuXXX` wheel.

### Import errors after install

Install order matters: `pip install -r requirements.txt` **then** `pip install -e .`, inside a Python ≥ 3.10 environment. Verify with `python -c "import autoStructN2V; print(autoStructN2V.__version__)"` → `1.0.0`.

### Tests

```bash
python tests/test_routed_pipeline.py          # fast
python tests/test_routed_pipeline.py --e2e    # + two tiny CPU trainings
ASN2V_BENCH_DIR=/path/to/phantem python tests/test_routed_pipeline.py   # data-dependent checks
```

## Still Stuck?

Open an issue at [github.com/lucasfortune/asn2v](https://github.com/lucasfortune/asn2v/issues) with your `config.json`, `route_decision.json`, and the extractor diagnostics (`dmax`, `mask_rho2`, the abstain reason).
