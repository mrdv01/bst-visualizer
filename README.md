# BST Visualizer

A meaningful and interactive Binary Search Tree (BST) visualization tool inspired by VisualGo. This application helps students and developers understand BST operations through step-by-step animations and detailed algorithmic explanations.

[**Live Demo**](https://bst-visualizer-pi.vercel.app/)

## Features

- **Standard BST Operations**:
  - **Insert**: Add nodes with animation showing the insertion path.
  - **Search**: Visualize the search logic with comparison feedback.
  - **Remove**: Handle leaf, single-child, and two-child deletion cases.
  - **Find Min/Max**: Traverse to the leftmost or rightmost nodes.

- **Tree Traversals**:
  - **Inorder**: Left -> Root -> Right
  - **Preorder**: Root -> Left -> Right
  - **Postorder**: Left -> Right -> Root

- **Playback Controls** (VisualGo Style):
  - Play / Pause animations.
  - Step Forward / Step Backward through operations.
  - Adjustable playback speed.
  - Progress bar.

- **Interactive UI**:
  - **Info Panel**: Bottom-right collapsible panel displaying operation status, detailed pseudocode, and algorithm explanations (color-coded).
  - **Responsive Canvas**: Pan and zoom (future enhancement) ready structure.
  - **Preset Trees**: Quickly generate Perfect, Random, or Skewed trees for testing.

## Tech Stack

- **React**: Component-based UI structure.
- **Vite**: Fast build tool and dev server.
- **TypeScript**: Type safety for data structures and components.
- **Tailwind CSS**: Modern utility-first styling.

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Start the development server**:
    ```bash
    npm run dev
    ```

3.  **Build for production**:
    ```bash
    npm run build
    ```

## Usage

1.  Use the **Control Panel** on the left to select an operation.
2.  Input a value (e.g., `50`) and click the corresponding button (e.g., **Insert**).
3.  Watch the animation on the main canvas.
4.  Use the **Playback Controls** (bottom center) to pause or step through the animation.
5.  View the **Info Panel** (bottom right) for algorithmic details and pseudocode.
