import { Inter } from "next/font/google";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

export default function Home() {
  const canvas = useRef();

  useEffect(() => {
    // Sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    window.addEventListener("resize", () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); //cause of like second screen
    });

    // Scene
    const scene = new THREE.Scene();

    // Axes helper
    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);

    // Object
    const geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
    const parameters = {
      color: 0xffffff,
      spin: () => {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + 10 });
      },
    };
    const material = new THREE.MeshBasicMaterial({
      color: parameters.color,
      wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    scene.add(mesh);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.y = Math.PI / 2;
    camera.position.z = 3;

    scene.add(camera);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas.current,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Controls (must after Renderer)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Animate
    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      // mesh.position.x = Math.sin(elapsedTime);
      // mesh.position.y = Math.cos(elapsedTime);

      controls.update();
      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    };

    tick();
    import("dat.gui").then((dat) => {
      const gui = new dat.GUI();
      gui.addColor(parameters, "color").onChange(() => {
        material.color.set(parameters.color);
      });

      gui.add(parameters, "spin");

      const positionFolder = gui.addFolder("Position");
      positionFolder.add(mesh.position, "x").min(-3).max(3).step(0.01).name("X");
      positionFolder.add(mesh.position, "z").min(-3).max(3).step(0.01).name("Y");
      positionFolder.add(mesh.position, "y").min(-3).max(3).step(0.01).name("Z");

      const folderBooleans = gui.addFolder("Booleans");
      folderBooleans.add(mesh, "visible");
      folderBooleans.add(mesh.material, "wireframe");
    });
  }, []);

  return (
    <>
      <canvas
        ref={canvas}
        className="fixed top-0 left-0"
        /*         onClick={toggleFullscreen}
         */
      />
    </>
  );
}
