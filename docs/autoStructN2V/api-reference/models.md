# API: models

Network architectures. Module: `autoStructN2V.models`.

## `FlexibleUNet` (`models/unet.py`)

The configurable U-Net both branches train. Architecture options map 1:1 to recipe keys:

| Recipe key | Effect |
|------------|--------|
| `features`, `num_layers` | Width and depth |
| `use_resize_conv`, `upsampling_mode` | Resize-convolution upsampling (`ResizeConvolution`) instead of transposed conv — prevents checkerboard artifacts |
| `remove_top_skip` | N2V2: drop the top skip connection |
| `use_blurpool` | N2V2: anti-aliased downsampling (`MaxBlurPool2d`) |
| `activation` | `'relu'` (publication) / `'elu'` (package default) |
| `norm_type`, `num_groups` | `'batch'` or `'group'` normalization |
| `init_scale` | Weight-init scaling |

Building blocks exported alongside: `MaxBlurPool2d`, `ResizeConvolution`.

Convenience constructors: `create_standard_unet(...)`, `create_resize_conv_unet(...)`.

## `AutoStructN2VModel` (`models/auto_struct_n2v.py`)

Wrapper that builds a branch model from a recipe: `.create_stage1_model(...)` (N2V branch) and `.create_stage2_model(...)` (StructN2V branch) — the stage names are legacy, the branches are current.

## Factory (`models/factory.py`)

- `create_model(stage, **arch_kwargs)` — build a model for `'n2v'`/`'structn2v'` (legacy `'stage1'`/`'stage2'` accepted)
- `create_model_from_config(config, stage)` — build directly from a validated pipeline config

## Example

```python
from autoStructN2V.models.factory import create_model_from_config
from autoStructN2V.pipeline import validate_config

config = validate_config({"input_data": "stack.tif"})
model = create_model_from_config(config, stage="structn2v")
```

See [Architecture & Training Recipe](/autostructn2v/docs/concepts/architecture) for what the publication recipe sets and why.
