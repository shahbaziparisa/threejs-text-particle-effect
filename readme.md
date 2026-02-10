# Three.js Text Particle Effect

An interactive 3D visualization built with **Three.js** featuring animated text, dynamic particles, rotating geometries, and a customizable gradient background shader.

## ✨ Features

- **Animated Text**: 3D text ("Parisa Shahbazi") with beveled edges and particle effects
- **Dynamic Particles**: Star-like particles floating around the text
- **Rotating Geometries**: Animated 3D shapes (torus, icosahedron, octahedron, etc.) with dynamic movements
- **Interactive Camera**:
  - Mouse-based rotation when idle
  - Zoom control with limits (maxDistance: 15 units)
  - Orbit controls for manual interaction
- **Customizable Gradient Background**:
  - Advanced 3D noise-based shader with 5 customizable colors
  - Smooth color transitions using Gaussian distribution
  - Real-time color adjustments via GUI
- **Material Options**:
  - Gradient Shader (default)
  - Matcap material with 14 texture options
- **Performance Optimized**: Uses matcap materials for realistic lighting without heavy computation

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/download/) (v14 or higher)
- npm (comes with Node.js)

### Installation & Running

```bash
# Install dependencies (only needed once)
npm install

# Start development server at http://localhost:8080
npm run dev

# Build for production to dist/ directory
npm run build
```

## 🎮 Controls

### Mouse & Interaction
- **Scroll/Pinch**: Zoom in/out (limited to max distance of 15 units)
- **Drag**: Manually rotate the camera
- **Idle Auto-Rotate**: Camera automatically rotates after 3 seconds of inactivity

### GUI Controls

Access the control panel in the top-left corner:

#### Background
- **Type**: Switch between "Gradient" and "Matcap" backgrounds

#### Shader Colors (Gradient only)
- **Color 1-5**: Customize the 5 colors in the animated gradient
  - Uses Gaussian distribution for smooth color blending
  - Changes apply in real-time

#### Visual
- **Matcap**: Select from 14 different matcap textures for text and geometry materials

#### Geometry
- **Regenerate**: Create new random 3D shapes at random positions

## 🏗️ Project Structure

```
threejs-text-particle-effect/
├── src/
│   ├── script.js          # Main application code
│   ├── style.css          # Styling
│   └── index.html         # HTML entry point
├── static/                # Static assets
│   ├── textures/
│   │   └── matcaps/       # 14 matcap textures
│   └── fonts/             # Helvetiker font
├── package.json           # Dependencies and scripts
└── readme.md              # This file
```

## 🎨 Shader Architecture

### Background Shader
- **Type**: Custom GLSL shader with advanced 3D noise
- **Features**:
  - Perlin-like noise function
  - Fractional Brownian Motion (FBM) for complex patterns
  - 3D position-based animation
  - 5-color gradient with Gaussian blending
  - Continuous movement and pulsing effects

### Material Types
- **MeshMatcapMaterial**: Fast, realistic lighting using pre-rendered matcap textures
- **ShaderMaterial**: Custom gradient with time-based animation

## 🔧 Key Components

### Scene Elements
1. **Text Geometry**: 3D beveled text with particle system
2. **Animated Geometries**: 30 random shapes with:
   - Independent rotation speeds (increased for visual impact)
   - Orbital movement patterns
   - Random scaling
3. **Particles**: 150 floating spheres around the text
4. **Background Sphere**: 200-unit radius with custom shader

### Animation System
- Smooth object movement using sine/cosine waves
- Fast rotations with dynamic axes
- Real-time shader time uniform updates
- Idle detection for camera auto-rotation

## 🎯 Performance Tips

- The scene supports up to 500 particles and 30+ animated geometries
- Uses optimized matcap materials instead of complex lighting
- GPU-based shader animations for smooth performance
- Respects device pixel ratio for retina displays

## 📝 Customization

### Change Text
Edit line 205 in `script.js`:
```javascript
'Parisa \n Shahbazi'  // Replace with your text
```

### Adjust Particle Count
Modify the `particleConfig` object (line 459):
```javascript
const particleConfig = {
    count: 150,      // Number of particles
    size: 0.04,      // Particle size
    spread: 25       // Spread radius
}
```

### Modify Rotation Speed
Change line 469 in `script.js`:
```javascript
rotationSpeed: (Math.random() - 0.5) * 1.5  // Increase value for faster rotation
```

### Set Camera Zoom Limit
Adjust line 564 in `script.js`:
```javascript
controls.maxDistance = 15  // Maximum zoom-out distance
```

## 🛠️ Technologies Used

- **Three.js**: 3D graphics library
- **Vite**: Build tool and dev server
- **lil-gui**: GUI control panel
- **WebGL**: GPU rendering

## 📄 License

Open source - feel free to use and modify!

## 👨‍💻 Author

**Parisa Shahbazi**

---

**Happy creating!** ✨
