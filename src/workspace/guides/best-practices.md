---
layout: doc
title: Best Practices
---

# Best Practices

This guide covers data preparation, training recommendations, and resource management to help you get the best results from the workspace.

---

## Data Preparation

### File Format Requirements

The workspace accepts **TIFF stacks** (.tif or .tiff) for all processing modules.

| Requirement | Specification |
|-------------|---------------|
| **Format** | Multi-page TIFF stack |
| **Bit Depth** | 8-bit or 16-bit grayscale |
| **Structure** | 3D stack (slices × height × width) |
| **Channels** | Single channel (grayscale) |

**File Size Limits:**

| File Type | Maximum Size |
|-----------|--------------|
| TIFF uploads | 200 MB |
| Workspace ZIP | 5 GB |
| Model files | 2 GB |

### Image Quality

For best results, ensure your images have:

- **Proper focus** — Blurry images reduce model accuracy
- **Sufficient contrast** — Images with uniform intensity are rejected
- **Consistent acquisition** — Use the same microscope settings across your dataset

**Files automatically rejected:**
- Empty files (0 bytes)
- All-zero pixel values (no data)
- Uniform intensity (no contrast)

---

## Training Data Guidelines

### Raw Training Images

High-quality training images lead to better models:

| Guideline | Why It Matters |
|-----------|----------------|
| **Include diverse examples** | Model learns to handle variation |
| **Vary object sizes** | Handles small and large structures |
| **Include different backgrounds** | Robust to imaging variations |
| **Match inference conditions** | Similar settings improve accuracy |
| **More images = better** | Larger datasets improve generalization |

> **Tip:** Include examples of all the variations you expect to encounter in your actual data.

### Annotation Masks (for Segmentation)

Annotations tell the model what to segment. Quality directly affects results.

**Pixel Value Format:**

| Value | Meaning |
|-------|---------|
| **0** | Background (not segmented) |
| **1** | Class 1 |
| **2** | Class 2 |
| **...** | Additional classes |

Maximum **10 classes** supported.

**Annotation Quality Checklist:**

- [ ] **Consistent labeling** — Same structures labeled the same way across all slices
- [ ] **Accurate boundaries** — Trace object edges carefully
- [ ] **Complete labeling** — Label ALL instances (unlabeled objects = background)
- [ ] **Diverse examples** — Include objects at different sizes and positions

> **Warning:** Poor annotations are the #1 cause of poor segmentation results. Invest time in quality labels.

### Dimension Matching

For segmentation training, raw images and annotation masks must have:

| Dimension | Requirement |
|-----------|-------------|
| **Slices** | Identical count |
| **Width** | Identical pixels |
| **Height** | Identical pixels |

The system validates this automatically and rejects mismatched pairs.

---

## Deep Learning Denoising Data

### Minimum Requirements

| Mode | Minimum Slices |
|------|----------------|
| **2D** | 10 slices |
| **2.5D** | 20 slices |

### Noise Matching

For best denoising results:

| Factor | Recommendation |
|--------|----------------|
| **Acquisition session** | Same session preferred |
| **Microscope/camera** | Same equipment |
| **Settings** | Same imaging parameters |
| **Sample preparation** | Same protocol |

> **Important:** A model trained on one type of noise won't effectively remove a different type. If your new images have different noise characteristics, train a new model.

### Method Selection

| Noise Type | Recommended Method |
|------------|-------------------|
| Random speckle noise | N2V |
| Poisson (shot) noise | N2V |
| Gaussian noise | N2V |
| Horizontal/vertical scan lines | autoStructN2V |
| Periodic stripe artifacts | autoStructN2V |
| Camera fixed patterns | autoStructN2V |

---

## Training Tips

### Parameter Recommendations

Start with these values and adjust based on your results:

| Parameter | Recommended | Notes |
|-----------|-------------|-------|
| **Batch Size** | 4-8 | Reduce if running out of GPU memory |
| **Patch Size** | 64-256 | Larger captures more context but uses more memory |
| **Epochs** | 100 | Early stopping will end training if converged |
| **Augmentation** | Enabled | Disable only if image orientation is critical |
| **Learning Rate** | Default | Start with preset values |

### Monitoring Training Progress

Watch these indicators during training:

| Indicator | What to Look For |
|-----------|------------------|
| **Training Loss** | Should decrease over epochs |
| **Validation Loss** | Should decrease and stay close to training loss |
| **Loss Gap** | Large gap between training/validation = overfitting |
| **Dice Score** (segmentation) | Should increase toward 1.0 |

**Signs of Problems:**

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| Loss not decreasing | Learning rate too high | Try lower learning rate |
| Loss stuck at high value | Bad training data | Check annotations, add more data |
| Validation much higher than training | Overfitting | Add augmentation, more data |
| Very slow training | Large images/batch | Reduce batch size or patch size |

### Background Training

You don't need to watch training continuously:

- Training continues in the background
- Explore other modules while waiting
- Only **one training session** can run at a time
- If you refresh the page, you can resume monitoring

---

## Resource Management

### Critical: Session-Based Storage

> **Warning:** The workspace uses session-based storage. Your files exist only during your current session.
>
> **Files are cleared when you:**
> - Log out
> - Close the browser (session timeout)
> - Session expires due to inactivity
>
> **Always backup your work!**

### Backup Strategy

Follow this workflow to protect your data:

#### 1. Download Workspace Regularly

| When to Backup | Why |
|----------------|-----|
| **End of each session** | Preserve all work before logging out |
| **After training completes** | Save trained models |
| **After processing results** | Keep generated outputs |
| **Before major changes** | Safety checkpoint |

**To download:**
1. Click the **download icon** next to "Workspace" in the sidebar
2. Confirm the download
3. Wait for ZIP to generate (large workspaces take longer)
4. Save the file locally

#### 2. Organize Your Backups

Use descriptive filenames with dates:
```
workspace_2024-01-15_segmentation-trained.zip
workspace_2024-01-16_denoising-complete.zip
```

#### 3. Verify Your Backups

After restoring, check that file counts match your expectations.

### Workspace ZIP Contents

Your backup includes:

| Included | Not Included |
|----------|--------------|
| All uploaded files | Cache directories |
| Trained models | Thumbnail cache |
| Inference results | Slice cache |
| Processing outputs | Mesh preview cache |
| Folder structure | |

### Restoring a Workspace

To restore from a backup:

1. Click **Upload** in the file browser
2. Select **"Restore Workspace (ZIP)"** from the category dropdown
3. Choose your backup ZIP file
4. Confirm the restore

> **Warning:** Restoring **REPLACES** your current workspace. All existing files are deleted before restoration.

### File Size Management

Keep your workspace running smoothly:

| Action | Benefit |
|--------|---------|
| Delete unused files | Reduce workspace size |
| Monitor sidebar stats | Track total size |
| Download and clear periodically | Start fresh with backup available |
| Keep under 5 GB | Optimal performance |

---

## Troubleshooting Common Issues

| Issue | Likely Cause | Solution |
|-------|--------------|----------|
| **Upload rejected** | File too large or wrong format | Check size limits (200 MB), use TIFF format |
| **Dimension mismatch** | Raw and annotation sizes differ | Ensure identical dimensions |
| **Poor segmentation** | Insufficient or poor quality training data | Add more diverse, well-annotated data |
| **Training loss not decreasing** | Learning rate too high | Try default parameters or lower learning rate |
| **Out of memory** | Batch size too large | Reduce batch size |
| **Session expired** | Inactivity timeout | Log in again, restore from backup |
| **Slow processing** | Large images | Normal behavior; wait for completion |
| **Denoising not effective** | Wrong method for noise type | Try N2V ↔ autoStructN2V |

---

## Summary Checklist

Before starting a project:

- [ ] **Data format** — TIFF stacks, 8/16-bit grayscale
- [ ] **File sizes** — Under 200 MB per file
- [ ] **Training data** — Diverse, well-annotated, matching dimensions
- [ ] **Backup plan** — Know where you'll save workspace ZIPs

During work:

- [ ] **Monitor training** — Check loss curves for convergence
- [ ] **Backup regularly** — Download workspace after significant progress
- [ ] **Match conditions** — Use similar images for training and inference

