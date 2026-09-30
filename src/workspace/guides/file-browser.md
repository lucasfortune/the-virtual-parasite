---
layout: doc
title: File Browser
---

# File Browser Guide

The File Browser is your central hub for managing all files in your workspace. This guide covers the complete left sidebar, including user information, workspace controls, file management, and navigation.

![Screenshot: Complete sidebar interface showing all sections](/guides/file-browser-overview.png)
*Caption: The workspace sidebar showing user info, workspace controls, file browser, and navigation*

---

## Quick Start

1. **Upload files** — Click the upload button or drag-and-drop files onto the sidebar; the workspace detects whether a file is an image, an annotation, a model, a bioimage.io package or a workspace backup
2. **Check the notification** — It names each file and the kind it was filed as; right-click a file to correct a wrong guess
3. **Navigate files** — Click folder arrows to expand/collapse, click files to select
4. **Perform actions** — Right-click any file for the context menu with download, rename, and delete options
5. **Use batch operations** — Select multiple files with checkboxes, then download as ZIP or delete in bulk

---

## Detailed Guide

### Sidebar Overview

The left sidebar contains the File Browser along with user information, workspace controls, and navigation. Here's the complete layout from top to bottom:

![Screenshot: Complete sidebar showing all sections](/guides/sidebar-complete.png)
*Complete sidebar layout from top to bottom*

| Section | Description |
|---------|-------------|
| **User Info** | Your name, account status, and logout button |
| **Workspace Info** | Help icon, download button, and workspace statistics |
| **File Browser** | Upload controls, search, and file tree |
| **Sidebar Footer** | Navigation and theme controls |

---

### User Info Section

At the top of the sidebar, you'll find your account information:

![Screenshot: User info section with name, status, and logout](/guides/sidebar-user-info.png)
*User info section displaying account details and logout option*

| Element | Description |
|---------|-------------|
| **User Name** | Your full name as registered |
| **Account Status** | Shows your approval status (Pending, Active, etc.) |
| **Logout Button** | Click to sign out and return to the welcome page |

> **Note:** Users with "Pending" status can explore the workspace and use test data, but cannot upload custom files until approved by an administrator.

---

### Workspace Info Section

Below the user info, you'll find workspace controls and statistics:

![Screenshot: Workspace info section with help, download, and stats](/guides/sidebar-workspace-info.png)
*Workspace info section with help icon, download button, and storage statistics*

| Element | Description |
|---------|-------------|
| **Help Icon** | Opens the Help & Info panel with documentation and glossary |
| **Download Workspace** | Downloads your entire workspace as a ZIP archive |
| **Files** | Total number of files in your workspace |
| **Size** | Total size of all files in your workspace |

#### Download Workspace Button

Click this button to export your entire workspace:
- Creates a ZIP archive named `workspace_<timestamp>.zip` with all your files
- Includes uploads, results, and models with the folder structure preserved (the archive reads like the tree: `results/segmentation/seg3/trypB_seg.tif`)
- Excludes cache directories (`.thumbnails`, `.slices`, `.mesh-previews`, `.preprocess`, `.segcleanup`, `.classifier`), all regenerated automatically after a restore
- Useful for backup or transferring to another session

> **Tip:** Export your workspace before major experiments to create a restore point.

---

### File Browser Section

The main file management area with upload controls, search, and file tree:

![Screenshot: File Browser interface sections labeled](/guides/file-browser-sections.png)
*File Browser interface with header, upload button, search bar and file tree*

| UI Area | Description |
|---------|-------------|
| **Header** | Contains the refresh button and "Select All" checkbox |
| **Upload Button** | Opens the file dialog; several files of different kinds at once |
| **Search Bar** | Filter files by name, type, or category |
| **File Tree** | Hierarchical view of all workspace folders and files |
| **Batch Toolbar** | Appears when files are selected; provides bulk operations |

#### Uploading Files

There is nothing to choose before uploading: the workspace detects what each file is and files it accordingly.

| File | Detected as | Stored under |
|------|-------------|--------------|
| `.tif`, `.tiff`, `.mrc` with few distinct integer values (at most 100) | Annotation | `uploads/annotations/` |
| any other `.tif`, `.tiff`, `.mrc` | Raw image | `uploads/raw/` |
| `.pth`, `.pt` | Model weights | `models/imported/` |
| `.json` | Model config | `models/imported/` |
| `.zip` containing a bioimage.io description (`rdf.yaml`) | bioimage.io package | `models/imported/` |
| `.zip` containing a workspace manifest (`metadata.json`) | Workspace backup | opens the restore confirmation |

> **Note:** There is no separate inference category: images you want to run inference on are raw images. MRC volumes are converted to TIFF on import, voxel size included. Files keep their original names; a second file with the same name gets a numbered suffix.

*Option A: Click Upload*
1. Click the upload button
2. Select one or more files from the file dialog
3. Watch the progress bar as files upload

*Option B: Drag and Drop*
1. Drag files from your computer onto the sidebar
2. The drop zone highlights when files are over it
3. Release to begin upload

![Screenshot: Drag and drop upload with highlighted drop zone](/guides/file-browser-drag-drop.png)
*Drag and drop upload with the drop zone highlighted*

**Upload Progress**

During upload, you'll see:
- A progress bar filling as each file uploads
- Text showing: "Uploading X of Y: filename"
- A notification naming each file and the kind it was filed as

**Wrong guess?** A small 8-bit image with few grey levels can be taken for an annotation. Right-click the file and choose **Mark as raw image** (or **Mark as annotation**). Uploads made from inside a module (the Add button of a file selector) are filed as the kind that selector asks for.

> **Note:** Images are limited to 200 MB per file, model files and packages to 2 GB, backups to 5 GB. Account approval is required to upload custom files; pending users can only use the built-in sample data.

#### Restore Workspace from ZIP

Replace your current workspace with a previously exported one.

1. Upload the workspace ZIP like any other file (button or drag and drop)
2. The workspace recognises the backup and shows the restore confirmation
3. **Read the warning**: This will delete all current files
4. Click "Replace Workspace" to confirm (Cancel discards the uploaded archive)
5. Wait for extraction and restoration to complete

Backups made by older versions of the workspace restore too; their manifest is upgraded on the fly.

![Screenshot: Restore workspace confirmation dialog](/guides/file-browser-restore-dialog.png)
*Restore workspace confirmation dialog warning about file replacement*

> **Warning:** Restore completely replaces your workspace. All existing files will be deleted. Export your current workspace first if needed.

#### Navigating the File Tree

Files are organized in a hierarchical folder structure:

```
uploads/
  ├── raw/                    → Raw image stacks (TIFF/MRC), under their original names
  └── annotations/            → Uploaded label masks
models/
  ├── segmentation/train<n>/  → Trained segmentation models (best_model.pth, config, results)
  ├── denoising/dn<n>/        → Trained denoising models
  ├── imported/               → Model files you upload (.pth, .json, bioimage.io .zip)
  └── bioimageio/             → export<n>/ (exported packages), zoo/<id>/ (model cards)
results/
  ├── segmentation/seg<n>/    → Segmentation outputs
  ├── denoising/filter<n>/    → Filter denoising outputs
  ├── denoising/dn<n>/        → Deep-learning denoising outputs
  ├── preprocess/prep<n>/     → Preprocessing outputs
  ├── stitching/stitch<n>/    → Stitching outputs and recipes
  ├── segcleanup/clean<n>/    → Segmentation cleanup outputs and reports
  ├── meshes/mesh<n>/         → Generated 3D meshes
  └── annotation/annot<n>/    → Annotations made in the Annotation module
```

Every run gets a numbered folder (`seg1`, `seg2`, ...), counted per workspace in the order the runs were made. Inside a run folder the files carry the same names you see in the tree, so a downloaded backup reads the same way. Run folders are created on demand, so you only see the ones that hold files.

**Expanding and Collapsing Folders**

- Click the **arrow** (▶) next to a folder to expand it
- Click again (▼) to collapse
- Folders are sorted before files; run folders in numeric order, files by name

**Selecting Files**

- **Single file**: Click the checkbox next to any file
- **Multiple files**: Click checkboxes on multiple files
- **Select all**: Click the "Select All" checkbox in the header
- **Clear selection**: Click the ✕ button in the batch toolbar

![Screenshot: File tree with multiple files selected showing checkboxes](/guides/file-browser-selection.png)
*File tree with multiple files selected using checkboxes*

#### File Information Display

Each file in the tree shows:

| Element | Description |
|---------|-------------|
| **Checkbox** | For selecting the file |
| **Thumbnail/Icon** | Preview image for TIFF files, or type icon |
| **Filename** | Full name with extension |
| **Size** | Formatted file size (KB, MB, GB) |
| **Date** | Relative time ("5 minutes ago", "2 days ago") |
| **Category Tags** | Badges showing file type (training, inference, etc.) |
| **NEW Badge** | Appears briefly on newly uploaded files |

**Thumbnail Previews**

TIFF, PNG, and JPG files display thumbnail previews instead of icons. Thumbnails are generated on-demand and cached for performance.

#### Single File Operations

Right-click any file to open the context menu:

![Screenshot: Context menu showing all available options](/guides/file-browser-context-menu.png)
*Context menu with download, rename, delete, and view info options*

**Download**

- **How**: Right-click → Download, or click the ⬇️ button
- **Result**: File downloads to your browser's default download location

**Rename**

- **How**: Right-click → Rename
- **Dialog**: The workspace's own dialog; enter the new display name (the extension must stay)
- **Behavior**: Renaming changes the friendly name shown throughout the workspace only; the underlying file and its path are never touched, so lineage, downloads, and module references keep working

> **Tip:** Use descriptive names that include the processing step or date for easier organization. Module outputs get readable, lineage-based display names automatically.

**Mark as annotation / Mark as raw image**

- **How**: Right-click an uploaded TIFF image
- **Result**: The kind detected at upload is corrected; only the tags change

**Delete**

- **How**: Right-click → Delete
- **Confirmation**: A dialog names the file and the companion files that go with it (a model's config and results, an annotation's classes file, a result's info file)
- **Result**: File and companions are permanently removed

**View File Info**

- **How**: Right-click → View Info
- **Modal displays**:
  - Name and full path (the path shows the run folder, e.g. `results/segmentation/seg3/`)
  - File size, category, and tags
  - Upload timestamp
  - **Voxel size** (TIFF stacks): read automatically on upload and inherited by derived outputs; click the edit (✏️) button to set x/y/z spacing and unit (µm, nm, mm)
  - File ID (for technical reference)
  - **Processing History**: the lineage chain (Original Upload, Denoising, Segmentation, Segmentation Training, Fine-tuning, Annotation, Mesh Generation, Preprocessing, Stitching, Segmentation Cleanup, Format Conversion, bioimage.io Export, bioimage.io Model, Duplicated, Split)
  - **Model**: the model that produced a segmentation, a denoised stack, an exported package or a fine-tuned model

![Screenshot: File info modal showing metadata and processing history](/guides/file-browser-file-info.png)
*File info modal displaying metadata and processing history*

**View JSON**

- **How**: Right-click a `.json` file → View JSON
- **Result**: a syntax-highlighted, read-only viewer (files over 10 MB cannot be viewed)

**Convert to…**

- **How**: Right-click → Convert to…
- **Conversions**: TIFF ↔ MRC (voxel size carried through), and mesh `.obj` to STL, PLY, or glTF (GLB)
- **Result**: a new file tagged `converted` is added to the workspace

**Export as bioimage.io package…**

Packages a U-Net trained in the workspace as a [bioimage.io](https://bioimage.io) model (format 0.5) that other tools, the model zoo and the workspace itself can run. See [bioimage.io Export](/workspace/docs/modules/file-browser/bioimageio-export).

- **How**: Right-click a segmentation `.pth` model file → Export as bioimage.io package… (not offered for denoising models)
- **Dialog**: package name, license (CC-BY-4.0, MIT, BSD-3-Clause or CC0-1.0) and a sample raw image; the training image is preselected when known

![Screenshot: bioimage.io export dialog with name, license and sample image](/guides/file-browser-bioimageio-export.png)
*Export dialog for a model file; the status line shows the export stages*

- **Stages**: loading, tracing to TorchScript, packaging, self-test of both weight formats (a few seconds for a small model)
- **Result**: a zip under `models/bioimageio/export<n>/` tagged `bioimageio`, with the model description, architecture file, state dict, TorchScript weights, test tensors, cover image and README. Select it in the Segmentation module under Step 1 → Use a bioimage.io Model to run it with tiled inference, or download it for other tools


#### TIFF Stack Operations

TIFF stacks have additional operations available in the context menu:

**Duplicate Stack**

Creates an exact copy of the TIFF stack.

- **How**: Right-click → Duplicate Stack
- **Result**: New file created next to the original as `originalname_copy.tif`
- **Use case**: Create a backup before processing, or create variants

**Split Stack**

Divides a multi-slice TIFF into two separate files.

- **How**: Right-click → Split Stack... (only available for stacks with >1 slice)
- **Dialog**:
  - Enter the split point (slice number)
  - Preview shows resulting slice ranges
  - Option to delete original after split
- **Result**: Creates `originalname_split_part1.tif` and `originalname_split_part2.tif`

![Screenshot: Split stack dialog showing slice range preview](/guides/file-browser-split-dialog.png)
*Split stack dialog with slice range selector and preview*

> **Tip:** Use Split Stack to separate a Z-stack into regions of interest, or to create smaller test datasets.

#### Batch Operations

When one or more files are selected, the batch toolbar appears:

![Screenshot: Batch toolbar showing selected count and action buttons](/guides/file-browser-batch-toolbar.png)
*Batch toolbar with download, delete, and clear selection buttons*

| Button | Action |
|--------|--------|
| **Download as ZIP** (⬇️) | Downloads all selected files as a single ZIP archive |
| **Delete Selected** (🗑️) | Deletes all selected files (with confirmation) |
| **Clear Selection** (✕) | Deselects all files |

**Batch Download**

1. Select the files you want to download
2. Click the download button in the batch toolbar
3. Wait for "Preparing download..." to complete
4. ZIP file downloads as `workspace_files.zip`

**Batch Delete**

1. Select the files you want to delete
2. Click the delete button in the batch toolbar
3. Confirm the deletion in the dialog
4. Files are permanently removed

> **Warning:** Batch delete cannot be undone. Double-check your selection before confirming.

#### Search and Filtering

The search bar filters files in real-time as you type.

![Screenshot: Search bar with results showing matching files](/guides/file-browser-search.png)
*Search bar with real-time filtering results*

**Search Features**

- **Real-time**: Results update as you type (300ms delay for performance)
- **Multi-word**: Separate words with spaces to search for any match (OR logic)
- **Clear**: Click the ✕ button to clear the search

**What Search Matches**

| Search Type | Example | Matches |
|-------------|---------|---------|
| **Filename** | `training` | Any file with "training" in the name |
| **Category** | `results` | Files in the results category |
| **Keywords** | `mask` | Files tagged as annotations |
| **Type** | `model` | Model files (.pth) |

**Category Keywords:**
- Raw images: `raw`, `image`, `input`
- Annotations: `annotation`, `mask`, `label`; work in progress: `wip`, `unfinished`
- Models: `weights`, `model`, `pth`; config files: `config`; bioimage.io packages and cards: `bioimageio`, `zoo`, `package`, `card`
- Segmentation: `segmentation`, `segment`, `result`
- Denoised: `denoising`, `denoised`
- Meshes: `mesh`, `3d`, `surface`
- Module outputs: `preprocess`, `stitching`, `segcleanup`, `cleanup`; recipes: `recipe`; reports: `report`, `csv`; companion files: `info`, `metadata`
- Sample data: `sample`, `demo`

**Search Results View**

When searching, the file tree switches to a flat list view showing:
- File icon/thumbnail
- Filename
- Directory path (📁 path/to/file)
- Result count

---

### Sidebar Footer

At the bottom of the sidebar are navigation and display controls:

![Screenshot: Sidebar footer with Back to Hub and theme toggle](/guides/sidebar-footer.png)
*Sidebar footer with navigation and theme toggle controls*

| Element | Description |
|---------|-------------|
| **Back to Hub** | Returns to the workspace hub (module selection screen) |
| **Theme Toggle** | Switches between light and dark display modes |

#### Back to Hub Button

Click "Back to Hub" to:
- Exit the current module
- Return to the workspace hub
- View all available modules
- Access a different processing workflow

#### Theme Toggle

Switch between light and dark modes:
- **Light Mode**: Bright background, ideal for well-lit environments
- **Dark Mode**: Dark background, reduces eye strain in low light
- Your preference is saved and persists across sessions

---

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **ESC** | Close open dialogs (file info, split dialog, context menu) |
| **Tab** | Navigate between interactive elements |
| **Enter** | Confirm dialogs |

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Image filed as annotation (or the other way round) | The content probe guessed wrong (few grey levels) | Right-click the file → Mark as raw image / Mark as annotation |
| "Not uploaded: zip is neither a workspace backup nor a bioimage.io package" | Unknown archive | Only bioimage.io packages and workspace backups can be uploaded as zip |
| "Account approval required" error | Pending user status | Wait for admin approval or use the sample data |
| File not appearing after upload | Display not refreshed | Click the refresh button (🔄) |
| Downloaded file has the display name, not the name in the backup | Downloads use the display name | Expected; the backup keeps the on-disk names |
| Split Stack not available | Single-slice TIFF | Option only appears for multi-slice stacks |
| Search not finding file | Spelling or category | Try different keywords or clear search |

---

## Related Help Articles

- [Getting Started](/workspace/guides/getting-started) — Overview of the workspace
- [Quick Annotation Tool](/workspace/docs/modules/annotation/_module) — Creating annotation files for training
- [Raw Training Images](/workspace/docs/modules/segmentation/step1-raw-images) — Requirements for training image data
- [File Upload](/workspace/docs/modules/file-browser/upload) — Uploading files to the workspace
- [File Categories](/workspace/docs/modules/file-browser/categories) — Understanding file organization

