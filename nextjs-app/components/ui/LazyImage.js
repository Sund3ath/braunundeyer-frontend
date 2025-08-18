'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

/**
 * LazyImage component with progressive loading and blur placeholder
 * Optimizes image loading performance
 */
export default function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  fill = false,
  sizes,
  style,
  onLoad,
  objectFit = 'cover'
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // Skip lazy loading for priority images
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0,
        rootMargin: '50px' // Start loading 50px before entering viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  // Generate a simple blur placeholder if not provided
  const defaultBlurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=';

  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  if (!isInView && !priority) {
    return (
      <div 
        ref={imgRef}
        className={className}
        style={{
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
          backgroundColor: '#f3f4f6',
          ...style
        }}
      />
    );
  }

  if (fill) {
    return (
      <div className={`relative ${className}`} style={style}>
        <Image
          src={src}
          alt={alt}
          fill
          quality={quality}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL || defaultBlurDataURL}
          sizes={sizes || '100vw'}
          className={`transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ objectFit }}
          onLoad={handleImageLoad}
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      quality={quality}
      priority={priority}
      placeholder={placeholder}
      blurDataURL={blurDataURL || defaultBlurDataURL}
      sizes={sizes}
      className={`${className} transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      style={style}
      onLoad={handleImageLoad}
    />
  );
}