# API: datasets

Patch sampling and blind-spot masking. Module: `autoStructN2V.datasets`.

## Class Overview

| Class | Role |
|-------|------|
| `BaseNoiseDataset` | Shared patch-extraction and normalization machinery |
| `TrainingDataset` | Random patches + blind-spot masking + (N2V branch) augmentation |
| `ValidationDataset` | Held-out patches with the same masking, fixed sampling |
| `TestDataset` | Full-slice access for evaluation |

In normal use you don't construct these directly — `create_routed_dataloaders` (see [pipeline API](/autostructn2v/docs/api-reference/pipeline)) builds them from the validated config and the routed branch's kernel.

## The Masking Step

`TrainingDataset.apply_mask(patch, mask, mask_strat, prediction_kernel=None)` corrupts a patch for blind-spot training:

1. `mask` marks the positions to blank (prediction centers stamped with the branch kernel, built by `create_full_mask`)
2. `mask_strat` selects the replacement values — the publication setting is UPS (strategy 3): a uniform sample from the 5×5 neighborhood excluding masked positions
3. The loss is later computed only at the prediction centers

## Notes

- `mask_percentage` counts **prediction centers**, not total corrupted pixels — a StructN2V kernel blanks several pixels per center
- Augmentation (flips + 90° rotations) is applied only when the recipe enables it; the StructN2V branch keeps it off to preserve mask–noise alignment
- The dataset classes still carry legacy ROI-selection parameters from the retired design; the pipeline hardwires `use_roi=False` and the config translator drops the old keys

## Related

- [Architecture & Training Recipe](/autostructn2v/docs/concepts/architecture) — how masking fits the training
- [Masking API](/autostructn2v/docs/api-reference/masking) — kernel construction
