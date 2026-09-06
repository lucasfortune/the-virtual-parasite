# Inference

Denoising stacks with a trained model — inside the pipeline and standalone.

## Inside the Pipeline

`run_pipeline` denoises your input stack automatically after training; the result lands at `final_results/denoised_stack.tif` (float32 by default). For most uses, nothing more is needed.

## Standalone Prediction

To denoise **additional** stacks with an already-trained model, use the predictor:

```python
from autoStructN2V.inference import AutoStructN2VPredictor

predictor = AutoStructN2VPredictor.from_checkpoint(
    "results/my_run/model/model.pth",
    patch_size=64,
    overlap_tile_pad=16,
)
predictor.denoise_stack(
    "/path/to/another_stack.tif",
    output_path="/path/to/another_stack_denoised.tif",
)
```

### Constructor

```python
AutoStructN2VPredictor(model, device=None, patch_size=64, stride=None,
                       mode='2d', norm_stats=None, overlap_tile_pad=0)
```

| Parameter | Meaning |
|-----------|---------|
| `patch_size` / `stride` | Patch-based tiling of each slice (stride defaults to patch size minus overlap) |
| `overlap_tile_pad` | Context padding around each patch, cropped from the output — prevents seam artifacts. The publication recipe uses 16 |
| `norm_stats` | Normalization statistics; use the training run's stats for consistent scaling |
| `mode` | `'2d'` — slices are processed independently |

### Methods

| Method | Purpose |
|--------|---------|
| `denoise_stack(input_path, output_path=None, dtype='float32')` | Full multi-page TIFF → denoised TIFF |
| `denoise_image(image)` | One 2D array → denoised array |
| `denoise_tensor(tensor)` | Torch tensor in, torch tensor out |
| `process_directory(...)` | Batch over a directory of TIFFs |
| `AutoStructN2VPredictor.from_checkpoint(path, ...)` | Build model + predictor from a saved checkpoint |

## Matching Conditions

A model removes the noise it learned. For best results, apply it to stacks from the same acquisition conditions (same microscope/detector, similar settings). Different noise characteristics warrant a new run — and the measurement phase is cheap, so rerunning the full routed pipeline on new data costs little beyond the training itself.

## Visual Checks

```python
from autoStructN2V.inference.visualization import (
    visualize_denoising_result, compare_multiple_images, create_difference_map,
)
```

`create_difference_map(noisy, denoised)` is worth a look after every run: the removed component should look like noise (no biological structure in the residual).

## Related

- [Pipeline](/autostructn2v/docs/user-guide/pipeline) — outputs and file layout
- [Inference API](/autostructn2v/docs/api-reference/inference)
