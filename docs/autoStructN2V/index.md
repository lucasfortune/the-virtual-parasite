# autoStructN2V Documentation

Welcome to the documentation for **autoStructN2V (ASN2V)** — automated structural noise discovery and routed self-supervised denoising for volumetric electron microscopy.

## What is autoStructN2V?

Structured Noise2Void removes spatially correlated noise, but its structural mask must traditionally be specified by hand from expert reading of autocorrelation plots. ASN2V replaces the expert with a measurement:

- The noise autocorrelation is measured directly on the **raw volume** through automatic background selection (seconds, CPU)
- A calibrated routing decision, taken **before any training**, determines whether structured masking is warranted at all
- The mask is extracted under explicit design rules: sign-agnostic line summaries with an effect-size floor
- Exactly **one model** is trained: StructN2V with the discovered mask, or plain N2V when the noise carries no usable directional structure

## Quick Links

### Getting Started
- [Installation & Quickstarts](getting-started.md)
- [Basic Usage Tutorial](tutorials/basic-usage.md)

### Core Concepts
- [The Routed Pipeline](concepts/routed-pipeline.md) — measure → route → train once
- [Noise Measurement & Routing](concepts/noise-measurement.md) — background selection, the ACF, and the Dmax gate
- [Spine Mask Extraction](concepts/spine-mask-extraction.md) — how the mask is discovered
- [Architecture & Training Recipe](concepts/architecture.md) — the N2V2-style U-Net and the frozen recipe

### User Guides
- [Pipeline Guide](user-guide/pipeline.md) — `run_pipeline()` end to end
- [Configuration Reference](user-guide/configuration.md) — every knob, package vs publication values
- [Training Guide](user-guide/training.md)
- [Inference Guide](user-guide/inference.md)

### Tutorials
- [Basic Usage](tutorials/basic-usage.md) — complete walkthrough on benchmark data
- [Baselines & Custom Masks](tutorials/custom-masks.md)
- [Advanced Configuration](tutorials/advanced-configuration.md)

### API Reference
- [Pipeline](api-reference/pipeline.md) · [Masking](api-reference/masking.md) · [Models](api-reference/models.md) · [Datasets](api-reference/datasets.md) · [Trainers](api-reference/trainers.md) · [Inference](api-reference/inference.md) · [Utils](api-reference/utils.md)

### Additional Resources
- [Troubleshooting](troubleshooting.md)

## Example Usage

```python
from autoStructN2V.pipeline import run_pipeline

summary = run_pipeline({
    "input_data": "/path/to/noisy_stack.tif",   # multi-page TIFF (N, H, W)
    "output_dir": "./results",
    "mask": {"source": "extractor",
             "extractor": {"bg_side": "light"}},
})
print(summary["branch"], summary["route_reason"])
```

## System Requirements

- **Python** ≥ 3.10
- **PyTorch** ≥ 2.2 (match the build to your CUDA driver)
- **GPU** recommended for training; mask discovery runs in seconds on CPU

## Version & License

**Current version:** 1.0.0 · **License:** BSD 3-Clause · **Code:** [github.com/lucasfortune/asn2v](https://github.com/lucasfortune/asn2v)

**Author:** Lucas Fortune

---

**Next steps:** start with the [Getting Started Guide](getting-started.md), then the [Basic Usage tutorial](tutorials/basic-usage.md).
