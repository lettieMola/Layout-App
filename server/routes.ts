import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCollageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Collage routes
  app.post('/api/collages', async (req, res) => {
    try {
      const validatedData = insertCollageSchema.parse(req.body);
      const collage = await storage.createCollage(validatedData);
      res.json(collage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid collage data', details: error.errors });
      } else {
        console.error('Error creating collage:', error);
        res.status(500).json({ error: 'Failed to create collage' });
      }
    }
  });

  app.get('/api/collages', async (req, res) => {
    try {
      const collages = await storage.getAllCollages();
      res.json(collages);
    } catch (error) {
      console.error('Error fetching collages:', error);
      res.status(500).json({ error: 'Failed to fetch collages' });
    }
  });

  app.get('/api/collages/:id', async (req, res) => {
    try {
      const collage = await storage.getCollage(req.params.id);
      if (!collage) {
        res.status(404).json({ error: 'Collage not found' });
        return;
      }
      res.json(collage);
    } catch (error) {
      console.error('Error fetching collage:', error);
      res.status(500).json({ error: 'Failed to fetch collage' });
    }
  });

  app.put('/api/collages/:id', async (req, res) => {
    try {
      const validatedData = insertCollageSchema.partial().parse(req.body);
      const collage = await storage.updateCollage(req.params.id, validatedData);
      if (!collage) {
        res.status(404).json({ error: 'Collage not found' });
        return;
      }
      res.json(collage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid collage data', details: error.errors });
      } else {
        console.error('Error updating collage:', error);
        res.status(500).json({ error: 'Failed to update collage' });
      }
    }
  });

  app.delete('/api/collages/:id', async (req, res) => {
    try {
      const deleted = await storage.deleteCollage(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Collage not found' });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting collage:', error);
      res.status(500).json({ error: 'Failed to delete collage' });
    }
  });

  // Image processing endpoint for filters
  app.post('/api/process-image', async (req, res) => {
    try {
      const { imageData, filter, effect } = req.body;
      
      if (!imageData) {
        res.status(400).json({ error: 'Image data is required' });
        return;
      }

      // Mock image processing - in real app would use image processing library
      // For now, just return the original image with a success message
      res.json({ 
        processedImage: imageData,
        filter: filter || 'none',
        effect: effect || 'none',
        success: true
      });
    } catch (error) {
      console.error('Error processing image:', error);
      res.status(500).json({ error: 'Failed to process image' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
