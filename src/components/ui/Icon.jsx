import React from 'react';
import { Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';

/**
 * Minimalist SVG Utility Icons (Multiplatform: native react-native-svg + web fallback)
 */
export default function Icon({ name, size = 18, color = 'currentColor', className = '', style = {} }) {
  const iconPaths = {
    check: { strokeWidth: 2.2, d: "M5 13l4 4L19 7" },
    x: { strokeWidth: 2.2, d: "M6 18L18 6M6 6l12 12" },
    user: { strokeWidth: 2, d: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" },
    'user-check': { strokeWidth: 2, d: "M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M8.5 11a4 4 0 100-8 4 4 0 000 8zM17 11l2 2 4-4" },
    'user-x': { strokeWidth: 2, d: "M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M8.5 11a4 4 0 100-8 4 4 0 000 8zM18 8l4 4m0-4l-4 4" },
    'alert-triangle': { strokeWidth: 2, d: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01" },
    'alert-circle': { strokeWidth: 2, d: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-14v4m0 4h.01" },
    star: { strokeWidth: 2, d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
    zap: { strokeWidth: 2, d: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" },
    'shield-alert': { strokeWidth: 2, d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zm0-11v2m0 4h.01" },
    'heart-pulse': { strokeWidth: 2, d: "M3 12h3l2-4 4 8 2-4h7M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" },
    clock: { strokeWidth: 2, d: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-14v4l3 3" },
    search: { strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
    sun: { strokeWidth: 2, d: "M12 17a5 5 0 100-10 5 5 0 000 10zm0-15v2m0 16v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0l-1.414-1.414M7.05 7.05L5.636 5.636" },
    moon: { strokeWidth: 2, d: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" },
    'file-text': { strokeWidth: 2, d: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8 13h8m-8 4h6" },
    sparkles: { strokeWidth: 2, d: "M12 3l1.912 5.813a2 2 0 001.272 1.272L21 12l-5.813 1.912a2 2 0 00-1.272 1.272L12 21l-1.912-5.813a2 2 0 00-1.272-1.272L3 12l5.813-1.912a2 2 0 001.272-1.272L12 3z" },
    'book-open': { strokeWidth: 2, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
    planeaciones: { strokeWidth: 2, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
    list: { strokeWidth: 2, d: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" },
    bell: { strokeWidth: 2, d: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9zm-4.27 13a2 2 0 01-3.46 0" },
    refresh: { strokeWidth: 2, d: "M23 4v6h-6M1 20v-6h6m11.95-6.05a9 9 0 00-15.356 3.1M2.05 14.05a9 9 0 0015.356-3.1" },
    calendar: { strokeWidth: 2, d: "M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm-16 6h18M16 2v4M8 2v4" },
    columns: { strokeWidth: 2, d: "M12 3v18M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" },
    grid: { strokeWidth: 2, d: "M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zM3 14h7v7H3v-7z" },
    layout: { strokeWidth: 2, d: "M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-10 16V9M3 9h18" },
    settings: { strokeWidth: 2, d: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" },
    send: { strokeWidth: 2, d: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" },
    'arrow-right': { strokeWidth: 2.5, d: "M14 5l7 7m0 0l-7 7m7-7H3" },
    bot: { strokeWidth: 2, d: "M12 2a2 2 0 012 2v2h4a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h4V4a2 2 0 012-2zm0 8a2 2 0 100 4 2 2 0 000-4zM8 12h.01M16 12h.01M2 13h2M20 13h2" },
    'graduation-cap': { strokeWidth: 2, d: "M4 11.25V17a3 3 0 003 3h10a3 3 0 003-3v-5.75m-11-4L12 3l9 4-9 4-9-4zm-1 6.5V17a2 2 0 002 2h10a2 2 0 002-2v-3" },
    target: { strokeWidth: 2, d: "M12 22a10 10 0 110-20 10 10 0 010 20zM12 16a4 4 0 110-8 4 4 0 010 8zm0-2a2 2 0 110-4 2 2 0 010 4z" },
    folder: { strokeWidth: 2, d: "M4 5a2 2 0 012-2h4.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H20a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" },
    'folder-open': { strokeWidth: 2, d: "M5 19h14a2 2 0 001.96-1.6l1-5A2 2 0 0020 10H6a2 2 0 00-1.96 1.6L3 17a2 2 0 001.96 2.4zm15-9V7a2 2 0 00-2-2H9.414a1 1 0 01-.707-.293L6.293 2.293A1 1 0 005.586 2H4a2 2 0 00-2 2v13" },
    puzzle: { strokeWidth: 2, d: "M12 2C9.243 2 7 4.243 7 7v1a2 2 0 01-2 2H4a2 2 0 100 4h1a2 2 0 012 2v1c0 2.757 2.243 5 5 5h1a2 2 0 100-4h-1a2 2 0 01-2-2v-1c0-1.105-.895-2-2-2H7v-1c0-1.657 1.343-3 3-3h1a2 2 0 000-4h-1a2 2 0 01-2-2zM22 12c0-2.757-2.243-5-5-5h-1a2 2 0 110-4h1a2 2 0 002 2v1c1.105 0 2 .895 2 2h1c1.657 0 3 1.343 3 3v1a2 2 0 11-4 0v-1a2 2 0 00-2-2h-1c0-1.105-.895-2-2-2z" },
    pin: { strokeWidth: 2, d: "M16 11V5.5a3.5 3.5 0 00-7 0V11M5 11h14v2H5zM12 13v9" },
    'map-pin': { strokeWidth: 2, d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 13a3 3 0 100-6 3 3 0 000 6z" },
    book: { strokeWidth: 2, d: "M4 19.5A2.5 2.5 0 016.5 17H20V4H6.5A2.5 2.5 0 004 6.5v13zM4 19.5v-13A2.5 2.5 0 016.5 4" },
    'message-square': { strokeWidth: 2, d: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" },
    'check-circle': { strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    coffee: { strokeWidth: 2, d: "M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z M6 1v3M10 1v3M14 1v3" },
    rocket: { strokeWidth: 2, d: "M13.5 6.5l4 4m-4-4l-4 4m4-4a5.657 5.657 0 014 4c0 4.243-7 7-7 7s-2.757-7 7-7a5.657 5.657 0 01-4-4zM2 22l3-3m-3 3h3v-3M2 22l4-4" }
  };

  const target = iconPaths[name] || iconPaths.check;

  if (Platform.OS === 'web') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        className={`icon-utility ${className}`}
        style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={target.strokeWidth} d={target.d} />
      </svg>
    );
  }

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      style={style}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={target.strokeWidth}
        d={target.d}
        stroke={color}
      />
    </Svg>
  );
}
