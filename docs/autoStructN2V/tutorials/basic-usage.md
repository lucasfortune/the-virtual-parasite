# Tutorial: Basic Usage

A complete walkthrough: get benchmark data, discover a mask, inspect the routing decision, train the routed pipeline, and check the result.

## 1. Get Data

Use your own multi-page TIFF stack, or grab a benchmark pair from the [PhantEM deposit](https://doi.org/10.5281/zenodo.22084921) (CC-BY-4.0). Each PhantEM volume ships `noisy.tif`, `clean.tif`, and an `eval_window.json`; the noisy stack is the input, and the clean stack lets you compute real quality numbers afterwards.

```bash
mkdir -p data/macrophage2   # example volume
# download and unzip macrophage2.zip from the Zenodo record into it
```

## 2. Discover the Mask (seconds, no training)

```python
import numpy as np, tifffile
from autoStructN2V.masking.autoextract import AutoMaskExtractor

stack = tifffile.imread("data/macrophage2/noisy.tif").astype(np.float32)

extractor = AutoMaskExtractor(bg_side="off")   # PhantEM: flatness-only selection
mask, info = extractor.extract_mask(stack, verbose=True)

print("Dmax:", round(info["dmax"], 4), " threshold:", info["dmax_thr"])
if mask is None:
    print("Routed to plain N2V — reason:", info["reason"])
else:
    print(f"Mask: {mask.shape}, {int(mask.sum())} px, covers Σρ² = {info['mask_rho2']:.3f}")
    for row in mask:                      # ASCII preview
        print("".join("#" if v else "." for v in row))
```

**Choosing `bg_side` for your own data:** `'light'` for dense EM (bright resin), `'dark'` for fluorescence-like data, `'off'` when neither side clearly corresponds to background. If the mask looks wrong, this is the first thing to check.

## 3. Read the Diagnostics

| Diagnostic | Meaning | Healthy sign |
|------------|---------|--------------|
| `dmax` | Directional-magnitude statistic of the noise ACF | Well above 0.012 for structured noise; well below for random noise |
| `mask_rho2` | Fraction of center-pixel noise variance the mask plugs | The mask covers something substantial |
| `reason` | Abstain reason when routed to N2V | `nondirectional` on random noise is *correct behavior* |

A `None` mask on data you believed structured deserves a second look at `bg_side` — measuring on foreground structures instead of background distorts everything downstream.

## 4. Run the Full Pipeline

```python
from autoStructN2V.pipeline import run_pipeline

summary = run_pipeline({
    "input_data": "data/macrophage2/noisy.tif",
    "clean_data": "data/macrophage2/clean.tif",    # optional: enables the aux PSNR diagnostic
    "output_dir": "./results",
    "experiment_name": "macrophage2_routed",
    "mask": {"source": "extractor",
             "extractor": {"bg_side": "off"}},
})

print(summary["branch"], "|", summary["route_reason"])
print("denoised:", summary["denoised_stack"])
```

Monitor with TensorBoard while it trains:

```bash
tensorboard --logdir results/macrophage2_routed/logs
```

## 5. Check the Result

Visual first:

```python
import tifffile
noisy = tifffile.imread("data/macrophage2/noisy.tif")
den   = tifffile.imread(summary["denoised_stack"])

from autoStructN2V.inference.visualization import create_difference_map
# the removed component should look like noise — no biological structure in the residual
```

With PhantEM's ground truth you can also score properly (Pearson correlation inside the volume's `eval_window.json` is the benchmark's primary metric).

## 6. Compare Against the Baseline

The plain-N2V baseline runs through the same pipeline — only the mask source changes:

```python
summary_n2v = run_pipeline({
    "input_data": "data/macrophage2/noisy.tif",
    "output_dir": "./results",
    "experiment_name": "macrophage2_n2v_baseline",
    "mask": {"source": "center"},
})
```

On structured-noise volumes the routed run should visibly reduce the directional artifacts the baseline leaves behind.

## Next

- [Baselines & Custom Masks](/autostructn2v/docs/tutorials/custom-masks) — manual kernels and the paper's frozen masks
- [Advanced Configuration](/autostructn2v/docs/tutorials/advanced-configuration) — tuning the extractor and the recipe
