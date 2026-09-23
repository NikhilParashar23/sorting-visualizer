# Visual Sorting

An interactive, high-performance web application that visualizes core sorting algorithms in real time. Built with React and Vite, the platform features dynamic step-by-step state animations, live execution counters, and responsive viewport-restricted scaling.

![Visual Sorting Screenshot](src/assets/hero.png)

## Live Demo

🔗 **[Live Application](https://sorting-visualizer-nu-teal.vercel.app/)**

---

## Features

- **6 Core Algorithms**:
  - Bubble Sort
  - Selection Sort
  - Insertion Sort
  - Quick Sort
  - Merge Sort
  - Heap Sort
- **Real-Time Execution Metrics**: Tracks comparison counts (`CMP`) and swap operations (`SWP`) dynamically during execution.
- **Interactive Control Panel**:
  - **Start / Pause / Resume**: Full step execution flow control.
  - **Dynamic Array Controls**: Real-time slider adjustments for array size (15–180 elements).
  - **Speed Controls**: Adjustable delay range (1ms–100ms) for high-speed comparisons or granular step-by-step observation.
  - **Shuffle**: Instantly generates randomized dataset states.
- **Responsive Viewport Design**: Fully constrained `100vh` flexbox engine eliminating window scrollbars across display aspect ratios.
- **Color-Coded State Visuals**:
  - 🟨 **Yellow**: Active Comparison
  - 🟥 **Red**: Swap / Overwrite Operation
  - 🟩 **Green**: Sorted Index Position
  - 🟦 **Sky Blue**: Unsorted Base State

---

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Modern CSS3 (Flexbox, Grid, Dynamic Viewport Units)
- **Deployment**: Vercel

---

## Local Setup & Development

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) installed.

### Installation

1. **Clone the repository**:
   ```bash
   git clone [https://github.com/NikhilParashar23/sorting-visualizer.git](https://github.com/NikhilParashar23/sorting-visualizer.git)
   cd sorting-visualizer
