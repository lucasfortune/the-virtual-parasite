---
layout: home

hero:
  name: "Virtual Parasites"
  text: "Data-Driven Mechanical Models"
  tagline: Building high-resolution structural models of parasites to understand their biophysics
  image:
    src: /tbrucei-icon-main.svg
    alt: T. brucei parasite
  actions:
    - theme: brand
      text: BioMed Workspace
      link: /workspace/
    - theme: alt
      text: AutoStructN2V
      link: /autostructn2v/

features:
  - icon:
      src: /icon-denoising.svg
    title: Advanced Denoising
    details: Self-supervised methods that handle both random and structured noise patterns in microscopy data
  - icon:
      src: /icon-segmentation.svg
    title: Semantic Segmentation
    details: Deep learning workflows for pixel-level annotation of electron tomography volumes using U-Net architecture
  - icon:
      src: /icon-3d-model.svg
    title: 3D Structural Models
    details: Complete models of T. brucei cytoskeleton amenable for finite element analysis
  - icon:
      src: /icon-open-science.svg
    title: Open Science
    details: All workflows, data, and models made available for collaborators studying parasite mechanics
---

<div class="research-section">

## The Research

The parasitic life cycle involves a multitude of physical interactions with the host microenvironment during stages of motility and adhesion. This requires optimal adaptation of the mechanical properties of the parasite to its environment.

The shape and elasticity of unicellular parasites such as *Trypanosoma brucei* are largely defined by their cytoskeleton, including a subpellicular array of microtubule filaments that forms a corset around the entire cell. How exactly the interaction between the beat of the flagellum and the mechanical response of the cell body gives rise to the intricate rotational motility patterns is not fully understood.

In this project, we build **"virtual parasites"** from high-resolution image data as the basis for a precise data-driven mechanical understanding of parasite biophysics.

</div>

## Our Tools

### BioMed Workspace

A web-based platform bringing advanced machine learning and image analysis to researchers without requiring programming expertise. Features include:

- **Self-Supervised Denoising** - Noise2Void and autoStructN2V methods
- **U-Net Segmentation** - Train deep learning models for semantic segmentation
- **3D Mesh Generation** - Convert segmentations to polygon meshes
- **Interactive Visualization** - Explore results in 3D

[Explore the Workspace](/workspace/)

### AutoStructN2V

A Python module extending Noise2Void to handle structured noise patterns commonly found in microscopy images. Key features:

- **Two-Stage Pipeline** - Handles both random and structured noise
- **Automatic Noise Analysis** - No manual mask creation required
- **Flexible Architecture** - Configurable U-Net with resize convolution

[View Documentation](/autostructn2v/)

---

<div class="funding-section">

## Funding & Partners

<div class="logo-row">
  <img src="/pop_logo.svg" alt="Physics of Parasitism" />
  <img src="/dfg_logo.svg" alt="Deutsche Forschungsgemeinschaft" />
</div>

This project is funded as part of the **DFG Priority Programme SPP2332 "Physics of Parasitism"**.

</div>
