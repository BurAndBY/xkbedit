# XKB Layout Painter

A visual, web-based tool for designing custom XKB (X Keyboard Extension) key symbol layouts for Linux. 

Instead of manually editing complex text files and looking up keysym names, simply click a key on the virtual keyboard and type the character you want it to produce.

## Features

- **Visual Interface:** See your layout mapped physically as you edit.
- **4-Level Support:** Edit all four standard XKB levels:
  1. **Normal** (Base)
  2. **Shift**
  3. **AltGr** (Level 3)
  4. **Shift + AltGr** (Level 4)
- **Smart Defaults:** Pre-filled with US QWERTY defaults, so you only need to define the keys you want to change.
- **Automatic Keysyms:** Automatically converts characters to XKB keysym names (e.g., `a` → `a`) or Unicode hex codes (e.g., `ə` → `U0259`) if no name exists.
- **Instant Export:** Generates a copy-paste ready `xkb_symbols` block.

## Development

This project uses React and Browserify. It does not require a heavy build step or complex configuration.

### Prerequisites
- Node.js (v18 or later recommended)

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the development watcher (which rebuilds the bundle on file changes):

```bash
npm run dev
```

Then open `public/index.html` in your web browser.

To build for production (minified):

```bash
npm run build
```

