# API: pipeline

The routed runner, configuration handling, and data splitting. Module: `autoStructN2V.pipeline`.

## Runner (`pipeline/runner.py`)

### `run_pipeline(config) -> dict`

The package's main entry point: validate config → resolve the route → train one model → denoise the stack. Returns a summary dict with `branch`, `route_reason`, `route_metrics`, `mask_path`, `model_path`, `denoised_stack`, `experiment_dir`, `final_results_dir` — or `halted`, `halt_reason`, `mask_review_dir` when `extractor_input='compare'` stopped the run for review.

### `resolve_route(config, stack, dirs=None, verbose=False) -> RouteDecision`

Resolves the mask source into a routing decision without training: runs the extractor (`source='extractor'`), builds a center kernel (`'center'`), or loads a file kernel (`'file'`).

### `load_mask_from_file(path, verbose=False) -> np.ndarray`

Loads and validates a `.npy` boolean kernel.

## Configuration (`pipeline/config.py`)

### `validate_config(config) -> dict`

Fills every unspecified key with a documented default, validates types/ranges/paths, and **auto-translates legacy two-stage configs** (`stage1` → `recipes.n2v`, `stage2` → `recipes.structn2v`, mask block derived). The retired ring-Otsu `mask_source='stage1'` path raises; retired ROI-selection keys are dropped.

### `create_output_directories(config) -> dict`

Creates the experiment directory tree and returns its paths.

### Defaults dictionaries

`TOP_DEFAULTS`, `N2V_RECIPE_DEFAULTS`, `STRUCTN2V_RECIPE_DEFAULTS`, `EXTRACTOR_DEFAULTS` — the source of truth for every default in the [Configuration guide](/autostructn2v/docs/user-guide/configuration).

## Data (`pipeline/data.py`)

### `split_stack_indices(num_slices, split_ratio=(0.7, 0.15, 0.15), seed=None, verbose=False)`

Deterministic train/val/test split of z-slice indices.

### `create_routed_dataloaders(config, recipe, single_kernel, stack, slice_indices, verbose=False)`

Builds the train/val/test dataloaders for the routed branch: patch sampling, blind-spot masking with the branch kernel, normalization, and (N2V branch only) augmentation.

## Example

```python
from autoStructN2V.pipeline import run_pipeline, validate_config, resolve_route

config = validate_config({
    "input_data": "stack.tif",
    "mask": {"source": "extractor", "extractor": {"bg_side": "light"}},
})

# peek at the route without training:
import tifffile, numpy as np
stack = tifffile.imread("stack.tif").astype(np.float32)
decision = resolve_route(config, stack, verbose=True)
print(decision.branch, decision.reason, decision.message)

summary = run_pipeline(config)
```
