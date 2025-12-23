import { useEffect, useRef, useMemo } from 'react';
import { createElement } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom',
  as: Tag = 'h2'
}) => {
  const containerRef = useRef(null);
  const triggersRef = useRef([]);
  const isInitializedRef = useRef(false);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    // Extract all gradient-related classes from textClassName to apply to individual words
    // This ensures gradient colors are visible on each word span
    const gradientClasses = textClassName ? textClassName.split(' ').filter(cls => 
      cls.includes('bg-gradient') || 
      cls.includes('bg-clip-text') || 
      cls.includes('text-transparent') ||
      cls.includes('from-') ||
      cls.includes('to-') ||
      cls.includes('via-') ||
      cls.includes('bg-clip')
    ).join(' ') : '';
    
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span 
          className={`word ${gradientClasses}`} 
          key={index}
          style={gradientClasses ? { 
            display: 'inline-block',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text'
          } : {}}
        >
          {word}
        </span>
      );
    });
  }, [children, textClassName]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || isInitializedRef.current) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;
    const triggers = [];

    // Set initial state immediately to prevent flicker
    gsap.set(el, { transformOrigin: '0% 50%', rotate: baseRotation });
    
    const wordElements = el.querySelectorAll('.word');
    
    // Use double requestAnimationFrame to ensure DOM is fully ready
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Check if element is already in viewport
        const rect = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const isInViewport = rect.top < viewportHeight && rect.bottom > 0;
        
        // If already in viewport OR if baseOpacity is 0 (to prevent invisible text), make it visible
        if (isInViewport || baseOpacity === 0) {
          // Set to visible state immediately to prevent invisible text
          gsap.set(el, { rotate: 0 });
          if (enableBlur) {
            gsap.set(wordElements, { 
              opacity: 1, 
              filter: 'blur(0px)',
              willChange: 'opacity, filter'
            });
          } else {
            gsap.set(wordElements, { 
              opacity: 1,
              willChange: 'opacity'
            });
          }
          
          // If in viewport, animate from initial state for effect
          if (isInViewport) {
            gsap.fromTo(el, 
              { rotate: baseRotation },
              {
                ease: 'power2.out',
                rotate: 0,
                duration: 0.8
              }
            );
            
            gsap.fromTo(wordElements,
              { 
                opacity: baseOpacity, 
                filter: enableBlur ? `blur(${blurStrength}px)` : undefined 
              },
              {
                ease: 'power2.out',
                opacity: 1,
                filter: enableBlur ? 'blur(0px)' : undefined,
                stagger: 0.05,
                duration: 0.8
              }
            );
          }
        } else {
          // Set initial hidden state
          if (enableBlur) {
            gsap.set(wordElements, { 
              opacity: baseOpacity, 
              filter: `blur(${blurStrength}px)`,
              willChange: 'opacity, filter'
            });
          } else {
            gsap.set(wordElements, { 
              opacity: baseOpacity,
              willChange: 'opacity'
            });
          }

          // Rotation animation
          const rotationTween = gsap.to(
            el,
            {
              ease: 'none',
              rotate: 0,
              scrollTrigger: {
                trigger: el,
                scroller,
                start: 'top bottom',
                end: rotationEnd,
                scrub: true
              }
            }
          );
          triggers.push(rotationTween.scrollTrigger);

          // Opacity and blur animation
          const wordTween = gsap.to(
            wordElements,
            {
              ease: 'none',
              opacity: 1,
              filter: enableBlur ? 'blur(0px)' : undefined,
              stagger: 0.05,
              scrollTrigger: {
                trigger: el,
                scroller,
                start: 'top bottom-=20%',
                end: wordAnimationEnd,
                scrub: true
              }
            }
          );
          triggers.push(wordTween.scrollTrigger);
        }

        triggersRef.current = triggers;
        isInitializedRef.current = true;
      });
    });

    // Safety fallback: ensure text is visible after 1 second
    const fallbackTimeout = setTimeout(() => {
      const wordElements = el.querySelectorAll('.word');
      if (wordElements.length > 0) {
        const firstWord = wordElements[0];
        const computedStyle = window.getComputedStyle(firstWord);
        if (parseFloat(computedStyle.opacity) === 0) {
          // Text is still invisible, force it visible
          gsap.set(wordElements, { opacity: 1, filter: 'blur(0px)' });
          gsap.set(el, { rotate: 0 });
        }
      }
    }, 1000);

    return () => {
      clearTimeout(fallbackTimeout);
      triggersRef.current.forEach(trigger => {
        if (trigger) trigger.kill();
      });
      triggersRef.current = [];
      isInitializedRef.current = false;
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  return createElement(
    Tag,
    {
      ref: containerRef,
      className: `scroll-reveal ${containerClassName}`
    },
    <p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p>
  );
};

export default ScrollReveal;

