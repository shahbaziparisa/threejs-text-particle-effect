# 🔨 Development Guide

This guide explains how to extend and customize this Three.js project for your own purposes.

## 📋 Project Architecture

### File Structure
```
src/
├── script.js          # Main application (1075+ lines)
│   ├── Scene setup
│   ├── Shader materials
│   ├── Text geometry
│   ├── Particle system
│   ├── Mixed geometry types (6 types)
│   ├── Camera & controls
│   ├── GUI controls
│   └── Animation loop
├── style.css          # Minimal styling
└── index.html         # HTML entry point

static/
├── textures/
│   ├── matcaps/       # 14 pre-rendered lighting textures
│   └── particle/      # Particle sprites
└── fonts/             # TrueType font files
```

## 🎯 Key Components to Modify

### 1. Changing the Text
**Location:** Line ~695

```javascript
const textGeometry = new TextGeometry(
    'Your Text Here',  // CHANGE THIS
    {
        font: font,
        size: 0.5,         // Increase for larger text
        depth: 0.2,        // Extrusion depth
        curveSegments: 49,  // Higher = smoother curves
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.01,
        bevelSegments: 50
    }
)
```

### 2. Modifying Particle Count
**Location:** Line ~510

```javascript
const particleConfig = {
    count: 150,      // CHANGE THIS (try 50-300)
    size: 0.04,      // Particle scale (0.02-0.1)
    spread: 25       // Spread radius (10-40)
}
```

### 3. Adjusting Geometry Count
**Location:** Line ~679

```javascript
for (let i = 0; i < 50; i++) {  // CHANGE THIS (try 20-100)
    createRandomGeometry()
}
```

### 4. Changing Geometry Types
**Location:** Line ~643 in `createRandomGeometry()`

Current geometries (pick any combination):
```javascript
const geometries = [
    // OctahedronGeometry variations
    new THREE.OctahedronGeometry(0.2, 0),
    new THREE.OctahedronGeometry(0.3, 0),
    new THREE.OctahedronGeometry(0.25, 1),
    
    // ConeGeometry variations
    new THREE.ConeGeometry(0.25, 0.5, 32),
    new THREE.ConeGeometry(0.3, 0.6, 16),
    
    // DodecahedronGeometry variations
    new THREE.DodecahedronGeometry(0.25, 0),
    new THREE.DodecahedronGeometry(0.3, 0),
    
    // IcosahedronGeometry variations
    new THREE.IcosahedronGeometry(0.25, 3),
    new THREE.IcosahedronGeometry(0.3, 2),
    
    // TorusGeometry variations
    new THREE.TorusGeometry(0.3, 0.1, 16, 32),
    new THREE.TorusGeometry(0.25, 0.08, 12, 24),
    
    // TorusKnotGeometry variations
    new THREE.TorusKnotGeometry(0.25, 0.08, 64, 8),
    new THREE.TorusKnotGeometry(0.2, 0.06, 64, 8)
]
```

**Available Three.js Geometries:**
```javascript
// Simple shapes
new THREE.BoxGeometry(width, height, depth)
new THREE.SphereGeometry(radius, widthSegments, heightSegments)
new THREE.ConeGeometry(radius, height, segments)
new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments)

// Polyhedra
new THREE.OctahedronGeometry(radius, detail)
new THREE.TetrahedronGeometry(radius, detail)
new THREE.IcosahedronGeometry(radius, detail)
new THREE.DodecahedronGeometry(radius, detail)

// Advanced shapes
new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments)
new THREE.TorusKnotGeometry(radius, tube, tubularSegments, radialSegments, p, q)
new THREE.PlaneGeometry(width, height, widthSegments, heightSegments)
new THREE.LatheGeometry(points, segments, phiStart, phiLength)
```

### 5. Adjusting Transparency
**Location:** Line ~657

```javascript
const material = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
    transparent: true,
    opacity: 0.6  // CHANGE: 1.0=opaque, 0.0=invisible
})
```

### 6. Camera Orbit Speed
**Location:** Line ~1083

```javascript
controls.autoRotateSpeed = 0.2  // CHANGE: Higher = faster rotation
```

### 7. Particle Animation Parameters
**Location:** Line ~746-752

```javascript
sprite.userData = {
    originalPosition: sprite.position.clone(),
    originalScale: 1.5,
    animationType: Math.random() > 0.5 ? 'bobbing' : 'pulsing',
    speed: Math.random() * 0.5 + 0.3,              // CHANGE: min + max
    phaseOffset: Math.random() * Math.PI * 2,
    bobbingAmount: Math.random() * 1.5 + 0.5,     // CHANGE: bobbing intensity
    pulsingIntensity: Math.random() * 0.4 + 0.2   // CHANGE: pulsing intensity
}
```

## 🛠️ Common Customizations

### Add a New Animation Type for Particles

1. Add the animation type to particle creation:
```javascript
animationType: Math.random() > 0.66 ? 'bobbing' : Math.random() > 0.5 ? 'pulsing' : 'orbiting'
```

2. Add case in `animateParticles()` function (line ~1038):
```javascript
else if (animationType === 'orbiting') {
    // Orbit around a center point
    const orbitRadius = 2.0
    const angle = elapsedTime * speed + phaseOffset
    particle.position.x = Math.cos(angle) * orbitRadius
    particle.position.z = Math.sin(angle) * orbitRadius
}
```

### Add More Geometry Types

1. Add to the geometries array:
```javascript
const geometries = [
    // ... existing ...
    new THREE.BoxGeometry(0.3, 0.3, 0.3),        // Cube
    new THREE.SphereGeometry(0.3, 32, 32),       // Ball
    new THREE.CylinderGeometry(0.2, 0.2, 0.4, 16), // Cylinder
]
```

### Color Geometry by Type

Create a map of geometry types to colors:
```javascript
function createRandomGeometry() {
    const geometryMap = [
        { geo: new THREE.OctahedronGeometry(0.2, 0), color: 0xFF0000 },
        { geo: new THREE.ConeGeometry(0.25, 0.5, 32), color: 0x00FF00 },
        { geo: new THREE.TorusGeometry(0.3, 0.1, 16, 32), color: 0x0000FF },
    ]
    
    const selected = geometryMap[Math.floor(Math.random() * geometryMap.length)]
    
    const material = new THREE.MeshMatcapMaterial({
        matcap: matcapTexture,
        transparent: true,
        opacity: 0.6,
        color: selected.color  // Apply color
    })
    
    const mesh = new THREE.Mesh(selected.geo, material)
    // ... rest of code
}
```

## 🎨 Working with Shaders

### Background Shader Structure

The background uses a custom GLSL shader with:

**Uniforms** (line ~121):
- `time`: Animation time
- `speed`: Overall animation speed
- `color1-5`: Color values

**Vertex Shader** (line ~130): Prepares position data

**Fragment Shader** (line ~145): 
- Noise generation
- Color blending
- Animation logic

### Modifying the Fragment Shader

Edit the `fragmentShader` property to:
```glsl
void main() {
    // Your shader code here
    float t = time * speed * 0.3;
    
    // Create patterns, colors, animations
    vec3 color = vec3(sin(t), cos(t), 0.5);
    
    gl_FragColor = vec4(color, 1.0);
}
```

## 📊 Performance Considerations

### Optimization Tips:

1. **Reduce Particle Count** for slower devices
```javascript
const particleConfig = {
    count: 50,  // Down from 150
    // ...
}
```

2. **Reduce Geometry Count** for better FPS
```javascript
for (let i = 0; i < 20; i++) {  // Down from 50
    createRandomGeometry()
}
```

3. **Simplify Geometries** with lower detail
```javascript
new THREE.OctahedronGeometry(0.3, 0)  // Detail 0 = 8 faces
new THREE.SphereGeometry(0.3, 16, 16) // Lower subdivision
```

4. **Disable Features** not needed
```javascript
controls.enableZoom = false
controls.enablePan = false
backgroundMesh.visible = false  // Hide background
```

### Performance Metrics to Monitor:

- **FPS**: Use browser DevTools → Performance tab
- **Draw Calls**: Check WebGL renderer stats
- **Memory Usage**: Monitor in DevTools → Memory

## 🔌 Adding External Assets

### Load Custom Textures

```javascript
const textureLoader = new THREE.TextureLoader()
const myTexture = textureLoader.load('path/to/texture.png')

// Use in material
const material = new THREE.MeshStandardMaterial({ map: myTexture })
```

### Load 3D Models

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const loader = new GLTFLoader()
loader.load('model.gltf', (gltf) => {
    const model = gltf.scene
    scene.add(model)
})
```

### Load Custom Fonts

```javascript
const fontLoader = new FontLoader()
fontLoader.load('fonts/my-font.json', (font) => {
    const geometry = new TextGeometry('Text', { font: font })
    // ... create mesh
})
```

## 🎮 Adding User Interactions

### Mouse Events

```javascript
window.addEventListener('click', (event) => {
    const mouse = new THREE.Vector2(
        (event.clientX / sizes.width) * 2 - 1,
        -(event.clientY / sizes.height) * 2 + 1
    )
    
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, camera)
    
    const intersects = raycaster.intersectObjects(scene.children)
    if (intersects.length > 0) {
        console.log('Clicked:', intersects[0].object)
    }
})
```

### Keyboard Controls

```javascript
const keys = {}

window.addEventListener('keydown', (e) => {
    keys[e.key] = true
})

window.addEventListener('keyup', (e) => {
    keys[e.key] = false
})

// In animation loop:
if (keys['ArrowUp']) {
    camera.position.y += 0.1
}
```

## 🧪 Testing and Debugging

### Debug Mode

Add to beginning of script:
```javascript
// Enable Three.js debugging
window.THREE = THREE  // Access in console

// Check scene graph
console.log(scene.children)

// Monitor FPS
const stats = new Stats()
document.body.appendChild(stats.dom)
// ... then call stats.update() in animation loop
```

### Common Issues

**Issue**: Particles not animating
- Check if `animateParticles()` is called in tick
- Verify particle userData is set correctly

**Issue**: Geometries not showing
- Check if createRandomGeometry() is called
- Verify material is not fully transparent
- Check geometry parameters are correct

**Issue**: Low FPS
- Reduce particle/geometry count
- Check for memory leaks (reloading many times)
- Use browser performance profiler

**Issue**: Text looks blurry
- Increase `curveSegments` in TextGeometry
- Check device pixel ratio

## 📚 Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js Geometry Reference](https://threejs.org/docs/#api/en/geometries/Geometry)
- [WebGL Shader Language (GLSL)](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language)
- [Vite Documentation](https://vitejs.dev/)
- [lil-gui Repository](https://github.com/georgealways/lil-gui)

## 🚀 Building and Deploying

### Development
```bash
npm run dev
# Opens at http://localhost:8080
```

### Production Build
```bash
npm run build
# Creates optimized files in dist/
```

### Deploy to GitHub Pages
```bash
# Build the project
npm run build

# Copy dist folder contents to gh-pages branch
git add dist/
git commit -m "Deploy"
git push origin main
```

## 💡 Next Steps

1. **Experiment**: Modify parameters and see how they affect visuals
2. **Learn GLSL**: Understand shader code for custom effects
3. **Add Features**: Try implementing one of the customization ideas
4. **Optimize**: Profile and improve performance
5. **Deploy**: Share your creation online!

Happy developing! 🎉

