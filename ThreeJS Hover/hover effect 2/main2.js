// Renderer
const canvas = document.querySelector("canvas");
const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true});
let materialShader;


// Camera
const fov = 5;
const aspect = canvas.clientWidth / canvas.clientHeight;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 5;

// Scene
const scene = new THREE.Scene();

// Plane
const geometry = new THREE.PlaneBufferGeometry(1, 1, 20, 20);
let loader = new THREE.TextureLoader();
let texture = loader.load("https://instagram.fmex11-2.fna.fbcdn.net/vp/8932988a4ef2aaae09aabaedebe1f705/5E311A57/t51.2885-15/e35/s1080x1080/69473884_135627034391564_4551844026904473884_n.jpg?_nc_ht=instagram.fmex11-2.fna.fbcdn.net&_nc_cat=108");


//texture.anisotropy = renderer.getMaxAnisotropy();

// Vertex Shader
const uniforms = {
      u_time: {type: "f", value: 0.0},
      u_speed: {type: "f", value: 2.5},
      u_amplitude: {type: "f", value: 0.2},
      u_texture: {type: "t", value: texture},
      u_opacity: {type: "f", value: 0.0}
    }
    
    
    const vertexShader = `
    uniform float u_time;
    uniform float u_speed;
    uniform float u_amplitude;
    varying vec2 vUv;
    void main(){
      vUv = uv;
      vec3 transformed = vec3(position);
      transformed.z = position.z - sin(position.x * 5.0 + u_time * u_speed) * u_amplitude;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
    }
    `;
  
    const fragmentShader = `
    uniform float u_time;
    uniform sampler2D u_texture;
    uniform float u_opacity;
    varying vec2 vUv;


    void main(){
      vec4 rgba = texture2D(u_texture, vUv );
      gl_FragColor = rgba * vec4(1.0, 1.0, 1.0, u_opacity);
    }


    `;

const material = new THREE.ShaderMaterial({
          uniforms,
          vertexShader,
          fragmentShader,
          transparent: true
        });



const mesh = new THREE.Mesh(geometry, material);
mesh.scale.x = 350 * getViewSize().width / window.innerWidth;
mesh.scale.y = 350 * getViewSize().height / window.innerHeight;
camera.lookAt(mesh.position.x, mesh.position.y, mesh.position.z);
scene.add(mesh);


// Render loop
function render(){
  
  const needsResize = canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight;
  
  if(needsResize){
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  

  uniforms.u_time.value += 0.01;


  renderer.render(scene, camera);
  requestAnimationFrame(render);
  
}

render();

let currentItemIndex = -1;
const titles = Array.from(document.querySelectorAll(".title"));


titles.forEach(title => {
  title.addEventListener("mousemove", e => {
  e.preventDefault();
    
  const index = titles.indexOf(title);
  uniforms.u_opacity.value = 1.0;
    
  if(index !== currentItemIndex){
    currentItemIndex = index;
    title.style.color = "white";
    document.querySelector(".container").style.opacity = "0.5";
      loader.load(textures[index], texture => {        
      
      const newTexture = loader.load(textures[index]);
      newTexture.anisotropy = renderer.getMaxAnisotropy();
      
      uniforms.u_texture.value = newTexture;
       
        

      //material.map.minFilter = THREE.LinearFilter; 

      //material.map.anisotropy = renderer.getMaxAnisotropy();

      const aspect = texture.image.width / texture.image.height;
      const width = aspect > 1 ? 450: 300;
      
      mesh.scale.x = (width* getViewSize().width / window.innerWidth);
      mesh.scale.y = (width / aspect * getViewSize().height / window.innerHeight);


      //mesh.scale.x = (window.innerWidth * width * getViewSize().width / window.innerWidth);
      //mesh.scale.y = (window.innerWidth * width / aspect * getViewSize().height / window.innerHeight);
    });
  }
  
  title.classList.add("stroke");
  const x = e.clientX;
  const y = e.clientY;
  
  //TweenLite.to(mesh.scale, 0.5, {x: 1, y: 1});
  
  TweenLite.to(canvas, 0.5, 
    {x: x,
     y: y}
  );
});

title.addEventListener("mouseleave", e => {
  uniforms.u_opacity.value = 0.0;
  title.style.color = "transparent";
  TweenMax.killAll();
  material.opacity = 0;
  //mesh.scale.x = 0.2;
  //mesh.scale.y = 0.2;
});
});


// Images
const textures = [ "https://res.cloudinary.com/holatresveces/image/upload/v1571339471/Hover/51861675_125052951894056_4834879093827783118_n_sd0lyj.jpg",
"https://res.cloudinary.com/holatresveces/image/upload/v1571339472/Hover/apbio_phaidon_005_j9kykl.jpg",
"https://res.cloudinary.com/holatresveces/image/upload/v1571339474/Hover/67306493_437729746831641_7532631779574651789_n_x1zhok.jpg",
"https://res.cloudinary.com/holatresveces/image/upload/v1571339486/Hover/APBio_DoanLy_28_website_hvl7e4.jpg"
]


function getViewSize(){
  const height = 2 * camera.position.z * Math.tan(toRadians(camera.fov/2));
  const width = height * camera.aspect;
  return {width, height};
}

function toRadians(degrees){
  return degrees * Math.PI/180;
}