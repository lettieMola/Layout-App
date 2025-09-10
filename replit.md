# Mobile Collage Creator App

## Overview

A mobile-first React web application for creating photo collages with AI-powered tools, filters, and layout options. The app provides an Instagram/Canva-inspired interface for users to upload images, apply various layouts (grid, mirror, heart-shaped), enhance photos with AI capabilities like background removal and face enhancement, and export their creations. Built with modern web technologies including React, TypeScript, Tailwind CSS, and PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Routing**: Wouter for lightweight client-side routing between Home and Editor screens
- **State Management**: Custom React hooks (useCollageStore) with history/undo-redo functionality
- **UI Framework**: Radix UI components with shadcn/ui for accessible, customizable interface components
- **Styling**: Tailwind CSS with custom design system supporting light/dark themes and mobile-first responsive design
- **Build Tool**: Vite for fast development and optimized production builds

### Mobile-First Design
- Touch-optimized interface with 48px minimum touch targets
- Bottom navigation pattern following mobile UI conventions
- Gesture-based canvas interactions for zoom/pan
- Progressive Web App (PWA) capabilities with offline support
- Instagram/Canva-inspired design patterns for familiarity

### Canvas and Image Processing
- HTML Canvas-based collage rendering with html-to-image for export functionality
- Support for multiple layout types: grid layouts, mirror effects, and custom shapes
- Real-time preview system with filter application
- Image manipulation through CSS transforms and filters
- Touch gesture support for mobile canvas interactions

### Component Architecture
- Modular component design with clear separation of concerns
- Reusable UI components (ToolBar, Canvas, ImagePicker, FilterControls, etc.)
- Custom hooks for complex state management and side effects
- TypeScript interfaces for type safety across components

### Backend Architecture
- **Server**: Express.js with TypeScript for API endpoints
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Structure**: RESTful endpoints for collage CRUD operations
- **Session Management**: In-memory storage for development with PostgreSQL schema ready for production
- **Image Processing**: Backend endpoints prepared for AI service integration

### Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless for scalable cloud deployment
- **Schema Design**: Users and collages tables with JSONB fields for flexible metadata storage
- **Image Storage**: Base64 encoding for development with cloud storage preparation
- **State Persistence**: Zustand-like store pattern with history management for undo/redo

### AI Integration Architecture
- Mock AI services with production-ready interface for easy integration
- Supported AI capabilities: background removal, style transfer, face enhancement, object recognition, colorization, and image upscaling
- Extensible AI service layer designed for external API integration
- Progress tracking and user feedback for AI processing operations

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React Router (Wouter), React Query for server state management
- **TypeScript**: Full TypeScript support across client and server
- **Build Tools**: Vite for development and build processes, ESBuild for server bundling

### UI and Design System
- **Radix UI**: Comprehensive accessible component primitives (@radix-ui/react-*)
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide Icons**: Modern icon library for consistent visual elements
- **Class Variance Authority**: Utility for managing component variants
- **shadcn/ui**: Pre-built component library built on Radix UI

### Database and Backend
- **Neon Database**: Serverless PostgreSQL (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe ORM with Zod integration for schema validation
- **Express.js**: Web framework for API endpoints
- **Connect-PG-Simple**: PostgreSQL session store for Express sessions

### Image Processing and Export
- **html-to-image**: Convert DOM elements to images for collage export
- **Canvas API**: Browser-native image manipulation capabilities
- **FileReader API**: Handle image upload and processing

### Development and Quality Tools
- **TypeScript**: Static type checking and enhanced developer experience
- **ESLint/Prettier**: Code formatting and linting (configured in components.json)
- **Replit Integration**: Development environment optimizations for cloud-based coding

### Prepared External Services
- **AI Processing APIs**: Architecture ready for integration with services like:
  - Background removal services (Remove.bg, etc.)
  - Image enhancement APIs
  - Style transfer services
  - Object detection APIs
- **Cloud Storage**: Ready for integration with AWS S3, Cloudinary, or similar for image storage
- **Authentication**: Schema prepared for user authentication systems