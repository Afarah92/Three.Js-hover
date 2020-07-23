// Renderer
const canvas = document.querySelector("canvas");
const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true});
let materialShader;


// Camera
const fov = 90;
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




const titles = document.querySelectorAll(".title");
let currentPainter = "";


titles.forEach(title => {
  title.addEventListener("mousemove", e => {
  e.preventDefault();
  const painter = title.dataset.painter;
  uniforms.u_opacity.value = 1.0;
    
  if(painter !== currentPainter){
    currentPainter = painter;
    const painting = paintings[painter];
    
      loader.load(painting.texture, texture => {        
      
      const newTexture = loader.load(painting.texture);
      newTexture.anisotropy = renderer.getMaxAnisotropy();
      
      uniforms.u_texture.value = newTexture;
        
        
        

      //material.map.minFilter = THREE.LinearFilter; 

      //material.map.anisotropy = renderer.getMaxAnisotropy();

      const aspect = painting.width / painting.height;
      const width = aspect > 1 ? 500 : 350;
      
      mesh.scale.x = (width* getViewSize().width / window.innerWidth);
      mesh.scale.y = (width / aspect * getViewSize().height / window.innerHeight);


      //mesh.scale.x = (window.innerWidth * width * getViewSize().width / window.innerWidth);
      //mesh.scale.y = (window.innerWidth * width / aspect * getViewSize().height / window.innerHeight);
    });
  }
  
  title.classList.add("stroke");
  title.style.zIndex = "2";
  canvas.style.zIndex = "1";
  const x = e.clientX;
  const y = e.clientY;
  
  //TweenLite.to(mesh.scale, 0.5, {x: 1, y: 1});
  
  TweenLite.to(mesh.position, 0.5, 
    {x: x * getViewSize().width / window.innerWidth - getViewSize().width/2,
     y: -(y * getViewSize().height / window.innerHeight - getViewSize().height/2)}
  );
});

title.addEventListener("mouseleave", e => {
  uniforms.u_opacity.value = 0.0;
  title.classList.remove("stroke");
  title.style.zIndex = "0";
  canvas.style.zIndex = "0";
  TweenMax.killAll();
  material.opacity = 0;
  //mesh.scale.x = 0.2;
  //mesh.scale.y = 0.2;
});
});


// Images
const paintings = {
  "Rembrandt": {texture: "https://lh3.googleusercontent.com/o9j6RZxiWHzOOoQANUtAar-m3UXx48CRDG-Fox-XejqL6UBUQL3nwEIX3fYzvk6A5Wrord8qMoPsXhFUC4viHm8cIJvB8EtcTRFsZxpztmxg93KrDQPsNeKh9tUiF3iB1ZFnms0SIMKqOI28NveJ5EdOqddBCAe8dgNvFkfipdblDh1j1ROrondIf6MfqknNCc4pRUMDy42IVQ0RN2YAoaS5hRlH6Amm_PLHlzD5LkbfG3cJV7YM71yeVUcUf3N_2_sKRJqvCcMVjFImTQZtqUkowMtZiDTg_Cv0owH6OnhevE_3uByaSAHf2DCjQFtDmThWQRZxooBbdwdlxsFFGKxdBsCdsdcwe4fCW9G1Xx0JgRmUc44FX3RFdQ208caJkrDZDvc4TbfZwysil1DlFkPZkG76EUwqwCnTLUjtllzMLs5Wz0SZ0UV5f7sAMtGkMJ4Kl-jo1DRWW4iYLS6Kc_no4l0K5q4rBzTGI5tecoy5cyeCXYWndDVQL8qnTSXWRzo0fx0kFCbMu_b_leOKN6CAHwGdLlC9EQluGCqeyQk0_j39aAo_BAKS2uEELoFc2IcoAuyBzALx7oDYbOYuV7DUIq8OoNUKFT6wadIt-84t48qHeJ96V2-rOA=w2430-h1808",
                width: 1280,
                height: 1041
               },
  "Monet": {texture: "https://lh3.googleusercontent.com/9rFsigH8BBbsvaigPr0AldGzQ1oEDL2rB6EtD1uAYao6lYdilDwjCocBs8AobHfk01ixFpQCSOu1ps_2vt1TKei7iV19BhNOo06u7zkUEiU-hvm96yi7sU2olzIUjMnW3W2J52hBz9pAEUv4fFIFiyLVY9wEpgX6CuF2_ZXQYaoSkLOoioh2lh5JAvRu9sJnatKjF6suZHDUoXwC_5POfoU_DZZ3Do6iTvYmHImlJIGw5yIkaozCFO_BH4f-_6vYFYDb8ifp-_8NU1j7widKDhqt7m-xT-brPpwQcz2vYS20pGycV585dFBAvuT-UFrkzTfhBvRFUpwHGVSz-PHElP4d8NPTcL3eZ6k5VOb9cKZtw1Vt30LYFjPAg4mboQTm91_JCzt26CsSb66NSEKdEcAi1nnmZS6zbSM32O1jqCnKLticlgLYOAIANvgqRimViwkoqQpWdP6EacsbTw2JVVRCdxcAbNi0J2YEpJglu-IDt1A_4ldwTZW6OoXXtdIIDDXcIuHhS1T9wCGfUeXq712wgr-w7saPdXA6nVcsYpvGbmsqLuO4NOkN0-7bmrFLUoLssDM_PRRQLuEgneizgI7xS1OvZPNXV5itvJ1vNeSFqKGU2ybgt0guew=w3360-h1808",
                width: 1280,
                height: 996
                },
  "Klimt": {texture: "https://lh3.googleusercontent.com/B18e82v5_S-aNOijTTpGfaMACEU0ntnoTqdBJ9os2p477STAMzjl161caURokDIUuvIJeY9rDyRCjTmPvqR-5Sy0lkWCQ94nCTLuA3x3j3rgKSaJJRv43wQBEj-aWh7FFVCf9bI3F9uFmswuTkF77JZzYuRqLwG4jgDraRMhzGhiQ-MqN3T_ND3lfPjzJ1u9R6HpvKNly-Mwm_IYbZfqeQOrawqdLbqGDTDC3vLr3XeCX_u0pi3nIbU0ErMaCzoei7LC-4t0wuqk5h-44eGTEOAr-99hW_5mUwfX0A_rrOwmZixmGzyvs6iQ5VGcy6Mqts2zBC9I5x1cjDoFt1M0aBP7IcHScyzF2fCBrad9zQbGf-9GPE98zZWymZ8VO0rFZaNkgSvPw9kZ6I5xWRB6JIl7gc0Wfv-l-F6-r1Q1NH9uzhbRIs8ikEcRwVAsHInKyDnIksQu-k3d9tayZgnz_2OGa5s04l4978vgOXx2cQMkIyNGmDXcPqxc-s0x9TDKL4jBKpR2G1lFeNz4hAke5ghX-UvaJXX7xcbQvIgAPGoSU5NxIch5wKhztRgHY2hRvMLoDn1wkX6UBYEQx2F57n4KiivnHK9KyBgq9-wyRFLKuWP5oIPyrW9LHw=w3360-h1808",
                width: 1021,
                height: 1024
               },
   "Van Gogh": {texture: "https://lh3.googleusercontent.com/1jgXmePeUrAd3GO7Smkv_OQTz-UkcnmU2XUhou1_ZbZhkTVImxnOdIDy8AKELB9fIgR60GVCiWJKb9ZuCsbP3Qt22iVuHqfu-w981HzBSSknm8LG3-7BmpUXOzmzL87IEbxAY61c1KuLM2YGKPPelbTWBiL34iR0ICBVS9GcgP3pZ01DjxvSWsVcsLTVLpZJkIUQcgnWmaP2XqXA-PQe4lJbVOk-lu6mN9rPyL9yuyTGUegLr3tNmU49MgSRH3xcx0Eje9Bwvla9skoHz3t_vgmTGw6sjuX1D8KOqEazsj9V5sXoeZgMmLIhJkZ_FuBku9kAUIikrp8ExZnlreplkstihdpRK7dL0TvnSthnzZcI_28EeJR1RxkI_CtUIvfUTdMP4dzc8ChkMMIYvrB-OTrkaRlOY-s8OxXzW92gWt5qZbmfRN2aKeEdCZMe0D9tKU5Yk-JXVB_fjm6dfk84Eei8ihgPGTrlzxGH8k7QC0RTWr3LGiqbV7nY_ywM8xE2TIqNkG15eEQcVAvSjA7FbQYV1G6osrD_OmB9GJTL9QRv8fnRKX4xoLzIa0cVXDoMGP8k_QshcLRkoDg1W3Rh_qM_GZXBzAeFSmAAbpuMQ2W8DYBrIdfW3Oi35w=w2430-h1808",
                width: 1141,
                height: 904
               },
  "Degas": {texture: "https://lh3.googleusercontent.com/GWCjtt3S4vvhgYpZ_lViO9JmeJE5s4GyVSD8pcIzcIqJmyKhU-OP58a-uQjPQIE_l4if5rBXPn9MzTITT6Fp1VDGhfHId0WUUSBhU-GKCXZiJR2Mi3D1Rej59eJ9otR76RxQS5_9bXCJP1FJQYXaivZDPAPx_xtZ_R5DZ0tkJMV9ffxqbVz2NQmgjWeTyYR7G8zdftmeJSlj4Ajacxo3PsyYe2zAhgHrkIov1rdpTz8XNuVMU08BfOLVY_ym__fyDB8ykbMUiXRitKGPGrf1XI1asAStoxuuy7rrY9IE-NJUfWS3i4uGWWxbwrrRboT7xvcZFSmxqDCdU4RitzQRDmMh2WbItZRB-QOXen1nHY-aSb5m2yBkvjxIE5RLCJIrE5N8ll9921UY6AWym24B9nd0dCyhAM-A3JdnWByLi2kO5_vrLcW_XDg_2ZYLnn6ks59w8eTilM2vvP0ZQejMnudtSXnPhB0BIGmn_cqrDOp9XEQF60cUXGTmZPXJUzRUFX3wNxL0eRFOHz-_8thnEXvs_qUvYjL8VimRBUwO9yWhQ0PRoBSxOkHjSWVuUnkAGpxGzpPdxWPv1hRtUFuYVJNAU_vCIQOGjIgzbnUc8_wmQgtTaJLJrW_xBw=w2430-h1808",
                width: 1012,
                height: 1808
               },
  "Manet": {texture: "https://lh3.googleusercontent.com/7uQVsn6N3pTKOZxUr4x6UGNCJgKC5nT3060ksn8_WXfyjItSzLE3t8Qsyp75_14tZeCGZhCaaC5bQ73WLEsjt5gMKriPUQILV4NYujuqWoBJ8_RX5CLsPF8Q7WEC3hPImfstmq7oUWGm-5M4SVD9LtJv4FTW52vP-sBmxQ0q4kLdKEqBaysaRStfB-6JN-l-IOfMwtQ5FwIyHh7QWzN99MjqDb4ZCcwsdgHQjlf7B_FCMbt6RvMsbHV_B4beUL3TC44bPXBaXZYEGrHKhh2plOEupdGfee--6-JFnXODsV6XKg-oarBeCHqX2K7BEKzKH0GB_Fm3fVpUWYBAvP9U1Wn0o_Fyd408oJDY8LG7EETW50m0FEFfnspUKbWotcYZFZRmLEsv7gIIC-uRqZGDbSUddyy46cF7Qv9hcsrDlAmumzk06Bc2Ira1NtfW1tvy05ODRFncPc1ZoV6LIICa05uU3GRMjGaOkFwWBRPxJ04M2gHnleB7yJi_N2kK65u4ejPd9F9GAk6HWFxzgbec-ZoMnb4Pw-ObpONZSDrKy7N_4MZgWk7gY-viqpZFrzVS1bKgoAFBsGWZB--Gb2uOI9kZMATuFYA_G69cEv9E4IkHiPgxyjTo1Boewg=w2430-h1808",
                width: 1260,
                height: 1808
               },
  "Dali": {texture: "https://lh3.googleusercontent.com/zpOMj_fD_1AjqJ95B8V2lKDJwpGVWoweKVZK1akbEr3b9-ETJHBH0HFSvxk4w2TeducyuSCZQ_8UBa4d-c8IKK63PkLdwF2vWM1de0-BivqWK9mroLSclrTDhHcZs62v6LJvbH0uVk-yLXjJfODNE2TFBlZReGTFg4I2g0bG_oaQx3twb2K8XRFI62jrchyalaohbyb9dyRazZDBPtwmijB5pMv5ZCa7oDag4YZ1Bnc5Q_m98XnTMUGeYjkCaNNdaFOM3IG64OXhqUMV5BKMVrwVKuJSx0_U6SMg2fVMKwVbo47-1dWOYP_HtFuLfacfYZG4HZDKhRDGg_Al6oqQmtkbDd5Cauj5-GiOyWGCeMg9HvlwDX7xNFyLDExG3_GoOwFuqzvMnBMGoHS6nM2Kv5UHOk_ombkhLWXtKBqH6riwdP8IR5A1JYaQ9Mgd9Se1OEjm4wTvA739jlfkYUI2m7qIoHLiHYDBCW_laij-UCEPmJ50-Je-4Vl00-OrVD4LMRHNHB5HTLnb1Oqkgg6ToHcOETt5z_I5BKBR7xqVCToFO13I6E_A3L5-UI4NH4_R7WRqYVIVjsd7EGiHzLYIWFfM2uStQTR2e5Nuki1je3EauCq63iKnPLT9jg=w2430-h1808",
                width: 1024,
                height: 680
               },
  "Magritte": {texture: "https://lh3.googleusercontent.com/DGdRM1rOocCVCLCy2z5EodM-Pftk__vJQ9yXFMFQJmoh2l43WfHtTTaly5G-2iI0nuP3hnM3WEN935XIwbAVO0H5V-2IUN0Z47y-W3DJwLrisFisZJ-bkh2tnzmDyJJ3VTZOFrF8g-BMpQN7Mxi-XPv8B-0hXHwXoFObc_wcynRMBLgAd7elOTqFtLqXAFxQsvJ6ZjfGC99yesGg4-RHjrBxqHziU0aLTjnw46lv-P9gcEHS7NcHEhj4-m5mKUU5silbNlaIWXANaEPR7Sxu_NFSDEE8OicJm9wbr1WConJpQ1CawjU-8XUPXK96Rlmrf_DymUdZQvCTbFyTcy6C6wHl5Fad1h7Nlwfx2mWyUVs0gfiTpA3NplOifvANXd-0t_R3TxTOEOLgUVLBzThAqP0TYQc-kJsA-UR4u4d9yTJrNoDaCFpljJEYs6mXGsJYB47i37F2FVTxzgOazfLduNnbPDhxIRDB8TUWqvKrjzhhEjpWRpRyGuQHJ5UehCKN9doOURsoylGKMVyDos1fHk0QchaSqqW1oclnPnCO2Z15BokKyarXVkOd3LbAcn76XW9_wSvYAnfUbHyBZv6pYeeX7gPnTOFStYhz9jQ5FTjFLGTkRv0kZnQLAw=w2430-h1808",
                width: 610,
                height: 446
               },
  
}


function getViewSize(){
  const height = 2 * camera.position.z * Math.tan(toRadians(camera.fov/2));
  const width = height * camera.aspect;
  return {width, height};
}

function toRadians(degrees){
  return degrees * Math.PI/180;
}