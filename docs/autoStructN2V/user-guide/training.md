# Training

What happens after the route is decided: data preparation, the blind-spot training loop, and how to monitor it.

## One Branch Trains

After the [routing decision](/autostructn2v/docs/concepts/routed-pipeline), exactly one model trains with its branch's recipe:

- **StructN2V branch** — the discovered spine mask blanks each prediction center *and* its correlated neighbors; recipe tuned for large patches (256, batch 24, GroupNorm).
- **N2V branch** — single-pixel blind spots; recipe tuned for throughput (patch 64, batch 128, BatchNorm).

Both use the same trainer, dataset machinery, and N2V2-style FlexibleUNet.

## Data Preparation

1. The stack's z-slices are split train/val/test by `split_ratio` (default 70/15/15).
2. The stack is normalized (`'zscore'` in the publication recipe, from training-slice statistics).
3. Random patches are sampled per slice (`patches_per_image`), sized `patch_size` (auto-shrunk when a volume is smaller than the recipe's patch).
4. In each patch, `mask_percentage` % of positions become prediction centers; each center is corrupted according to the branch kernel using UPS replacement (uniform sample from the 5×5 neighborhood).

Augmentation (flips + 90° rotations) applies only in the N2V branch — the StructN2V branch keeps it off so the mask stays aligned with the directional noise.

## The Training Loop

Per epoch: masked-loss training over all patches, then validation on held-out patches. The masked validation loss drives:

- the LR scheduler,
- early stopping (if enabled; the publication runs disable it and train the full 100 epochs),
- best-checkpoint selection — the saved `model.pth` is the best-validation-loss checkpoint.

If `clean_data` is provided, an auxiliary PSNR against ground truth is logged as a diagnostic; it never influences scheduling (publication-faithful).

## Monitoring

TensorBoard logs are written to `<experiment_dir>/logs/<timestamp>/`:

```bash
tensorboard --logdir results/my_run/logs
```

Watch for:

| Pattern | Reading |
|---------|---------|
| Both losses decrease then flatten | Healthy training |
| Val loss rises while train falls | Overfitting — early stopping would catch it |
| Loss oscillates | Learning rate too high |
| Loss flat from the start | Learning rate too low, or the data has almost no noise to learn |

## Runtime Expectations

One training run is comparable to plain N2V — the measurement adds only seconds. On a modern GPU, benchmark-sized volumes (a few hundred slices of 256–512 px) train in tens of minutes with the publication budget. CPU training works but is 10–50× slower; shrink `num_epochs` for smoke tests.

## Direct Trainer Access

For custom loops, the pieces compose:

```python
from autoStructN2V.models.factory import create_model_from_config
from autoStructN2V.trainers import AutoStructN2VTrainer
from autoStructN2V.pipeline.data import split_stack_indices, create_routed_dataloaders
```

`AutoStructN2VTrainer(model, optimizer, scheduler, device, hparams, stage=...)` accepts `stage='n2v'` or `'structn2v'` (the legacy `'stage1'`/`'stage2'` names still work). See the [Trainers API](/autostructn2v/docs/api-reference/trainers).

## Related

- [Architecture & Training Recipe](/autostructn2v/docs/concepts/architecture) — the network and the norm asymmetry
- [Configuration](/autostructn2v/docs/user-guide/configuration) — every training knob
- [Inference](/autostructn2v/docs/user-guide/inference) — using the trained model
