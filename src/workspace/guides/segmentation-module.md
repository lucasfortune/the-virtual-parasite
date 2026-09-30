---
layout: doc
title: Segmentation Module
---

# Segmentation Module

Train U-Net models for biomedical image segmentation or use pretrained models to segment new data.

![Segmentation Module Overview](/guides/segmentation-overview.png)
*The Segmentation module showing the step navigation and workflow selection*

---

## Overview

The Segmentation module provides a complete machine learning pipeline for training and applying U-Net segmentation models. It supports two workflows:

| Workflow | Description | Steps |
|----------|-------------|-------|
| **Train from Scratch** | Train a new model using your images and annotations | Step 1 → Step 2 → Step 3 → Step 4 |
| **Import Pretrained Model** | Use an existing model to segment new data | Step 1 → Step 4 (skip Steps 2-3) |

For more background, see [Segmentation Overview](/workspace/docs/modules/segmentation/_module).

---

## Quick Start

### Training Workflow
1. Launch the **Segmentation** module from the Hub
2. Expand "Train from Scratch" and select your raw images and annotations
3. Configure training parameters (or use defaults)
4. Start training and monitor progress
5. Upload inference data and run segmentation

### Import Model Workflow
1. Launch the **Segmentation** module from the Hub
2. Expand "Use Pretrained Model" and select your model (.pth) and config (.json) files
3. Skip to Step 4, upload inference data, and run segmentation

### bioimage.io Workflow
1. Launch the **Segmentation** module from the Hub
2. Expand "Use a bioimage.io Model" and pick a model from the zoo list (or an uploaded package)
3. Skip to Step 4, choose the output conversion, upload inference data, and run segmentation

---

## Step-by-Step Guide

### Step 1: Training Data or Model Selection

This step offers three mutually exclusive workflows. Expanding one section collapses the others. For help choosing, see [Workflow Choice](/workspace/docs/modules/segmentation/step1-workflow-choice).

![Step 1 Workflow Selection](/guides/segmentation-step1.png)
*Choose between training a new model, importing an existing one, or running a bioimage.io model*

#### Option A: Train from Scratch

Expand the **Train from Scratch** section to upload your training data:

| Input | Format | Description |
|-------|--------|-------------|
| **Raw Images** | TIFF stack | Your microscopy images for training. See [Raw Images](/workspace/docs/modules/segmentation/step1-raw-images) |
| **Annotations** | TIFF stack | Corresponding segmentation masks (same dimensions). See [Annotations](/workspace/docs/modules/segmentation/step1-annotations) |

Both files of a pair must have matching dimensions (width, height, number of slices).

**To select files:**
1. Click the file selector for each input type
2. Choose a file from your workspace or upload a new one
3. Wait for validation to complete (green checkmark indicates success)
4. Click **Next: Configuration** when the pair is validated

**Several stacks.** A run can train on more than one raw/annotation pair, for example annotated stacks from different acquisitions. Click **Add pair** to keep the selected pair in the list and pick the next one; remove a pair with the cross at the end of its row. Pairs may differ in width and height. See [Training Pairs](/workspace/docs/modules/segmentation/step1-training-pairs).

**Partially annotated stacks.** Only slices with at least one labelled pixel are used; empty slices are skipped, so you can annotate every fifth slice and train on those. On a slice you did label, every unlabelled pixel counts as background, so label included slices completely. The validation summary shows how many slices of each pair are labelled.

**Predictions as masks.** The Annotations selector also lists segmentation results (inference output, cleanup output) under Recent Results, so a corrected prediction can be trained on directly.

#### Option B: Use Pretrained Model

Expand the **Use Pretrained Model** section to import an existing model:

| Input | Format | Description |
|-------|--------|-------------|
| **Model File** | .pth | PyTorch model weights. See [Model File](/workspace/docs/modules/segmentation/step1-model-file) |
| **Config File** | .json | Model configuration (architecture, classes). See [Config File](/workspace/docs/modules/segmentation/step1-config-file) |

> **Note:** When using a pretrained model, Steps 2 and 3 are skipped. After validation, click **Next** to proceed directly to Step 4 (Inference).

#### Option C: Use a bioimage.io Model

Expand the **Use a bioimage.io Model** section to run a published model from the [bioimage.io model zoo](https://bioimage.io) without training. See [bioimage.io Models](/workspace/docs/modules/segmentation/step1-bioimageio).

| Input | Description |
|-------|-------------|
| **Zoo list** | Searchable list of the zoo models the workspace can run: PyTorch weights, one grayscale input, 2D or 3D, and no missing Python packages for the model's architecture code. Denoising and other non-segmentation models are hidden unless you tick *Show all runnable models* |
| **Uploaded package** | A bioimage.io package (.zip) uploaded through the file browser under Model Files, or exported from one of your own trained models with the file browser's *Export as bioimage.io package…* action (see [bioimage.io Export](/workspace/docs/modules/file-browser/bioimageio-export)). See [bioimage.io Package Upload](/workspace/docs/modules/segmentation/step1-bioimageio-package) |

Selecting a model shows a card with its input geometry, output channels, weight format, license and citation. Only the description is fetched at this point; the weights are downloaded when the first run starts and kept in a server-wide cache. A small model card is written to your workspace so that every result records which model produced it.

> **Note:** As with an imported model, Steps 2 and 3 are skipped. Zoo models are trained on their own datasets, so a first result on unlike data can be rough; correct it in the Annotation module and train a workspace model on the corrected annotation.

---

### Step 2: Training Configuration

*This step is only shown for the Train from Scratch workflow.*

Configure how your model will be trained. Default values work well for most cases. Fields are validated in real time; in particular, patch size is checked against the smallest slice of your training pairs and the chosen number of layers. The validation split is the share of each pair's labelled slices held back to score the model (a contiguous block at the end of the labelled slices, so neighbouring near-identical slices do not leak into validation). There is no separate test split; the best validation Dice is the number reported for the run. See [Training Configuration](/workspace/docs/modules/segmentation/step2).

![Step 2 Configuration](/guides/segmentation-step2.png)
*Training configuration with dataset, architecture, and training parameters*

#### Dataset Configuration

| Parameter | Default | Options | Help Article |
|-----------|---------|---------|--------------|
| **Patch Size** | 64 | 32, 48, 64, 96, 128, 256 | [Patch Size](/workspace/docs/modules/segmentation/config-patch-size) |
| **Patches per Image** | 50 | 1–100 | [Patches per Image](/workspace/docs/modules/segmentation/config-patches-per-image) |
| **Validation Split** | 15% | 5–40% | [Validation Split](/workspace/docs/modules/segmentation/config-validation-split) |
| **Batch Size** | 8 | 1, 2, 4, 8, 16, 32 | [Batch Size](/workspace/docs/modules/segmentation/config-batch-size) |
| **Data Augmentation** | Enabled | On/Off | [Augmentation](/workspace/docs/modules/segmentation/config-augmentation) |

#### Model Architecture

| Parameter | Default | Options | Help Article |
|-----------|---------|---------|--------------|
| **Number of Features** | 64 | 32, 48, 64, 96, 128 | [Number of Features](/workspace/docs/modules/segmentation/config-num-features) |
| **Number of Layers** | 4 | 2–6 | [Number of Layers](/workspace/docs/modules/segmentation/config-num-layers) |

#### Training Parameters

| Parameter | Default | Options | Help Article |
|-----------|---------|---------|--------------|
| **Learning Rate** | 1e-3 | 1e-5 to 2e-3 | [Learning Rate](/workspace/docs/modules/segmentation/config-learning-rate) |
| **Number of Epochs** | 100 | 10–500 | [Number of Epochs](/workspace/docs/modules/segmentation/config-num-epochs) |

Click **Next: Training** when you're satisfied with your configuration.

---

### Step 3: Training Progress

*This step is only shown for the Train from Scratch workflow.*

Monitor your model as it learns to segment your images. For details on interpreting training metrics, see [Training Progress](/workspace/docs/modules/segmentation/step3).

![Step 3 Training](/guides/segmentation-step3.png)
*Training progress with real-time metrics and charts*

#### Starting Training

1. Review your configuration summary
2. Click **Start Training** to begin
3. The progress display will show:
   - Current epoch / total epochs
   - Progress bar
   - Real-time metrics (Training Loss, Validation Loss, Training Dice, Validation Dice)

#### Training Charts

| Chart | Description | Help Article |
|-------|-------------|--------------|
| **Loss Curves** | Shows training and validation loss over epochs | [Loss Curves](/workspace/docs/modules/segmentation/step3-loss-curves) |
| **Dice Score** | Shows segmentation accuracy over epochs | [Dice Score](/workspace/docs/modules/segmentation/step3-dice-score) |

Good training shows both curves converging, with validation metrics close to training metrics.

#### During Training

> **Tip:** You don't need to watch the entire training process. Feel free to explore other modules while training continues in the background. Note that only one training session can run at a time.

- **Cancel Training:** Click **Cancel Training** if you need to stop early
- **Page Refresh:** If you accidentally refresh the page, the module will detect an active training session and offer to resume monitoring

#### Training Completion

When the run starts, the progress panel states how many labelled slices it trains on and how many are held back for validation.

When training finishes:
- The **Next: Inference** button becomes enabled
- Your trained model is automatically saved
- Metrics display shows final values

Click **Next: Inference** to proceed.

---

### Step 4: Run Inference

Apply your trained (or imported) model to segment new data. See [Inference Overview](/workspace/docs/modules/segmentation/step4).

![Step 4 Inference](/guides/segmentation-step4.png)
*Upload data and run segmentation with your model*

#### Select Inference Data

1. Click the file selector to choose your inference data
2. Select a TIFF stack from your workspace or upload a new one
3. The data should be similar to your training images (same modality, resolution)

> **Dimension requirement:** each slice is segmented whole (no patch tiling), so the smallest slice dimension must be between 32 and 4096 pixels **and divisible by 2^layers** (e.g. 16 for a 4-layer model). The module runs a pre-flight check and shows a warning banner if a stack is incompatible. This rule does not apply to bioimage.io models, which run tiled.

For data requirements, see [Inference Data](/workspace/docs/modules/segmentation/step4-inference-data).

#### Output Conversion (bioimage.io models)

A zoo model returns one or more probability channels rather than class labels. The **Output conversion** block above the Run button turns them into a class map:

![Output conversion block](/guides/segmentation-output-conversion.png)
*Choose how the model's channels become class labels; controls that do not apply to the loaded model are greyed out*

| Rule | Result |
|------|--------|
| **One class per channel** | Each channel is thresholded on its own; channel 1 becomes class 1, channel 2 becomes class 2, later channels win where they overlap. Right for foreground plus boundary models and for single-channel models |
| **Argmax** | Every pixel takes the channel with the highest value; channel 0 is background. Right for models whose channels are mutually exclusive classes (softmax) |

The workspace preselects a rule from the model description; the threshold defaults to 0.5. For a single-channel model both rules are greyed out with *One class per channel* selected, and with *Argmax* selected the threshold is greyed out. Both settings are recorded in the result's metadata file. See [Output Conversion](/workspace/docs/modules/segmentation/step4-output-conversion).

#### Run Segmentation

1. Click **Run Segmentation** after selecting valid data
2. Monitor the progress bar showing slice-by-slice processing (block by block for a 3D zoo model; the first run of a zoo model starts with a weights download)
3. Wait for the completion message

#### After Completion

When segmentation finishes, you'll see three options:

| Action | Description |
|--------|-------------|
| **Open in Image Viewer** | View your segmentation results immediately. See the [Image Viewer Guide](/workspace/guides/image-viewer) for navigation controls |
| **Correct in Annotation** | Open the result in the Annotation module as labels over the raw stack. Fix it with brush, eraser and fill, then create the annotation: it appears in the Annotations selector of Step 1, ready to train on together with your other pairs. Repeating this loop is usually the fastest way to improve a model |
| **Start New Run** | Reset the module to begin a new training or inference workflow |

---

## Output Files

The Segmentation module saves files to your workspace:

| Workflow | Output Location | Files |
|----------|-----------------|-------|
| **Training** | `models/segmentation/` (per job) | `best_model.pth`, `config.json`, `results.json` |
| **Inference** | `results/segmentation/` (per job) | Segmented TIFF stack, metadata JSON |

These files appear in your workspace file browser after processing completes.

---

## Troubleshooting

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| Validation fails for training data | Dimension mismatch between images and annotations | Ensure both TIFF stacks have identical dimensions |
| Training loss not decreasing | Learning rate too high or data issue | Try reducing learning rate; verify annotations are correct |
| Poor segmentation quality | Insufficient training data or epochs | Add more training data or increase epoch count |
| "Model file invalid" error | Incompatible model architecture | Ensure model and config files are from the same training session |
| Pre-flight dimension warning | Slice size not divisible by 2^layers | Crop or downscale the stack in the Preprocessing module first |
| Inference very slow | Large image stack | This is normal; processing is slice-by-slice |

---

## Related Help Articles

### Module Overview
- [Segmentation Overview](/workspace/docs/modules/segmentation/_module)

### Step 1: Data Selection
- [Data Upload](/workspace/docs/modules/segmentation/step1)
- [Workflow Choice](/workspace/docs/modules/segmentation/step1-workflow-choice)
- [Raw Images](/workspace/docs/modules/segmentation/step1-raw-images)
- [Annotations](/workspace/docs/modules/segmentation/step1-annotations)
- [Training Pairs](/workspace/docs/modules/segmentation/step1-training-pairs)
- [Model File](/workspace/docs/modules/segmentation/step1-model-file)
- [Config File](/workspace/docs/modules/segmentation/step1-config-file)
- [bioimage.io Models](/workspace/docs/modules/segmentation/step1-bioimageio)
- [bioimage.io Package Upload](/workspace/docs/modules/segmentation/step1-bioimageio-package)

### Step 2: Configuration
- [Training Configuration](/workspace/docs/modules/segmentation/step2)
- [Patch Size](/workspace/docs/modules/segmentation/config-patch-size)
- [Patches per Image](/workspace/docs/modules/segmentation/config-patches-per-image)
- [Validation Split](/workspace/docs/modules/segmentation/config-validation-split)
- [Batch Size](/workspace/docs/modules/segmentation/config-batch-size)
- [Augmentation](/workspace/docs/modules/segmentation/config-augmentation)
- [Number of Features](/workspace/docs/modules/segmentation/config-num-features)
- [Number of Layers](/workspace/docs/modules/segmentation/config-num-layers)
- [Learning Rate](/workspace/docs/modules/segmentation/config-learning-rate)
- [Number of Epochs](/workspace/docs/modules/segmentation/config-num-epochs)

### Step 3: Training
- [Training Progress](/workspace/docs/modules/segmentation/step3)
- [Loss Curves](/workspace/docs/modules/segmentation/step3-loss-curves)
- [Dice Score](/workspace/docs/modules/segmentation/step3-dice-score)

### Step 4: Inference
- [Run Inference](/workspace/docs/modules/segmentation/step4)
- [Inference Data](/workspace/docs/modules/segmentation/step4-inference-data)
- [Output Conversion](/workspace/docs/modules/segmentation/step4-output-conversion)

