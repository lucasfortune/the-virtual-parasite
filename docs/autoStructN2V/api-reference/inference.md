# API: inference

Patch-based prediction and result visualization. Module: `autoStructN2V.inference`.

## `AutoStructN2VPredictor` (`inference/predictor.py`)

```python
AutoStructN2VPredictor(
    model, device=None,
    patch_size=64, stride=None,
    mode='2d',
    norm_stats=None,             # use the training run's stats for consistent scaling
    overlap_tile_pad=0,          # publication recipe: 16
)
```

| Method | Purpose |
|--------|---------|
| `denoise_stack(input_path, output_path=None, dtype='float32')` | Multi-page TIFF in → denoised TIFF out |
| `denoise_image(image)` | Single 2D array |
| `denoise_tensor(tensor)` | Torch tensor in/out |
| `process_directory(...)` | Batch over a directory |
| `AutoStructN2VPredictor.from_checkpoint(path, ...)` | Rebuild model + predictor from a saved checkpoint |

Slices are tiled into patches (with `overlap_tile_pad` context that is cropped from the output to avoid seams), predicted, and reassembled with weighted blending.

## Visualization (`inference/visualization.py`)

- `visualize_denoising_result(noisy, denoised, ...)` — side-by-side panels
- `compare_multiple_images(...)` — grid comparison across methods/runs
- `create_difference_map(noisy, denoised)` — the residual; it should look like noise, with no biological structure

## Example

```python
from autoStructN2V.inference import AutoStructN2VPredictor

pred = AutoStructN2VPredictor.from_checkpoint(
    "results/my_run/model/model.pth", patch_size=64, overlap_tile_pad=16)
pred.denoise_stack("new_stack.tif", output_path="new_stack_denoised.tif")
```

See the [Inference user guide](/autostructn2v/docs/user-guide/inference) for guidance on matching acquisition conditions.
