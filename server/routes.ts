import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameProgressSchema, insertGameResultSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get game progress for a user
  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await storage.getGameProgress(userId);
      
      if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }
      
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to get progress" });
    }
  });

  // Update game progress
  app.put("/api/progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const validatedData = insertGameProgressSchema.parse(req.body);
      
      const progress = await storage.updateGameProgress(userId, validatedData);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: "Invalid progress data" });
    }
  });

  // Save game result
  app.post("/api/results", async (req, res) => {
    try {
      const validatedData = insertGameResultSchema.parse(req.body);
      const result = await storage.saveGameResult(validatedData);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid result data" });
    }
  });

  // Get game results for a user
  app.get("/api/results/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const results = await storage.getGameResults(userId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to get results" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
