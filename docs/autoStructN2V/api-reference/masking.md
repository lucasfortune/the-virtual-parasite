# API: masking

The method proper lives in `autoStructN2V.masking.autoextract`; classic kernel builders in `autoStructN2V.masking`.

## The Orchestrator (`autoextract/extractor.py`)

### `AutoMaskExtractor`

```python
AutoMaskExtractor(
    *, bg_side,                      # REQUIRED: 'light' | 'dark' | 'off'
    # phase 1 — background & ACF
    sigma='auto', struct_keep='otsu', acf_crop=10,
    tile_sizes=(64, 48, 32, 24), purities=(0.95, 0.85, 0.75, 0.6),
    min_tiles=4, detrend=True, bg_erode=1, bg_box=None,
    # phase 2/3 — mask extraction
    mask_style='spine', spine_thresh=8.0, rho_floor=0.05,
    max_pixels=None, tighten_output_mask=True,
    # router (module constants by default)
    dmax_threshold=0.012, coherence_threshold=0.0,
    # region-style (ablation) knobs
    enhance_kw=None, thresh=8.0, robust=True, close_gaps=True, bridge=True,
    thin_n=3, value_k=3.0, value_ref='zmap', protect_extent=True,
)
```

| Method | Returns | Purpose |
|--------|---------|---------|
| `extract_mask(stack, verbose=False)` | `(mask or None, info)` | Full measurement + extraction; `None` = routed to N2V |
| `route(stack, verbose=False)` | `(RouteDecision, info)` | The same, wrapped in a decision object |

Gate order inside `extract_mask`: background ACF → Dmax gate (`nondirectional`) → coherence gate (disabled) → spine/region extraction → optional weak-leak gate on `mask_rho2` → degenerate gate (≤ 1 px) → tighten.

`info` diagnostics include: the raw 21×21 ACF, `dmax`, `dmax_thr`, `coherence`, `reason` (on abstain), `mask_rho2` (Σρ² over off-center mask lags), and background-selection details.

### `RouteDecision`

`branch` (`'structn2v'`/`'n2v'`), `mask`, `reason`, `metrics`, `.message` (human-readable), `.center_kernel(size=1)`, `RouteDecision.from_extraction(mask, info)`, and `N2V_REASONS` — the abstain reasons that route to N2V (`nondirectional`, `isotropic`, `degenerate`, `weak_leak`).

## Background & ACF (`autoextract/bg_select.py`)

### `background_acf(stack, *, bg_side, sigma='auto', struct_keep='otsu', acf_crop=10, tile_sizes=(64,48,32,24), purities=(0.95,0.85,0.75,0.6), min_tiles=4, detrend=True, bg_erode=1, bg_box=None) -> (acf_raw, info)`

Phase 1 in one call: structure maps → background mask → purity-first tiling → detrended per-tile ACFs → averaged 21×21 ACF.

Helpers: `estimate_noise_scale(stack, ...)` (the `sigma='auto'` estimator, clipped to [4, 12]), `slice_structure(sl, sigma)`, `background_mask(struct, inten, struct_keep, bg_side, ...)`, `select_background_tiles(bgmask, psize, stride, purity)`, `auto_select(bgmask, sizes, purities, min_tiles)`, `averaged_acf_from_tiles(...)`, `averaged_acf_from_region(stack, box, ...)` (the `bg_box` path), `detect_bg_side(struct, inten)` (diagnostic only).

## Router Statistics (`autoextract/extract.py`)

- `directional_metrics(acf_crop) -> dict` — `Dmax`, `fold` ('2f'/'4f'), `axes`, `coherence`, read over arm rings r = 2–9
- `is_directional(acf_raw, threshold=DMAX_THRESHOLD) -> bool`
- Module constants: `DMAX_THRESHOLD = 0.012`, `COHERENCE_THRESHOLD = 0.0` (disabled), `COHERENCE_THRESHOLD_SYNTH = 0.98` (reference)
- `outer_annulus_scale(acf, outer_frac=0.55)` — reported diagnostic only (the old periodic gate is retired)

## Spine Extraction (`autoextract/spine.py`)

### `extract_spine_mask(acf_raw, *, thresh=8.0, rho_floor=None, max_pixels=None, min_feature_px=1, return_zmap=False)`

The shipped mask extraction: radial z-map → two-sided |z| cut → one 1-px weighted-PCA spine per connected feature → ray-connection to center → 180° symmetrization → optional `budget_prune` → |ρ| effect-size floor. (Through `AutoMaskExtractor`, `rho_floor` defaults to 0.05.)

## Supporting Modules

- **`enhance.py`** — `enhance(acf, sym=True, radial='zscore', scale_mode='ring', ...)` plus `symmetrize`, `radial_zscore`, `ridge_enhance` (Sato), `radius_map`, `center_yx` — ACF conditioning used by both styles
- **`postprocess.py`** — region-style post-processing: `thin_mask`, `skeletonize_mask`, `value_prune`, `mask_stats`, `postprocess(mask, method='thin', ...)`
- **`compare.py`** — `review_extractor_inputs(extractor, stacks, out_dir, ...)`, `make_review_figure`, `validate_input_choice`, `INPUT_CHOICES = ('raw', 'denoised', 'compare')`

## Classic Kernels (`masking/kernels.py`, `masking/utilities.py`)

- `create_stage1_mask_kernel(center_size)` — the N2V center kernel (plus a 3D variant)
- `create_blind_spot_kernel(kernel_size=3)`
- `create_full_mask(single_masking_kernel, patch_size, mask_percentage, verbose=False) -> (full_masking_kernel, prediction_kernel)` — places `mask_percentage`% prediction centers (publication convention) and stamps the kernel at each
- `create_mask_for_training(stage, kernel=None, patch_size=64, mask_percentage=20.0, **kwargs)`

## Retired

The old ring-Otsu `StructuralNoiseExtractor` (`masking/structure.py` — adaptive thresholding, base percentile, percentile decay, max_true_pixels) is dead code retained for the record: nothing imports it, and legacy configs referencing it raise. Its replacements: the radial z-score map with one calibrated cut (`spine_thresh`), the effect-size floor (`rho_floor`), and the Dmax router gate.
