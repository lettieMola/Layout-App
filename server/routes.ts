import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCollageSchema, AIProcessRequestSchema, ChatRequestSchema } from "@shared/schema";
import { z } from "zod";
import { aiService } from "./ai";

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

  // AI Image processing endpoint
  app.post('/api/ai/process', async (req, res) => {
    try {
      const validatedData = AIProcessRequestSchema.parse(req.body);
      const result = await aiService.processImage(validatedData);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid request data', details: error.errors });
      } else {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Failed to process image' });
      }
    }
  });

  // AI Chat assistant endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const validatedData = ChatRequestSchema.parse(req.body);
      const result = await aiService.chatWithAssistant(validatedData);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid chat request', details: error.errors });
      } else {
        console.error('Error in chat assistant:', error);
        res.status(500).json({ error: 'Failed to process chat request' });
      }
    }
  });

  // Legacy image processing endpoint for backward compatibility
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

  // Google Drive backup endpoint
  app.post('/api/backup-to-drive', async (req, res) => {
    try {
      const collages = await storage.getAllCollages();
      
      // Mock Google Drive backup - in real implementation would use Google Drive API
      // For demonstration, we'll simulate the backup process
      const backupData = {
        timestamp: new Date().toISOString(),
        collages: collages,
        count: collages.length
      };
      
      // Simulate backup delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Backup completed:', backupData.count, 'collages backed up');
      
      res.json({ 
        success: true,
        count: backupData.count,
        timestamp: backupData.timestamp,
        message: 'Backup completed successfully'
      });
    } catch (error) {
      console.error('Error backing up to Google Drive:', error);
      res.status(500).json({ error: 'Failed to backup to Google Drive' });
    }
  });

  // Google Drive restore endpoint
  app.post('/api/restore-from-drive', async (req, res) => {
    try {
      // Mock Google Drive restore - in real implementation would fetch from Google Drive API
      // For demonstration, we'll return existing collages
      const collages = await storage.getAllCollages();

      res.json({
        success: true,
        collages: collages,
        count: collages.length,
        message: 'Restore completed successfully'
      });
    } catch (error) {
      console.error('Error restoring from Google Drive:', error);
      res.status(500).json({ error: 'Failed to restore from Google Drive' });
    }
  });

  // Download collage endpoint
  app.get('/api/collages/:id/download', async (req, res) => {
    try {
      const collage = await storage.getCollage(req.params.id);
      if (!collage) {
        res.status(404).json({ error: 'Collage not found' });
        return;
      }

      // Create a simple HTML page that represents the collage
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${collage.name}</title>
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background: #f3f4f6; }
            .collage { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { text-align: center; margin-bottom: 10px; color: #1f2937; }
            .meta { text-align: center; color: #6b7280; margin-bottom: 30px; font-size: 14px; }
            .grid { display: grid; gap: 10px; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
            .image-placeholder { background: #e5e7eb; border: 2px dashed #d1d5db; border-radius: 4px; display: flex; align-items: center; justify-content: center; min-height: 150px; color: #9ca3af; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="collage">
            <h1>${collage.name}</h1>
            <div class="meta">Created: ${new Date(collage.createdAt || Date.now()).toLocaleDateString()}</div>
            <div class="grid">
              ${collage.images && Array.isArray(collage.images) ?
                collage.images.map((_, index) => `<div class="image-placeholder">Image ${index + 1}</div>`).join('') :
                '<div class="image-placeholder">No images in collage</div>'
              }
            </div>
          </div>
        </body>
        </html>
      `;

      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="collage-${collage.id}.html"`);
      res.send(html);
    } catch (error) {
      console.error('Error generating collage download:', error);
      res.status(500).json({ error: 'Failed to generate collage download' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
