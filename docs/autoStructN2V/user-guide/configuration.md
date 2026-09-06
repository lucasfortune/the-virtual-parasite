# Configuration

The complete config schema for `run_pipeline`. Every unspecified key gets a documented default; this page mirrors `PARAMETER_REFERENCE.md` in the repository.

## Schema

```python
config = {
    'input_data': '<stack.tif>',      # REQUIRED
    ... top-level keys ...,
    'mask':    { 'source': ..., 'extractor': {...} },
    'recipes': { 'n2v': {...}, 'structn2v': {...} },
}
```

## Top Level

| Key | Default | Notes |
|-----|---------|-------|
| `input_data` | — | REQUIRED; multi-page TIFF stack (N, H, W) |
| `clean_data` | `None` | optional GT stack; enables the auxiliary PSNR diagnostic only |
| `output_dir` | `'./results'` | |
| `experiment_name` | `'autoStructN2V_experiment'` | |
| `random_seed` | `42` | seeds python/numpy/torch/cuda; cuDNN deterministic |
| `device` | `'cuda'` | `'cpu'` fallback is automatic when CUDA is absent |
| `split_ratio` | `(0.7, 0.15, 0.15)` | train/val/test z-slice split |
| `num_epochs` | `100` | publication value (a 400-epoch probe bought ~0 dB) |
| `early_stopping` | `True` | publication runs set `False` |
| `early_stopping_patience` | `10` | |
| `normalize_method` | `'unit'` | **publication value: `'zscore'`** (training on [0,1] cost ~3 dB) |
| `use_aux_psnr_for_scheduling` | `False` | masked val loss drives scheduling (publication-faithful) |
| `mode` | `'2d'` | only `'2d'` supported |
| `verbose` | `False` | |

## `mask`: The Routing Source

| Key | Default | Notes |
|-----|---------|-------|
| `source` | `'extractor'` | `'extractor'` = the method · `'center'` = plain-N2V baseline · `'file'` = manual/frozen kernel |
| `center_size` | `1` | odd; kernel side for `source='center'` |
| `file_path` | `None` | `.npy` bool kernel for `source='file'` |

## `mask.extractor`: AutoMaskExtractor Knobs

Pipeline-level:

| Key | Default | Notes |
|-----|---------|-------|
| `extractor_input` | `'raw'` | `'raw'` (method) · `'denoised'` · `'compare'` (review halt) |
| `denoised_stack_path` | `None` | required for `'denoised'`/`'compare'` |

Phase 1 — background selection and ACF measurement:

| Key | Default | Notes |
|-----|---------|-------|
| `bg_side` | — | **REQUIRED**: `'light'` (dense EM) · `'dark'` (fluorescence) · `'off'` (flatness-only) |
| `bg_box` | `None` | manual background rectangle (y0, y1, x0, x1); overrides side selection |
| `sigma` | `'auto'` | structure/detrend scale; estimated from the noise ACF half-width, clipped to [4, 12] |
| `struct_keep` | `'otsu'` | flatness threshold: Otsu on log structure map, or a fixed percentile |
| `acf_crop` | `10` | half-size of the ACF crop (21×21) |
| `tile_sizes` | `[64, 48, 32, 24]` | purity-first tiling: candidate tile sizes |
| `purities` | `[0.95, 0.85, 0.75, 0.6]` | highest purity that yields `min_tiles` wins |
| `min_tiles` | `4` | |
| `detrend` | `True` | per-tile Gaussian high-pass at `sigma` |
| `bg_erode` | `1` | erosion on the background mask (keeps tiles off structure edges) |

Phase 2/3 — mask style:

| Key | Default | Notes |
|-----|---------|-------|
| `mask_style` | `'spine'` | `'spine'` (the method) · `'region'` (legacy positive-only; ablation arm) |
| `spine_thresh` | `8.0` | two-sided \|z\| significance cut |
| `rho_floor` | `0.05` | effect-size floor: drop mask lags with \|ρ\| below it (the shipped operating point) |
| `max_pixels` | `None` | optional budget; topology-safe symmetric-pair pruning |
| `tighten_output_mask` | `True` | crop the kernel to its center-symmetric bounding rect |

Region-style-only knobs (ablation arm): `enhance_kw`, `thresh` (8.0), `robust`, `close_gaps`, `bridge`, `thin_n` (3), `value_k` (3.0), `value_ref` (`'zmap'`), `protect_extent`.

> **Router thresholds:** the Dmax gate (0.012) and the disabled coherence gate are module constants. They are documented in the parameter reference, but `run_pipeline` does not forward overrides — only direct `AutoMaskExtractor(...)` use can change them.

## `recipes.n2v` / `recipes.structn2v`: The Branch Recipes

Package defaults, with the publication recipe (`known_good_config.py`) in the third column:

| Key | Package default (n2v / structn2v) | Publication (n2v / structn2v) |
|-----|-----------------------------------|-------------------------------|
| `features` | 64 / 64 | 32 / 32 |
| `num_layers` | 2 / 2 | 2 / 2 |
| `patch_size` | 32 / 64 | 64 / 256 (auto-shrunk per volume) |
| `batch_size` | 4 / 2 | 128 / 24 |
| `learning_rate` | 1e-4 / 1e-5 | 1e-3 / 1e-3 |
| `patches_per_image` | 100 / 200 | 4 / 4 |
| `mask_percentage` | 15.0 / 10.0 | 1.5 / 15.0 (% of prediction centers) |
| `masking_strategy` | 3 / 3 | 3 / 3 (UPS 5×5) |
| `use_augmentation` | True / True | True / **False** |
| `use_resize_conv` | True | True |
| `upsampling_mode` | `'bilinear'` | `'bilinear'` |
| `remove_top_skip` | False | **True** (N2V2) |
| `use_blurpool` | False | **True** (N2V2) |
| `activation` | `'elu'` | **`'relu'`** |
| `norm_type` | `'batch'` / `'batch'` | `'batch'` / **`'group'`** (asymmetric on purpose) |
| `num_groups` | 8 | 8 |
| `overlap_tile_pad` | 0 | **16** |
| `init_scale` | 1.0 | 1.0 |
| `num_workers` | 4 | 4 |

Masking-strategy codes: 0 = local mean · 1 = zeros · 2 = random from patch (legacy) · 3 = UPS, uniform sample from the 5×5 neighborhood excluding masked positions (publication) · 4 = UPS centers + uniform-random struct neighbors (CAREamics-style; reverted for publication).

> **The norm asymmetry is deliberate.** The N2V branch uses BatchNorm (GroupNorm there cost up to −13 dB); the StructN2V branch uses GroupNorm (structured masks mis-calibrate BatchNorm's running statistics — Pearson ≈0.60 → ≈0.94 after the switch). Do not set both branches to the same norm. See [Architecture & Training Recipe](/autostructn2v/docs/concepts/architecture).

## Using the Publication Recipe

```python
from known_good_config import CONFIG    # in the repository root
CONFIG["input_data"] = "/path/to/noisy_stack.tif"
run_pipeline(CONFIG)
```

`known_good_config.py` is the resolved, frozen recipe behind the paper's results (legacy two-stage form; auto-translated on load).

## Related

- [Pipeline](/autostructn2v/docs/user-guide/pipeline) — running it
- [Advanced Configuration tutorial](/autostructn2v/docs/tutorials/advanced-configuration) — what to tune and what to leave alone
