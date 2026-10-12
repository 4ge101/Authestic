import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { calmSound } from '../lib/audio.ts';

interface ThreeCompanionProps {
  name?: string;
  className?: string;
}

export const ThreeCompanion: React.FC<ThreeCompanionProps> = ({
  name = 'Pip',
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [speech, setSpeech] = useState<string | null>(null);
  const speechTimeoutRef = useRef<number | null>(null);

  const encouragingNotes = [
    'Take a slow, deep breath with me.',
    'You are safe and welcome here.',
    'Go at your own comfortable pace.',
    'Great job exploring today!',
    'Your unique mind is wonderful.',
    'It is okay to pause whenever you need.'
  ];

  const handleMascotClick = () => {
    // Play soothing cheerful chime
    calmSound.playChime(true, 587.33); // D5 pitch

    // Cycle speech note
    const nextNote = encouragingNotes[Math.floor(Math.random() * encouragingNotes.length)];
    setSpeech(nextNote);

    if (speechTimeoutRef.current) {
      window.clearTimeout(speechTimeoutRef.current);
    }
    speechTimeoutRef.current = window.setTimeout(() => {
      setSpeech(null);
    }, 4500);

    // Trigger hop animation in Three.js
    if (hopTriggerRef.current) {
      hopTriggerRef.current();
    }
  };

  const hopTriggerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = 84;
    const height = 64;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.25, 4.4);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'low-power'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = false;
    container.appendChild(renderer.domElement);

    // Group for the companion
    const mascotGroup = new THREE.Group();
    mascotGroup.position.set(0, -0.15, 0);
    scene.add(mascotGroup);

    // --- MATERIALS (Soft Duolingo-style matte shading) ---
    // Cheerful friendly sage/teal green body
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x48a388,
      roughness: 0.35,
      metalness: 0.05
    });

    // Soft cream tummy
    const tummyMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4f7f4,
      roughness: 0.4,
      metalness: 0.0
    });

    // Big eye white
    const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.0
    });

    // Pupil
    const pupilMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a2e26,
      roughness: 0.1,
      metalness: 0.1
    });

    // Eye catchlight shine
    const shineMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });

    // Warm orange beak & feet
    const beakMaterial = new THREE.MeshStandardMaterial({
      color: 0xee8b38,
      roughness: 0.35,
      metalness: 0.05
    });

    // Eyelid material (same as body)
    const eyelidMaterial = new THREE.MeshStandardMaterial({
      color: 0x48a388,
      roughness: 0.35
    });

    // --- 3D MESHES ---
    // 1. Plump Body
    const bodyGeometry = new THREE.SphereGeometry(1, 32, 28);
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.scale.set(0.96, 1.06, 0.92);
    mascotGroup.add(bodyMesh);

    // 2. Soft Tummy Patch
    const tummyGeometry = new THREE.SphereGeometry(0.72, 24, 20);
    const tummyMesh = new THREE.Mesh(tummyGeometry, tummyMaterial);
    tummyMesh.scale.set(0.85, 0.95, 0.35);
    tummyMesh.position.set(0, -0.18, 0.78);
    mascotGroup.add(tummyMesh);

    // 3. Eyes Group (Left and Right)
    const eyesGroup = new THREE.Group();
    eyesGroup.position.set(0, 0.25, 0.75);
    mascotGroup.add(eyesGroup);

    const eyeRadius = 0.34;
    const pupilRadius = 0.16;

    // Left Eye
    const leftEyeGroup = new THREE.Group();
    leftEyeGroup.position.set(-0.38, 0, 0);

    const leftWhite = new THREE.Mesh(
      new THREE.SphereGeometry(eyeRadius, 24, 20),
      eyeWhiteMaterial
    );
    leftEyeGroup.add(leftWhite);

    const leftPupil = new THREE.Mesh(
      new THREE.SphereGeometry(pupilRadius, 20, 16),
      pupilMaterial
    );
    leftPupil.position.set(0, 0, eyeRadius * 0.82);
    leftEyeGroup.add(leftPupil);

    const leftShine = new THREE.Mesh(
      new THREE.SphereGeometry(0.065, 12, 10),
      shineMaterial
    );
    leftShine.position.set(0.05, 0.06, eyeRadius * 0.95);
    leftEyeGroup.add(leftShine);

    // Left Eyelid for blinking
    const leftEyelid = new THREE.Mesh(
      new THREE.SphereGeometry(eyeRadius * 1.05, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.5),
      eyelidMaterial
    );
    leftEyelid.rotation.x = -Math.PI * 0.5; // Open by default
    leftEyeGroup.add(leftEyelid);

    eyesGroup.add(leftEyeGroup);

    // Right Eye
    const rightEyeGroup = new THREE.Group();
    rightEyeGroup.position.set(0.38, 0, 0);

    const rightWhite = new THREE.Mesh(
      new THREE.SphereGeometry(eyeRadius, 24, 20),
      eyeWhiteMaterial
    );
    rightEyeGroup.add(rightWhite);

    const rightPupil = new THREE.Mesh(
      new THREE.SphereGeometry(pupilRadius, 20, 16),
      pupilMaterial
    );
    rightPupil.position.set(0, 0, eyeRadius * 0.82);
    rightEyeGroup.add(rightPupil);

    const rightShine = new THREE.Mesh(
      new THREE.SphereGeometry(0.065, 12, 10),
      shineMaterial
    );
    rightShine.position.set(0.05, 0.06, eyeRadius * 0.95);
    rightEyeGroup.add(rightShine);

    // Right Eyelid for blinking
    const rightEyelid = new THREE.Mesh(
      new THREE.SphereGeometry(eyeRadius * 1.05, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.5),
      eyelidMaterial
    );
    rightEyelid.rotation.x = -Math.PI * 0.5; // Open by default
    rightEyeGroup.add(rightEyelid);

    eyesGroup.add(rightEyeGroup);

    // 4. Cute Beak
    const beakGeometry = new THREE.ConeGeometry(0.18, 0.32, 16);
    const beakMesh = new THREE.Mesh(beakGeometry, beakMaterial);
    beakMesh.rotation.x = Math.PI * 0.5;
    beakMesh.position.set(0, 0.02, 1.02);
    beakMesh.scale.set(1.1, 0.7, 0.9);
    mascotGroup.add(beakMesh);

    // 5. Wings (Left and Right)
    const wingGeometry = new THREE.SphereGeometry(0.42, 20, 16);
    
    // Left Wing
    const leftWing = new THREE.Mesh(wingGeometry, bodyMaterial);
    leftWing.scale.set(0.28, 0.85, 0.55);
    leftWing.position.set(-0.95, -0.05, 0.1);
    leftWing.rotation.z = 0.22;
    mascotGroup.add(leftWing);

    // Right Wing
    const rightWing = new THREE.Mesh(wingGeometry, bodyMaterial);
    rightWing.scale.set(0.28, 0.85, 0.55);
    rightWing.position.set(0.95, -0.05, 0.1);
    rightWing.rotation.z = -0.22;
    mascotGroup.add(rightWing);

    // 6. Feet
    const footGeometry = new THREE.SphereGeometry(0.22, 16, 12);
    
    const leftFoot = new THREE.Mesh(footGeometry, beakMaterial);
    leftFoot.scale.set(0.85, 0.45, 1.25);
    leftFoot.position.set(-0.35, -1.02, 0.42);
    mascotGroup.add(leftFoot);

    const rightFoot = new THREE.Mesh(footGeometry, beakMaterial);
    rightFoot.scale.set(0.85, 0.45, 1.25);
    rightFoot.position.set(0.35, -1.02, 0.42);
    mascotGroup.add(rightFoot);

    // --- LIGHTING ---
    // Soft Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Main Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    // Gentle Cool Fill Light
    const fillLight = new THREE.DirectionalLight(0xdcf3ea, 0.4);
    fillLight.position.set(-3, 1, 2);
    scene.add(fillLight);

    // --- INTERACTION & ANIMATION STATE ---
    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let targetPupilX = 0;
    let targetPupilY = 0;

    // Hop state
    let isHopping = false;
    let hopStartTime = 0;
    const hopDuration = 0.5;

    hopTriggerRef.current = () => {
      isHopping = true;
      hopStartTime = performance.now() / 1000;
    };

    // Blink state
    let nextBlinkTime = performance.now() / 1000 + 2.5 + Math.random() * 3;
    let isBlinking = false;
    let blinkStartTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse to -1..1 from screen center
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseX = nx;
      mouseY = ny;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const now = performance.now() / 1000;

      // Check tab visibility or reduced motion
      const reducedMotion = document.documentElement.getAttribute('data-reduced-motion') === 'true';

      if (!reducedMotion) {
        // Idle gentle breathing
        const breath = Math.sin(now * 2.2) * 0.025;
        bodyMesh.scale.set(0.96 + breath * 0.5, 1.06 + breath, 0.92);

        // Smoothly orient head towards cursor
        targetRotY = mouseX * 0.35;
        targetRotX = -mouseY * 0.22;

        mascotGroup.rotation.y += (targetRotY - mascotGroup.rotation.y) * 0.08;
        mascotGroup.rotation.x += (targetRotX - mascotGroup.rotation.x) * 0.08;

        // Smooth pupil tracking
        targetPupilX = mouseX * 0.07;
        targetPupilY = mouseY * 0.06;

        leftPupil.position.x += (targetPupilX - leftPupil.position.x) * 0.12;
        leftPupil.position.y += (targetPupilY - leftPupil.position.y) * 0.12;
        rightPupil.position.x += (targetPupilX - rightPupil.position.x) * 0.12;
        rightPupil.position.y += (targetPupilY - rightPupil.position.y) * 0.12;

        // Blinking system
        if (now > nextBlinkTime && !isBlinking) {
          isBlinking = true;
          blinkStartTime = now;
        }

        if (isBlinking) {
          const blinkProgress = (now - blinkStartTime) / 0.18; // 180ms blink
          if (blinkProgress <= 0.5) {
            // Closing
            const rot = -Math.PI * 0.5 + (blinkProgress * 2) * (Math.PI * 0.5);
            leftEyelid.rotation.x = rot;
            rightEyelid.rotation.x = rot;
          } else if (blinkProgress <= 1.0) {
            // Opening
            const rot = -Math.PI * 0.5 + ((1.0 - blinkProgress) * 2) * (Math.PI * 0.5);
            leftEyelid.rotation.x = rot;
            rightEyelid.rotation.x = rot;
          } else {
            isBlinking = false;
            leftEyelid.rotation.x = -Math.PI * 0.5;
            rightEyelid.rotation.x = -Math.PI * 0.5;
            nextBlinkTime = now + 2.5 + Math.random() * 4;
          }
        }

        // Hop animation
        if (isHopping) {
          const hopTime = now - hopStartTime;
          if (hopTime < hopDuration) {
            const p = hopTime / hopDuration;
            // Arc jump
            const jumpY = Math.sin(p * Math.PI) * 0.45;
            mascotGroup.position.y = -0.15 + jumpY;
            // Excited wing flaps
            const flap = Math.sin(p * Math.PI * 6) * 0.35;
            leftWing.rotation.z = 0.22 - flap;
            rightWing.rotation.z = -0.22 + flap;
          } else {
            isHopping = false;
            mascotGroup.position.y = -0.15;
            leftWing.rotation.z = 0.22;
            rightWing.rotation.z = -0.22;
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      bodyGeometry.dispose();
      tummyGeometry.dispose();
      beakGeometry.dispose();
      wingGeometry.dispose();
      footGeometry.dispose();
      bodyMaterial.dispose();
      tummyMaterial.dispose();
      eyeWhiteMaterial.dispose();
      pupilMaterial.dispose();
      shineMaterial.dispose();
      beakMaterial.dispose();
      eyelidMaterial.dispose();
    };
  }, []);

  return (
    <div
      className={`nav-companion-container ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        userSelect: 'none'
      }}
    >
      <button
        type="button"
        onClick={handleMascotClick}
        aria-label={`Interactive 3D mascot companion ${name}. Click to say hello or get an encouraging tip.`}
        title={`Click ${name} for a friendly cheer!`}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          margin: 0,
          cursor: 'pointer',
          outline: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        {/* Three.js canvas mount */}
        <div
          ref={mountRef}
          style={{
            width: '84px',
            height: '64px',
            display: 'block',
            pointerEvents: 'none'
          }}
        />

        {/* Small subtle name tag below or badge */}
        <span
          style={{
            position: 'absolute',
            bottom: '-2px',
            right: '2px',
            fontSize: '0.65rem',
            fontWeight: 700,
            color: 'var(--teal-primary)',
            backgroundColor: 'var(--teal-surface)',
            border: '1px solid var(--teal-border)',
            borderRadius: '4px',
            padding: '1px 4px',
            lineHeight: 1
          }}
        >
          {name}
        </span>
      </button>

      {/* Encouraging Speech Bubble when clicked */}
      {speech && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'absolute',
            top: '70px',
            right: 0,
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            padding: '0.65rem 0.85rem',
            width: '210px',
            fontSize: '0.825rem',
            fontWeight: 600,
            color: 'var(--text-main)',
            lineHeight: 1.4,
            zIndex: 100,
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--teal-primary)', fontWeight: 700 }}>
              {name} says:
            </span>
          </div>
          <div>{speech}</div>
          <button
            onClick={() => setSpeech(null)}
            style={{
              position: 'absolute',
              top: '4px',
              right: '6px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.75rem',
              color: 'var(--text-subtle)',
              cursor: 'pointer'
            }}
            aria-label="Close message"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};
