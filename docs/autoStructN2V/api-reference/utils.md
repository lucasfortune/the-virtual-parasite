# API: utils

Shared utilities. Module: `autoStructN2V.utils`.

## Image I/O (`utils/image.py`)

| Function | Purpose |
|----------|---------|
| `load_tiff_stack(path)` | Multi-page TIFF → `(N, H, W)` float array |
| `save_tiff_stack(array, path, ...)` | Array → multi-page TIFF |
| `load_and_normalize_image(...)` | Load + normalization in one step |
| `calculate_autocorrelation(image)` | 2D autocorrelation (the general-purpose version; the measurement pipeline has its own detrended, tiled estimator in `masking.autoextract.bg_select`) |

## Patching (`utils/patching.py`)

| Function | Purpose |
|----------|---------|
| `image_to_patches(image, patch_size, stride)` | Tile a slice into patches |
| `patches_to_image(patches, shape, ...)` | Reassemble with weighted blending |
| `create_weight_mask(patch_size)` | Blending weights for reassembly |
| `find_roi_patches(...)` | Legacy ROI patch selection (unreachable through the pipeline; retained for the record) |

## Training Helpers (`utils/training.py`)

| Function | Purpose |
|----------|---------|
| `set_seed(seed)` | Seeds python/numpy/torch/cuda; sets cuDNN deterministic |
| `validate_architecture_params(...)` | Checks feature/layer/patch compatibility |
| `get_balanced_hparams(...)` | Suggested hyperparameters for a data size |
| `estimate_memory_requirements(...)` | Rough GPU-memory estimate for a recipe |
| `cleanup()` | Frees CUDA memory between runs |
