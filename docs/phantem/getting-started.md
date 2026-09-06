# Getting Started

Install the PhantEM renderer, open a bundled sample in the tuning workbench, and know where everything lives.

## Requirements

- Python ≥ 3.9
- `numpy`, `scipy`, `scikit-image`, `tifffile`, `matplotlib`, `mrcfile` (all in `requirements.txt`)
- Optional: `bm3d` (classical-tier validation), `careamics` + a CUDA-matched torch (ML-tier validation)

The tuner server itself is standard-library only — the dependencies are for the render engine and fitters.

## Installation

```bash
git clone https://github.com/lucasfortune/phantem.git
cd phantem
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

## First Run: The Tuning Workbench

```bash
cd renderer_code
python tuner_server.py --port 8765
# open http://127.0.0.1:8765/ in a browser
```

In the top bar, point the workbench at three files plus a pixel size:

| Input | What it is |
|-------|-----------|
| **tomogram** | The intensity stack (`.tif`/`.tiff`, `.mrc`, or `.npy`) |
| **labels** | The segmentation stack, same shape (integer labels; 0 = background) |
| **noise** | A fitted noise-model JSON — **or a clean background-crop stack**, which the workbench fits server-side |
| **nm/px** | Pixel size in nanometres (sizes object radii and the PSF) |

Press **Open** — the workbench measures each class's intensity from the tomogram, and the clean and noisy renders update live as you tune. Paths are read server-side (they are paths on the machine running `tuner_server.py`).

> **Data to try immediately:** the repository's sample sets (the six development volumes) or any pair from the [Zenodo deposit](https://doi.org/10.5281/zenodo.22084921) — each ships the tomogram-derived inputs, a background crop, and a frozen config. See [The Benchmark Data](/phantem/docs/data).

## Headless Entry Points

Everything the UI does also runs from the command line:

| Command | Purpose |
|---------|---------|
| `python renderer_code/noise_fit.py crop.tif` | Fit the noise model {spectrum, banding, axial} from a background crop + run the C1 checks |
| `python validation/tune_check.py <volume> my_cfg.json` | Per-volume window-only scorecard for a config you are tuning |
| `python validation/ws_render_stacks.py [vol ...]` | Render the clean/noisy stacks (plus the negative controls) |
| `python validation/ws_t1.py [vol ...]` | T1 residual-behavior tier (median/Gaussian/NLM/BM3D) |
| `python validation/ws_t2_careamics.py` | ML tier (N2V, structN2V; T2 transfer + T1) |

## Self-Tests

```bash
python renderer_code/render_layers.py --selftest   # render-engine invariants
python renderer_code/noise_fit.py                  # fitter self-test (no args)
python renderer_code/tuner_server.py --selftest    # API validation
```

## Repository Layout

| Path | Content |
|------|---------|
| `renderer_code/` | The workbench: server, UI, render engine, noise generator, fitters, metrics, C2 checks |
| `validation/` | The C3 tier scripts, the frozen verdict, per-volume registry and evaluation windows |
| `figures_src/` | Scripts generating the paper's data figures |

## Next Steps

- [Tuner Workbench guide](/phantem/docs/user-guide/tuner-workbench) — the UI in detail
- [Tutorial: tune your own volume](/phantem/docs/tutorials/tune-your-own-volume)
- [The Noise Model](/phantem/docs/concepts/noise-model) — what the fit actually estimates
