# Architecture & Training Recipe

The network, the blind-spot training, and the frozen publication recipe — including the deliberate normalization asymmetry.

## The Network

Both branches train a **FlexibleUNet**, configured N2V2-style in the publication recipe:

| Component | Publication setting | Why |
|-----------|--------------------|----|
| Features / depth | 32 features, 2 layers | Validated size for the benchmark volumes |
| Upsampling | Resize convolution (bilinear) | Prevents checkerboard artifacts |
| Top skip connection | **Removed** (`remove_top_skip=True`) | N2V2: keeps the network from trivially copying the input |
| Downsampling | **BlurPool** (`use_blurpool=True`) | N2V2: anti-aliased, shift-invariant downsampling |
| Activation | ReLU | |

## Blind-Spot Training

Training patches are corrupted at a fraction of positions (*prediction centers*), and the network is trained to predict the original values there from context:

- **N2V branch** — each center is masked alone (1×1 kernel), 1.5% of positions.
- **StructN2V branch** — each center is masked **together with its discovered-mask neighbors**, 15% of positions. The mask tells the network which neighbors might share correlated noise, so it cannot copy the noise from them.
- **Replacement strategy** — UPS (uniform pixel selection): masked positions are replaced by a uniform sample from their 5×5 neighborhood, excluding masked positions (`masking_strategy=3`).

`mask_percentage` counts **prediction centers** (the publication convention), not total corrupted pixels — a StructN2V mask blanks several pixels per center.

## The Deliberate Norm Asymmetry

The two branches use **different normalization layers, on purpose**:

| Branch | Norm | Reason |
|--------|------|--------|
| N2V | **BatchNorm** | At ~1.5% corruption BatchNorm is fine; GroupNorm here cost up to −13 dB |
| StructN2V | **GroupNorm** | Structured masks corrupt an order of magnitude more of each patch, which mis-calibrates BatchNorm's running statistics against clean inference inputs and collapses quality (Pearson ≈0.60 → ≈0.94 after the switch) |

**Do not set both branches to the same normalization** if you tune the recipe.

## The Publication Recipe

The frozen recipe ships as `known_good_config.py` in the repository. Key values (package defaults differ — see [Configuration](/autostructn2v/docs/user-guide/configuration) for the full table):

| Setting | N2V branch | StructN2V branch |
|---------|-----------|------------------|
| Patch size | 64 | 256 (auto-shrunk per volume to fit) |
| Batch size | 128 | 24 |
| Learning rate | 1e-3 | 1e-3 |
| Patches per image | 4 | 4 |
| Mask percentage | 1.5% | 15% |
| Augmentation | on | **off** (fixed-orientation noise) |
| Norm | batch | **group** |

Top-level publication values: `num_epochs=100` (a 400-epoch probe bought ~0 dB), `early_stopping=False`, `normalize_method='zscore'` (training on [0,1] cost ~3 dB), `overlap_tile_pad=16`, seed 42.

**Augmentation is off in the StructN2V branch on purpose:** rotating or flipping a patch would rotate the directional noise structure too, breaking the alignment between the patch and its discovered mask.

## Training Mechanics

- **Data split** — z-slices split 70/15/15 into train/val/test.
- **Normalization** — z-score from training-slice statistics (publication) or unit [0,1] (package default).
- **Scheduling** — masked validation loss drives the LR scheduler, early stopping, and best-checkpoint selection. An auxiliary clean-PSNR diagnostic is computed when `clean_data` is provided but never used for scheduling (publication-faithful).
- **Inference** — patch-based prediction with overlap-tile padding (16 px in the publication recipe) to avoid seam artifacts.
- **2D only** — v1.0 trains slice by slice; the 2.5D triplet mode of earlier versions is retired (legacy configs are auto-translated, and a `'2.5d'` mode raises).

## Related

- [Configuration](/autostructn2v/docs/user-guide/configuration) — every knob with package vs publication values
- [Training](/autostructn2v/docs/user-guide/training) — running and monitoring training
- [Models API](/autostructn2v/docs/api-reference/models)
