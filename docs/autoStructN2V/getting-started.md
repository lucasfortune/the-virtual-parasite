# Getting Started

Install ASN2V and run the two quickstarts: mask discovery in seconds, and the full routed pipeline.

## Requirements

- Python ≥ 3.10
- PyTorch ≥ 2.2 (GPU strongly recommended for training; mask discovery runs on CPU)
- Dependencies: numpy, scipy, scikit-image, PyWavelets, tifffile, matplotlib, tqdm, tensorboard, pillow, mrcfile (all in `requirements.txt`)

## Installation

Install from source:

```bash
git clone https://github.com/lucasfortune/asn2v.git
cd asn2v
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
pip install -e .
python -c "import autoStructN2V; print(autoStructN2V.__version__)"   # 1.0.0
```

> **GPU note:** match the torch build to your CUDA driver — older drivers may need an explicit `+cuXXX` wheel; the default wheel targets recent CUDA. Without a GPU everything still runs, but training is slow.

## Quickstart 1: Discover a Mask (seconds, CPU, no training)

The fastest way to see what ASN2V finds on your data:

```bash
python examples/example_extract_mask.py /path/to/noisy_stack.tif
```

or in Python:

```python
import numpy as np, tifffile
from autoStructN2V.masking.autoextract import AutoMaskExtractor

stack = tifffile.imread("/path/to/noisy_stack.tif").astype(np.float32)

extractor = AutoMaskExtractor(bg_side="light")   # 'light' dense EM · 'dark' fluorescence · 'off' flatness-only
mask, info = extractor.extract_mask(stack)
```

- `stack` is an `(N, H, W)` array of noisy slices (a multi-page TIFF loads directly to this shape).
- `mask` is a small 2D boolean StructN2V kernel — center-masked, 180°-symmetric, one center-connected component.
- `mask is None` means the router **abstained**: the noise has no usable directional structure, and the right tool is plain N2V. This is an informative outcome, not an error.
- `info` carries the diagnostics: the measured ACF, the routing statistic `dmax`, the abstain `reason` if any, and `mask_rho2` — the fraction of center-pixel noise variance the mask plugs.

`bg_side` is the **one required choice**: which intensity side of your images is background (see [Noise Measurement & Routing](/autostructn2v/docs/concepts/noise-measurement)).

## Quickstart 2: The Full Routed Pipeline (trains a model)

```python
from autoStructN2V.pipeline import run_pipeline

summary = run_pipeline({
    "input_data": "/path/to/noisy_stack.tif",   # multi-page TIFF (N, H, W)
    "output_dir": "./results",
    "mask": {"source": "extractor",
             "extractor": {"bg_side": "light"}},
})
print(summary["branch"], summary["route_reason"])
print(summary["denoised_stack"])
```

or `python examples/example_run_pipeline.py /path/to/noisy_stack.tif`.

The pipeline measures the noise, routes, trains exactly one model (StructN2V with the discovered mask, or plain N2V), and denoises your full stack. Every unspecified config key gets a documented default — the full knob reference is [`PARAMETER_REFERENCE.md`](https://github.com/lucasfortune/asn2v/blob/main/PARAMETER_REFERENCE.md) in the repository, summarized in the [Configuration guide](/autostructn2v/docs/user-guide/configuration).

### What you get

Under `results/<experiment_name>/`:

| Output | Description |
|--------|-------------|
| `config.json` | The fully resolved configuration |
| `route_decision.json` | Branch, reason, and routing metrics |
| `model/routed_mask.npy` | The mask that was trained with |
| `model/model.pth` | The trained model weights |
| `logs/<timestamp>/` | TensorBoard logs |
| `final_results/denoised_stack.tif` | Your denoised volume (float32) |

## Baselines Through the Same Pipeline

```python
"mask": {"source": "center"}                            # plain-N2V baseline
"mask": {"source": "file", "file_path": "kernel.npy"}   # any manual mask
```

## Verify the Installation

```bash
python tests/test_routed_pipeline.py          # fast checks
python tests/test_routed_pipeline.py --e2e    # + two tiny CPU trainings
```

The data-dependent checks read benchmark volumes from the `ASN2V_BENCH_DIR` environment variable — point it at your [PhantEM download](https://doi.org/10.5281/zenodo.22084921).

## Next Steps

- [Basic Usage tutorial](/autostructn2v/docs/tutorials/basic-usage) — a complete walkthrough on benchmark data
- [The Routed Pipeline](/autostructn2v/docs/concepts/routed-pipeline) — how the method works
- [Configuration](/autostructn2v/docs/user-guide/configuration) — every knob, package defaults vs publication values
- [Troubleshooting](/autostructn2v/docs/troubleshooting) — common issues and their fixes
