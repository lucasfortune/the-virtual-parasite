# API: trainers

The training loop. Module: `autoStructN2V.trainers`.

## `AutoStructN2VTrainer` (`trainers/auto_struct_n2v.py`)

```python
AutoStructN2VTrainer(
    model, optimizer, scheduler, device, hparams, stage,
    experiment_name='experiment',
    clean_stack=None,            # optional GT: enables the aux PSNR diagnostic
    val_indices=None, aux_psnr_indices=None,
    norm_stats=None,
)
```

- `stage` accepts `'n2v'` / `'structn2v'` (legacy `'stage1'` / `'stage2'` still work)
- Masked validation loss drives the scheduler, early stopping, and best-checkpoint selection; the auxiliary clean-PSNR (when `clean_stack` is given) is logged only
- Writes TensorBoard logs under the experiment's `logs/<timestamp>/`
- Saves the best-validation checkpoint as the run's `model.pth`

## `BaseTrainer` (`trainers/base.py`)

The epoch/validation scaffolding `AutoStructN2VTrainer` builds on — subclass it for custom losses or logging.

## `EarlyStopping` (`trainers/callbacks.py`)

Patience-based stopper on the masked validation loss (`early_stopping_patience`, default 10). The publication runs disable early stopping and train the fixed 100-epoch budget; keeping it enabled is convenient for exploration since the epoch count then acts as a ceiling.

## Related

- [Training user guide](/autostructn2v/docs/user-guide/training) — the loop in context
- [Pipeline API](/autostructn2v/docs/api-reference/pipeline) — how dataloaders and models are assembled around the trainer
