import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Gradient Background Shader
 */
//no seam
// const backgroundShaderMaterial = new THREE.ShaderMaterial({
//     uniforms: {
//         time: { value: 0.0 },
//         colors: {
//             value: [
//                 new THREE.Vector3(0.5, 0.2, 0.8),  // بنفش
//                 new THREE.Vector3(0.2, 0.8, 0.8),  // فیروزه‌ای
//                 new THREE.Vector3(0.8, 0.3, 0.2),  // قرمز-نارنجی
//                 new THREE.Vector3(0.3, 0.8, 0.3)   // سبز
//             ]
//         }
//     },
//     vertexShader: `
//         varying vec3 vPosition;
//         varying vec3 vNormal;
        
//         void main() {
//             vPosition = position;
//             vNormal = normalize(normal);
//             gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//         }
//     `,
//     fragmentShader: `
//         uniform float time;
//         uniform vec3 colors[4];
//         varying vec3 vPosition;
//         varying vec3 vNormal;
        
//         // تابع نویز ساده ۳D
//         float hash(float n) { return fract(sin(n) * 1e4); }
//         float hash(vec3 p) { return hash(dot(p, vec3(127.1, 311.7, 74.7))); }
        
//         float noise3D(vec3 p) {
//             vec3 i = floor(p);
//             vec3 f = fract(p);
//             f = f * f * (3.0 - 2.0 * f);
            
//             float n = i.x + i.y * 157.0 + 113.0 * i.z;
//             return mix(
//                 mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
//                     mix(hash(n + 157.0), hash(n + 158.0), f.x), f.y),
//                 mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
//                     mix(hash(n + 270.0), hash(n + 271.0), f.x), f.y), f.z);
//         }
        
//         float fbm3D(vec3 p) {
//             float value = 0.0;
//             float amplitude = 0.5;
//             float frequency = 1.0;
            
//             for (int i = 0; i < 5; i++) {
//                 value += amplitude * noise3D(p * frequency);
//                 amplitude *= 0.5;
//                 frequency *= 2.0;
//             }
            
//             return value;
//         }
        
//         void main() {
//             vec3 pos = vPosition * 0.01; // Scale
//             vec3 norm = normalize(vNormal);
//             float t = time * 0.03;
            
//             // تولید الگو با نویز ۳D - بدون وابستگی به UV!
//             float pattern = 0.0;
            
//             // لایه‌های مختلف با حرکت
//             pattern += fbm3D(pos + vec3(t, 0.0, 0.0));
//             pattern += fbm3D(pos * 1.5 + vec3(0.0, t * 0.7, 0.0)) * 0.7;
//             pattern += fbm3D(pos * 2.0 + vec3(0.0, 0.0, t * 0.4)) * 0.5;
            
//             // نرمال‌سازی
//             pattern = pattern * 0.5 + 0.5;
            
//             // ترکیب کاملاً نرم رنگ‌ها
//             float posColor = pattern * 3.0; // 0-3
            
//             // توزیع گاوسی برای ترکیب نرم
//             float w1 = exp(-pow(posColor, 2.0));
//             float w2 = exp(-pow(posColor - 1.0, 2.0));
//             float w3 = exp(-pow(posColor - 2.0, 2.0));
//             float w4 = exp(-pow(posColor - 3.0, 2.0));
            
//             float total = w1 + w2 + w3 + w4;
//             vec3 color = (colors[0] * w1 + colors[1] * w2 + 
//                          colors[2] * w3 + colors[3] * w4) / total;
            
//             // کمی variation نرم
//             color *= 0.9 + 0.1 * sin(pattern * 10.0 + t * 2.0);
            
//             gl_FragColor = vec4(color, 1.0);
//         }
//     `,
//     side: THREE.BackSide
// });

const backgroundShaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0.0 },
        speed: { value: 0.5 },
        color1: { value: new THREE.Color(0x1B262C) }, 
        color2: { value: new THREE.Color(0x3282B8) }, 
        color3: { value: new THREE.Color(0x45B7D1) }, 
        color4: { value: new THREE.Color(0x139efb) }, 
        color5: { value: new THREE.Color(0xFFD166) }  
    },
    vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying float vDistance;
        
        void main() {
            vPosition = position;
            vNormal = normalize(normal);
            
            // محاسبه فاصله از مرکز برای افکت‌های اضافی
            vDistance = length(position);
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform float speed;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        uniform vec3 color4;
        uniform vec3 color5;
        
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying float vDistance;
        
        // تابع نویز ۳ بعدی پیشرفته
        float hash(float n) { 
            return fract(sin(n) * 43758.5453123); 
        }
        
        float hash(vec3 p) { 
            return hash(dot(p, vec3(127.1, 311.7, 74.7))); 
        }
        
        float noise3D(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
            
            // منحنی نرم پنج‌درجه
            vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
            
            float a = hash(i);
            float b = hash(i + vec3(1.0, 0.0, 0.0));
            float c = hash(i + vec3(0.0, 1.0, 0.0));
            float d = hash(i + vec3(1.0, 1.0, 0.0));
            float e = hash(i + vec3(0.0, 0.0, 1.0));
            float f_val = hash(i + vec3(1.0, 0.0, 1.0));
            float g = hash(i + vec3(0.0, 1.0, 1.0));
            float h = hash(i + vec3(1.0, 1.0, 1.0));
            
            float k0 =   a;
            float k1 =   b - a;
            float k2 =   c - a;
            float k3 =   e - a;
            float k4 =   a - b - c + d;
            float k5 =   a - c - e + g;
            float k6 =   a - b - e + f_val;
            float k7 = - a + b + c - d + e - f_val - g + h;
            
            return k0 + k1*u.x + k2*u.y + k3*u.z + k4*u.x*u.y 
                   + k5*u.y*u.z + k6*u.x*u.z + k7*u.x*u.y*u.z;
        }
        
        // تابع FBM پیشرفته با حرکت
        float fbm3D(vec3 p, float t) {
            float value = 0.0;
            float amplitude = 0.5;
            float frequency = 1.0;
            float gain = 0.5;
            float lacunarity = 2.0;
            
            // اضافه کردن حرکت به هر لایه با سرعت‌های مختلف
            vec3 movement1 = vec3(t * 0.1, t * 0.07, t * 0.05);
            vec3 movement2 = vec3(t * 0.08, t * 0.12, t * 0.03);
            vec3 movement3 = vec3(t * 0.05, t * 0.09, t * 0.11);
            
            for (int i = 0; i < 6; i++) {
                // حرکت‌های مختلف برای هر لایه
                vec3 movedP = p * frequency;
                if (i == 0) movedP += movement1;
                if (i == 1) movedP += movement2;
                if (i == 2) movedP += movement3;
                if (i == 3) movedP -= movement1 * 1.3;
                if (i == 4) movedP -= movement2 * 1.7;
                if (i == 5) movedP -= movement3 * 2.1;
                
                value += amplitude * noise3D(movedP);
                amplitude *= gain;
                frequency *= lacunarity;
            }
            
            return value;
        }
        
        // تابع چرخش ۳D
        vec3 rotate3D(vec3 p, vec3 angles) {
            // چرخش حول محور X
            float cosX = cos(angles.x);
            float sinX = sin(angles.x);
            mat3 rotX = mat3(
                1.0, 0.0, 0.0,
                0.0, cosX, -sinX,
                0.0, sinX, cosX
            );
            
            // چرخش حول محور Y
            float cosY = cos(angles.y);
            float sinY = sin(angles.y);
            mat3 rotY = mat3(
                cosY, 0.0, sinY,
                0.0, 1.0, 0.0,
                -sinY, 0.0, cosY
            );
            
            // چرخش حول محور Z
            float cosZ = cos(angles.z);
            float sinZ = sin(angles.z);
            mat3 rotZ = mat3(
                cosZ, -sinZ, 0.0,
                sinZ, cosZ, 0.0,
                0.0, 0.0, 1.0
            );
            
            return rotZ * rotY * rotX * p;
        }
        
        // تابع ترکیب نرم چندرنگی
        vec3 multiColorGradient(float t) {
            // 5 رنگ با انتقال نرم
            t = t * 4.0; // تبدیل به محدوده 0-4
            
            // محاسبه وزن‌ها با توزیع گاوسی نرم
            float w1 = exp(-pow(t, 2.0) * 0.8);
            float w2 = exp(-pow(t - 1.0, 2.0) * 0.8);
            float w3 = exp(-pow(t - 2.0, 2.0) * 0.8);
            float w4 = exp(-pow(t - 3.0, 2.0) * 0.8);
            float w5 = exp(-pow(t - 4.0, 2.0) * 0.8);
            
            // نرمال‌سازی
            float total = w1 + w2 + w3 + w4 + w5;
            
            // ترکیب رنگ‌ها
            vec3 color = color1 * w1 + 
                        color2 * w2 + 
                        color3 * w3 + 
                        color4 * w4 + 
                        color5 * w5;
            
            return color / total;
        }
        
        void main() {
            float t = time * speed * 0.3;
            
            // نرمال‌سازی موقعیت
            vec3 pos = vPosition * 0.015;
            
            // چرخش مداوم فضای نویز
            vec3 rotation = vec3(
                sin(t * 0.1) * 0.5,
                cos(t * 0.07) * 0.3,
                sin(t * 0.05) * 0.4
            );
            pos = rotate3D(pos, rotation);
            
            // ایجاد چند لایه نویز متحرک
            float layer1 = fbm3D(pos, t);
            float layer2 = fbm3D(pos * 1.8 + vec3(t * 0.3), t * 1.3);
            float layer3 = fbm3D(pos * 3.2 - vec3(t * 0.2), t * 0.7);
            
            // ترکیب لایه‌ها
            float pattern = layer1 * 0.5 + 
                           layer2 * 0.3 + 
                           layer3 * 0.2;
            
            // اضافه کردن افکت موج دار
            float wave1 = sin(pos.x * 2.0 + t * 1.5) * 0.1;
            float wave2 = sin(pos.y * 3.0 + t * 1.2) * 0.07;
            float wave3 = sin(pos.z * 4.0 + t * 0.9) * 0.05;
            
            pattern += (wave1 + wave2 + wave3) * 0.3;
            
            // نرمال‌سازی نهایی
            pattern = pattern * 0.5 + 0.5;
            
            // اضافه کردن کمی variation بر اساس نرمال
            float normalVariation = dot(vNormal, vec3(0.0, 1.0, 0.0)) * 0.1;
            pattern += normalVariation;
            
            // اضافه کردن افکت pulsing (تپش)
            float pulse = sin(t * 0.5) * 0.03 + 0.97;
            pattern *= pulse;
            
            // ایجاد گرادیان متحرک
            float movingGradient = pattern + sin(t * 0.2) * 0.1;
            
            // تولید رنگ نهایی
            vec3 finalColor = multiColorGradient(movingGradient);
            
            // اضافه کردن درخشش متحرک
            float glow = sin(pattern * 6.2831 * 2.0 + t * 3.0) * 0.1 + 0.9;
            finalColor *= glow;
            
            // اضافه کردن کنتراست
            finalColor = pow(finalColor, vec3(1.1));
            
            // کمی سایه روشن بر اساس جهت
            float lighting = dot(vNormal, normalize(vec3(0.5, 1.0, 0.3))) * 0.2 + 0.8;
            finalColor *= lighting;
            
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `,
    side: THREE.BackSide
});




const backgroundGeometry = new THREE.SphereGeometry(200, 128, 128)
const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundShaderMaterial)
scene.add(backgroundMesh)

/**
 * Text Liquid Gradient Shader Material
 */
function createTextShaderMaterial() {
    return new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 },
            speed: { value: 1.0 },
            flowSpeed: { value: 1.5 },
            distortion: { value: 0.3 },
            textColor1: { value: new THREE.Color(0x260d54) }, // Bright Red/Pink
            textColor2: { value: new THREE.Color(0xffffff) }, // Bright Yellow/Gold
            textColor3: { value: new THREE.Color(0x8e66f9) }  // Bright Cyan
        },
        vertexShader: `
            varying vec3 vPosition;
            varying vec3 vNormal;
            varying vec2 vUv;
            
            void main() {
                vPosition = position;
                vNormal = normalize(normal);
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform float speed;
            uniform float flowSpeed;
            uniform float distortion;
            uniform vec3 textColor1;
            uniform vec3 textColor2;
            uniform vec3 textColor3;
            
            varying vec3 vPosition;
            varying vec3 vNormal;
            varying vec2 vUv;
            
            // Hash function for noise
            float hash(float n) { 
                return fract(sin(n) * 43758.5453123); 
            }
            
            float hash(vec3 p) { 
                return hash(dot(p, vec3(127.1, 311.7, 74.7))); 
            }
            
            // Perlin-like noise
            float noise3D(vec3 p) {
                vec3 i = floor(p);
                vec3 f = fract(p);
                vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
                
                float a = hash(i);
                float b = hash(i + vec3(1.0, 0.0, 0.0));
                float c = hash(i + vec3(0.0, 1.0, 0.0));
                float d = hash(i + vec3(1.0, 1.0, 0.0));
                float e = hash(i + vec3(0.0, 0.0, 1.0));
                float f_val = hash(i + vec3(1.0, 0.0, 1.0));
                float g = hash(i + vec3(0.0, 1.0, 1.0));
                float h = hash(i + vec3(1.0, 1.0, 1.0));
                
                float k0 = a;
                float k1 = b - a;
                float k2 = c - a;
                float k3 = e - a;
                float k4 = a - b - c + d;
                float k5 = a - c - e + g;
                float k6 = a - b - e + f_val;
                float k7 = -a + b + c - d + e - f_val - g + h;
                
                return k0 + k1*u.x + k2*u.y + k3*u.z + k4*u.x*u.y 
                       + k5*u.y*u.z + k6*u.x*u.z + k7*u.x*u.y*u.z;
            }
            
            void main() {
                float t = time * speed;
                
                // Multiple directional liquid flows
                vec2 flowUV = vUv;
                
                // Horizontal flow
                float flow1 = sin(flowUV.x * 3.0 + t * flowSpeed * 0.8) * 0.5 + 0.5;
                
                // Vertical flow
                float flow2 = sin(flowUV.y * 4.0 + t * flowSpeed * 1.2) * 0.5 + 0.5;
                
                // Diagonal flow
                float flow3 = sin((flowUV.x + flowUV.y) * 5.0 + t * flowSpeed * 1.0) * 0.5 + 0.5;
                
                // Wavy distortion for liquid surface effect
                vec3 pos = vPosition * 0.8;
                pos.x += sin(pos.y * 2.0 + t * 0.5) * distortion;
                pos.y += cos(pos.x * 2.5 + t * 0.6) * distortion;
                pos.z += sin(pos.x * 1.5 + pos.y * 1.8 + t * 0.4) * distortion;
                
                // Noise-based liquid patterns
                float noise1 = noise3D(pos + vec3(t * 0.2, 0.0, 0.0)) * 0.5 + 0.5;
                float noise2 = noise3D(pos * 1.5 + vec3(0.0, t * 0.3, 0.0)) * 0.5 + 0.5;
                float noise3 = noise3D(pos * 2.0 - vec3(t * 0.15, 0.0, 0.0)) * 0.5 + 0.5;
                
                // Combine flows and noise for liquid effect
                float liquidPattern = (flow1 + flow2 * 0.7 + flow3 * 0.5) * 0.4 +
                                    (noise1 + noise2 * 0.6 + noise3 * 0.4) * 0.6;
                
                // Create wavy ripples
                float ripple = sin(liquidPattern * 10.0 + t * 2.0) * 0.1 + 0.9;
                liquidPattern *= ripple;
                
                // Color blending zones with smooth transitions
                float c1Weight = sin(liquidPattern * 3.14159) * 0.5 + 0.5;
                float c2Weight = cos(liquidPattern * 3.14159 + 1.0) * 0.5 + 0.5;
                float c3Weight = sin(liquidPattern * 3.14159 + 2.0) * 0.5 + 0.5;
                
                // Normalize weights
                float totalWeight = c1Weight + c2Weight + c3Weight;
                c1Weight /= totalWeight;
                c2Weight /= totalWeight;
                c3Weight /= totalWeight;
                
                // Mix colors for liquid paint effect
                vec3 liquidColor = textColor1 * c1Weight +
                                 textColor2 * c2Weight +
                                 textColor3 * c3Weight;
                
                // Add shimmer/sparkle in transition zones
                float shimmer = sin(liquidPattern * 20.0 + t * 3.0) * 0.05 + 1.0;
                liquidColor *= shimmer;
                
                // Saturation boost for playful effect
                float brightness = (liquidColor.r + liquidColor.g + liquidColor.b) / 3.0;
                liquidColor = mix(liquidColor, vec3(brightness), -0.3);
                
                gl_FragColor = vec4(liquidColor, 1.0);
            }
        `
    });
}




// Background matcap material (created after textures are loaded)
let backgroundMatcapMaterial = null
const backgroundMaterials = {
    'Gradient': backgroundShaderMaterial,
    'Matcap': null
}

/**
 * Particle Configuration
 */
const particleConfig = {
    count: 150,
    size: 0.04,
    spread: 25
}
const particles = []

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
let matcapTexture = textureLoader.load('textures/matcaps/2.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Matcap textures array for random selection
 */
const matcapTextures = ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png', '10.png', '11.png', '12.png', '13.png', '14.png']
const matcapOptions = {
    '1': '1.png',
    '2': '2.png',
    '3': '3.png',
    '4': '4.png',
    '5': '5.png',
    '6 - Pink': '6.png',
    '7': '7.png',
    '8': '8.png',
    '9': '9.png',
    '10': '10.png',
    '11': '11.png',
    '12': '12.png',
    '13': '13.png',
    '14': '14.png'
}
const loadedMatcaps = {}
matcapTextures.forEach(texture => {
    const loaded = textureLoader.load(`textures/matcaps/${texture}`)
    loaded.colorSpace = THREE.SRGBColorSpace
    loadedMatcaps[texture] = loaded
})

// Create background matcap material
backgroundMatcapMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
    side: THREE.DoubleSide
})
backgroundMaterials['Matcap'] = backgroundMatcapMaterial


/**
 * Particle Textures
 */
const particleTextures = ['flame_04.png', 'flare_01.png', 'trace_01.png']  // Particle texture names
const loadedParticleTextures = {}

// Load particle textures with transparency
particleTextures.forEach(texture => {
    const loaded = textureLoader.load(`textures/particle/kenney_particle-pack/PNG (Transparent)/${texture}`)
    loadedParticleTextures[texture] = loaded
})

// Function to create canvas texture as fallback
function createFallbackTexture() {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    
    // Draw a glowing circle
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.7, 'rgba(200, 150, 255, 0.5)')
    gradient.addColorStop(1, 'rgba(150, 100, 255, 0)')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 64)
    
    const texture = new THREE.CanvasTexture(canvas)
    return texture
}

// Function to get random particle texture (with fallback)
function getRandomParticleTexture() {
    const textures = Object.values(loadedParticleTextures)
    if (textures.length === 0) {
        console.warn("No particle textures loaded. Using fallback texture.")
        return createFallbackTexture()
    }
    return textures[Math.floor(Math.random() * textures.length)]
}

// Particle materials for each texture
const particleMaterials = {}
Object.entries(loadedParticleTextures).forEach(([textureName, texture]) => {
    particleMaterials[textureName] = new THREE.PointsMaterial({
        map: texture,
        size: particleConfig.size,
        transparent: true,
        sizeAttenuation: true,
        alphaMap: texture
    })
})

/**
 * Fonts and Text Material
 */
const fontLoader = new FontLoader()
let textMaterial = null
let textShaderMaterial = null
let textMesh = null
const textMaterials = {
    'Matcap': null,
    'Liquid Gradient': null
}

/**
 * Lighting
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0x6666ff, 0.3)
pointLight.position.set(5, 5, 5)
scene.add(pointLight)

/**
 * Animated Objects
 */
const animatedObjects = []

/**
 * Add random geometry to scene
 */
function createRandomGeometry() {
    const geometries = [
        new THREE.TorusGeometry(0.3, 0.1, 16, 32),
        new THREE.TorusGeometry(0.5, 0.15, 16, 32),
        new THREE.IcosahedronGeometry(0.25, 4),
        new THREE.OctahedronGeometry(0.3, 0),
        new THREE.TetrahedronGeometry(0.35, 0),
        new THREE.BoxGeometry(0.3, 0.3, 0.3),
        new THREE.BoxGeometry(0.5, 0.5, 0.5)
    ]

    const randomGeometry = geometries[Math.floor(Math.random() * geometries.length)]
    const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

    const mesh = new THREE.Mesh(randomGeometry, material)
    mesh.position.x = (Math.random() - 0.5) * 35
    mesh.position.y = (Math.random() - 0.5) * 35
    mesh.position.z = (Math.random() - 0.5) * 35

    // Store animation data
    mesh.userData = {
        originalPosition: mesh.position.clone(),
        randomSpeed: Math.random() * 0.3 + 0.1,
        randomAxis: new THREE.Vector3(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
        ).normalize(),
        phaseOffset: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 1.5
    }

    scene.add(mesh)
    animatedObjects.push(mesh)
}

// Create random geometry objects
for (let i = 0; i < 30; i++) {
    createRandomGeometry()
}

fontLoader.load(
    'fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        // Material for text - Matcap version
        textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
        
        // Create liquid gradient shader material
        textShaderMaterial = createTextShaderMaterial()

        // Text
        const textGeometry = new TextGeometry(
            'Parisa \n Shahbazi',
            {
                font: font,
                size: 0.5,
                depth: 0.2,
                curveSegments: 49,
                bevelEnabled: true,
                bevelThickness: 0.01,
                bevelSize: 0.01,
                bevelOffset: 0,
                bevelSegments: 50
            }
        )
        textGeometry.center()

        // Create text mesh with Liquid Gradient as default
        textMesh = new THREE.Mesh(textGeometry, textShaderMaterial)
        scene.add(textMesh)
        
        // Store materials
        textMaterials['Matcap'] = textMaterial
        textMaterials['Liquid Gradient'] = textShaderMaterial

        // Textured Particles with random textures
        for(let i = 0; i < particleConfig.count; i++)
        {
            // Get random particle texture
            const randomTexture = getRandomParticleTexture()
            
            // Create sprite with random texture
            const particleMaterial = new THREE.SpriteMaterial({ 
                map: randomTexture,
                transparent: true,
                sizeAttenuation: true
            })
            const sprite = new THREE.Sprite(particleMaterial)
            sprite.scale.set(1.5, 1.5, 1)
            
            // Random positions
            sprite.position.x = (Math.random() - 0.5) * particleConfig.spread
            sprite.position.y = (Math.random() - 0.5) * particleConfig.spread
            sprite.position.z = (Math.random() - 0.5) * particleConfig.spread

            scene.add(sprite)
            particles.push(sprite)
        }
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 500)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 3.5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.autoRotate = false
controls.autoRotateSpeed = 0.5
controls.enableZoom = true
controls.enablePan = false
controls.maxDistance = 15

// Idle detection
let idleTimer = 0
let idleThreshold = 3.0
let isUserInteracting = false
let mouseX = 0
let mouseY = 0

controls.addEventListener('start', () => {
    isUserInteracting = true
    controls.autoRotate = false
})

controls.addEventListener('end', () => {
    isUserInteracting = false
    idleTimer = 0
})

// Mouse movement for camera rotation
window.addEventListener('mousemove', (event) => {
    // Normalize mouse position to -1 to 1
    mouseX = (event.clientX / sizes.width) * 2 - 1
    mouseY = -(event.clientY / sizes.height) * 2 + 1

    // Reset idle timer on mouse move
    if (!isUserInteracting) {
        idleTimer = 0
        controls.autoRotate = false
    }
})

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: false,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x000000)

/**
 * GUI Controls
 */

// Geometry folder
const geometryFolder = gui.addFolder('Geometry')
geometryFolder.add({ regenerate: () => {
    animatedObjects.forEach(obj => scene.remove(obj))
    animatedObjects.length = 0
    for (let i = 0; i < 30; i++) {
        createRandomGeometry()
    }
}}, 'regenerate')

// Background folder
const backgroundFolder = gui.addFolder('Background')
const backgroundConfig = { type: 'Gradient' }
backgroundFolder.add(backgroundConfig, 'type', ['Gradient', 'Matcap']).onChange((value) => {
    backgroundMesh.material = backgroundMaterials[value]
})


// Visual folder - Matcap selector for text and objects
const visualFolder = gui.addFolder('Visual')
const visualConfig = { matcap: '6' }
visualFolder.add(visualConfig, 'matcap', Object.keys(matcapOptions)).onChange((value) => {
    const texturePath = `textures/matcaps/${matcapOptions[value]}`
    const newMatcap = textureLoader.load(texturePath)
    newMatcap.colorSpace = THREE.SRGBColorSpace

    // Update text material
    if (textMaterial) {
        textMaterial.matcap = newMatcap
    }

    // Update all animated objects (geometries)
    animatedObjects.forEach(obj => {
        obj.material.matcap = newMatcap
    })
    
    // Note: Particles now use separate textured materials
})
// Text Settings folder
const textSettingsFolder = gui.addFolder('Text Settings')
const textConfig = { material: 'Liquid Gradient' }
const materialController = textSettingsFolder.add(textConfig, 'material', ['Matcap', 'Liquid Gradient']).onChange((value) => {
    if (textMesh) {
        textMesh.material = textMaterials[value]
    }
    // Update visibility of liquid gradient controls
    updateTextControlsVisibility(value)
})

// Create a reference object for text shader controls
const textShaderConfig = {
    speed: 1.0,
    flowSpeed: 1.5,
    distortion: 0.3
}

let speedController = null
let flowSpeedController = null
let distortionController = null
let textGradientColorsFolder = null

function updateTextControlsVisibility(materialType) {
    if (materialType === 'Liquid Gradient') {
        // Show liquid gradient controls if they exist
        if (speedController) speedController.show()
        if (flowSpeedController) flowSpeedController.show()
        if (distortionController) distortionController.show()
        
        // Show color folder
        if (textGradientColorsFolder) textGradientColorsFolder.show()
    } else {
        // Hide liquid gradient controls
        if (speedController) speedController.hide()
        if (flowSpeedController) flowSpeedController.hide()
        if (distortionController) distortionController.hide()
        
        // Hide color folder
        if (textGradientColorsFolder) textGradientColorsFolder.hide()
    }
}

// Add speed control
speedController = textSettingsFolder.add(textShaderConfig, 'speed', 0.1, 3.0, 0.1).onChange((value) => {
    if (textShaderMaterial) {
        textShaderMaterial.uniforms.speed.value = value
    }
})

// Add flow speed control
flowSpeedController = textSettingsFolder.add(textShaderConfig, 'flowSpeed', 0.5, 3.0, 0.1).onChange((value) => {
    if (textShaderMaterial) {
        textShaderMaterial.uniforms.flowSpeed.value = value
    }
})

// Add distortion control
distortionController = textSettingsFolder.add(textShaderConfig, 'distortion', 0.0, 1.0, 0.05).onChange((value) => {
    if (textShaderMaterial) {
        textShaderMaterial.uniforms.distortion.value = value
    }
})

// Text Gradient Colors folder
textGradientColorsFolder = textSettingsFolder.addFolder('Text Gradient Colors')

const textColorConfig = {
    color1: '#260d54',
    color2: '#ffffff',
    color3: '#8e66f9'
}

textGradientColorsFolder.addColor(textColorConfig, 'color1').onChange((value) => {
    if (textShaderMaterial) {
        textShaderMaterial.uniforms.textColor1.value.set(value)
    }
})

textGradientColorsFolder.addColor(textColorConfig, 'color2').onChange((value) => {
    if (textShaderMaterial) {
        textShaderMaterial.uniforms.textColor2.value.set(value)
    }
})

textGradientColorsFolder.addColor(textColorConfig, 'color3').onChange((value) => {
    if (textShaderMaterial) {
        textShaderMaterial.uniforms.textColor3.value.set(value)
    }
})

// Initialize text controls visibility for default Liquid Gradient material
updateTextControlsVisibility('Liquid Gradient')

// Shader Colors folder
const colorsFolder = gui.addFolder('Shader Colors')
const colorConfig = {
    color1: '#' + backgroundShaderMaterial.uniforms.color1.value.getHexString(),
    color2: '#' + backgroundShaderMaterial.uniforms.color2.value.getHexString(),
    color3: '#' + backgroundShaderMaterial.uniforms.color3.value.getHexString(),
    color4: '#' + backgroundShaderMaterial.uniforms.color4.value.getHexString(),
    color5: '#' + backgroundShaderMaterial.uniforms.color5.value.getHexString()
}
colorsFolder.addColor(colorConfig, 'color1').onChange((value) => {
    backgroundShaderMaterial.uniforms.color1.value.set(value)
})
colorsFolder.addColor(colorConfig, 'color2').onChange((value) => {
    backgroundShaderMaterial.uniforms.color2.value.set(value)
})
colorsFolder.addColor(colorConfig, 'color3').onChange((value) => {
    backgroundShaderMaterial.uniforms.color3.value.set(value)
})
colorsFolder.addColor(colorConfig, 'color4').onChange((value) => {
    backgroundShaderMaterial.uniforms.color4.value.set(value)
})
colorsFolder.addColor(colorConfig, 'color5').onChange((value) => {
    backgroundShaderMaterial.uniforms.color5.value.set(value)
})


/**
 * Animate
 */
const clock = new THREE.Clock()

/**
 * Animation function for moving objects
 */
function animateObjects(elapsedTime) {
    animatedObjects.forEach((obj) => {
        const { originalPosition, randomSpeed, randomAxis, phaseOffset, rotationSpeed } = obj.userData

        // Smooth, slow, random movement
        const moveAmount = 0.8
        const moveX = Math.sin(elapsedTime * randomSpeed * 0.3 + phaseOffset) * moveAmount * randomAxis.x
        const moveY = Math.cos(elapsedTime * randomSpeed * 0.4 + phaseOffset) * moveAmount * randomAxis.y
        const moveZ = Math.sin(elapsedTime * randomSpeed * 0.2 + phaseOffset) * moveAmount * randomAxis.z

        obj.position.x = originalPosition.x + moveX
        obj.position.y = originalPosition.y + moveY
        obj.position.z = originalPosition.z + moveZ

        // Faster, more dynamic rotation
        obj.rotation.x += rotationSpeed * 0.04
        obj.rotation.y += rotationSpeed * 0.06
        obj.rotation.z += rotationSpeed * 0.03
    })
}
let time = 0;
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = clock.getDelta()
 // آپدیت زمان
    time += 0.016; // تقریباً 60 فریم بر ثانیه
    
    // آپدیت uniform زمان
    backgroundShaderMaterial.uniforms.time.value = time;
    
    // Update text shader time if using liquid gradient
    if (textShaderMaterial && textMesh && textMesh.material === textShaderMaterial) {
        textShaderMaterial.uniforms.time.value = time
    }    
    // Smooth text rotation around Y-axis (vertical)
    if (textMesh) {
        textMesh.rotation.y += 0.0008
    }
    // چرخش ملایم کره (اختیاری)
    // backgroundMesh.rotation.y += 0.0005;
    // backgroundMesh.rotation.x += 0.0003;
    // Update shader uniforms
    // backgroundShaderMaterial.uniforms.time.value = elapsedTime
    // bgMaterial.uniforms.time.value = elapsedTime

    // Auto-rotation after idle period
    if (!isUserInteracting) {
        idleTimer += deltaTime
        if (idleTimer > idleThreshold) {
            controls.autoRotate = true
        }
    }

    // Animate moving objects
    animateObjects(elapsedTime)

    // Apply mouse-based camera rotation
    if (!controls.autoRotate) {
        // Rotate camera based on mouse position
        const targetRotationX = mouseY * Math.PI * 0.5
        const targetRotationY = mouseX * Math.PI * 1.5

        camera.rotation.order = 'YXZ'
        camera.rotation.y += (targetRotationY - camera.rotation.y) * 0.05
        camera.rotation.x += (targetRotationX - camera.rotation.x) * 0.05
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
