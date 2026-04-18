'use client';
import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    const moveCursor = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = mouseX + 'px';
        cursorRef.current.style.top = mouseY + 'px';
      }
    };

    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.08;
      followerY += (mouseY - followerY) * 0.08;
      if (followerRef.current) {
        followerRef.current.style.left = followerX + 'px';
        followerRef.current.style.top = followerY + 'px';
      }
      requestAnimationFrame(animateFollower);
    };

    const addHover = () => followerRef.current?.classList.add('hovering');
    const removeHover = () => followerRef.current?.classList.remove('hovering');

    document.addEventListener('mousemove', moveCursor);
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });

    animateFollower();
    return () => { document.removeEventListener('mousemove', moveCursor); };
  }, []);

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-follower" ref={followerRef} />
    </>
  );
}