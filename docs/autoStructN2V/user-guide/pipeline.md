# Pipeline

Running the routed workflow end to end with `run_pipeline`.

## The Entry Point

```python
from autoStructN2V.pipeline import run_pipeline, validate_config

config = {
    "input_data": "/path/to/noisy_stack.tif",
    "output_dir": "./results",
    "experiment_name": "my_run",
    "mask": {"source": "extractor",
             "extractor": {"bg_side": "light"}},
}
validate_config(config)      # optional: fails fast with a clear message
summary = run_pipeline(config)
```

`run_pipeline` executes: load stack → resolve the route (measure + extract, or use the configured mask source) → build dataloaders for the routed branch → train one model → denoise the full stack.

## Inputs

| Input | Format | Notes |
|-------|--------|-------|
| `input_data` | multi-page TIFF `(N, H, W)` | required; `.tif`/`.tiff` |
| `clean_data` | multi-page TIFF | optional ground truth — enables the auxiliary PSNR diagnostic only |
| `mask.file_path` | `.npy` boolean kernel | for `mask.source='file'` |
| `extractor.denoised_stack_path` | TIFF | only for `extractor_input='denoised'`/`'compare'` |

## The Route

With `mask.source='extractor'` (the method), the pipeline calls the [AutoMaskExtractor](/autostructn2v/docs/concepts/noise-measurement) on the raw stack and gets a `RouteDecision`:

- **`branch='structn2v'`** — directional noise found; trains with the discovered spine mask
- **`branch='n2v'`** — no usable structure (`reason` one of `nondirectional`, `isotropic`, `degenerate`, `weak_leak`); trains with a 1×1 center kernel

The decision is saved as `route_decision.json` with the routing metrics (Dmax, coherence, mask_rho2).

Baselines use the same pipeline with `mask.source='center'` (plain N2V, `center_size` odd) or `mask.source='file'` (any manual kernel).

## Extractor Input Modes

| `extractor_input` | Behavior |
|-------------------|----------|
| `'raw'` (default) | Measure on the raw stack — the method |
| `'denoised'` | Measure on a precomputed denoised stack (ablation; needs `denoised_stack_path`) |
| `'compare'` | **Review halt**: runs the extraction on both, writes a review figure, trains nothing. `summary["halted"]` is set with `halt_reason` and `mask_review_dir` |

`'compare'` is the way to inspect what the extractor sees before committing GPU time to a long run.

## Outputs

Under `<output_dir>/<experiment_name>/`:

```
config.json                      # fully resolved configuration
route_decision.json              # branch, reason, metrics
model/
  routed_mask.npy                # the kernel that trained
  model.pth                      # trained weights
logs/<timestamp>/                # TensorBoard
final_results/
  denoised_stack.tif             # float32 by default
```

The returned `summary` dict carries `branch`, `route_reason`, `route_metrics`, `mask_path`, `model_path`, `denoised_stack`, `experiment_dir`, and `final_results_dir`.

## Reproducibility

`random_seed` (default 42) seeds python/numpy/torch/cuda and sets cuDNN deterministic. The saved `config.json` plus `routed_mask.npy` fully determine a rerun.

## Legacy Configs

Configs from the retired two-stage design are **auto-translated** by `validate_config`: `stage1` → `recipes.n2v`, `stage2` → `recipes.structn2v`, and the mask block is derived. The old ring-Otsu `mask_source='stage1'` path no longer exists and raises with a clear message; retired ROI-selection keys are dropped.

## Related

- [Configuration](/autostructn2v/docs/user-guide/configuration) — the full config schema
- [Training](/autostructn2v/docs/user-guide/training) — what happens during the training phase
- [Inference](/autostructn2v/docs/user-guide/inference) — denoising additional stacks with a trained model
