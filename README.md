# 🐍 Neon Snake Game

A modern, responsive Snake Game built with HTML5, CSS3, and JavaScript. Designed for both desktop and mobile play, featuring a retro neon aesthetic, power-ups, difficulty levels, and high score tracking via `localStorage`.

## 🔗 Live Demo

🌐 **Play Now:** [https://snake-by-fahim.netlify.app/](https://snake-by-fahim.netlify.app/)

## 🚀 Features

- 🎮 Classic Snake gameplay
- 🧠 High Score memory using `localStorage`
- 📱 Mobile-friendly touch controls
- ⏸️ Pause/Resume support (`Space` or touch)
- 🔥 Power-ups:
  - ⚡ Speed Boost
  - 2x Double Points
  - 🛡️ Shield (No Collision)
  - 📉 Shrink Snake
- 🎨 Neon glowing design and animations
- 🎯 Difficulty Levels (1-4)
- 🕹️ Gamepad-style UI and keyboard support
- 📊 Stats & Controls guide panel

## 🧩 Files Structure

```bash
├── index.html         # Main game page
├── styles.css         # Styling for the game
├── game.js            # Core game logic
├── favicon.svg        # Favicon used in the browser tab

````

## 💻 How to Run Locally

Just open `index.html` in your browser. No backend or installation required.

### ▶️ Recommended: Run via Live Server

1. Open the project in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` → **Open with Live Server**.

## 🎮 Controls

| Key / Button | Action                     |
| ------------ | -------------------------- |
| ⬆️⬇️⬅️➡️     | Move Snake                 |
| SPACE        | Pause / Resume             |
| ENTER        | Restart After Game Over    |
| 1 – 4        | Change Difficulty          |
| S            | Show Statistics (optional) |

### 📱 Mobile Touch Controls

Use the on-screen controls to:

* Move the snake
* Pause/Resume the game

## 🏆 Power-Ups

| Symbol | Effect                |
| ------ | --------------------- |
| ⚡      | Speed Boost           |
| 2x     | Double Points         |
| 🛡️    | Shield (No Collision) |
| 📉     | Shrink Snake          |

## 🧠 Game Logic Overview

* 20x20 grid rendered with HTML `<canvas>`
* Snake and food use pixel-based positioning
* Food appears in random, non-colliding locations
* Score increases on food collection
* Game ends on wall/self collision
* Smooth animations and pulsing effects for visual polish

## 🧑‍💻 Developer

* **Name**: Md. Fahimur Rahman
* **Live Site**: [snake-by-fahim.netlify.app](https://snake-by-fahim.netlify.app)
* **Tech Stack**: HTML5, CSS3, JavaScript
* **Fonts**: [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P), [Orbitron](https://fonts.google.com/specimen/Orbitron)

## 📱 Responsive Design

Optimized for:

* Mobile phones (portrait and landscape)
* Tablets
* Desktops and large screens

Mobile controls show only on small screens.

## 🎯 Future Improvements

* Add sound effects 🎵
* Add levels or missions 🗺️
* Implement player leaderboard 📈
* Add save/load game support 💾

## 📄 License

This project is open-source and free to use.

---

Enjoy the retro fun of the Snake Game! 🐍💚

```
