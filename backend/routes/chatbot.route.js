const express = require("express");
const { chatQuery } = require("../controllers/chatbot.controller");

const router = express.Router();

// Test endpoint
router.get("/test", (req, res) => {
  res.json({ message: "Chatbot route is working!" });
});

// System status endpoint
router.get("/status", async (req, res) => {
  try {
    const status = {
      server: "Online",
      database: "Connected",
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
    res.json({ status, message: "System is running smoothly!" });
  } catch (error) {
    res.status(500).json({ error: "System check failed" });
  }
});

// OpenAI API test endpoint
router.get("/test-openai", async (req, res) => {
  try {
    const { callOpenAI } = require("../controllers/chatbot.controller");
    
    if (!process.env.OPENAI_API_KEY) {
      return res.json({ 
        status: "No API Key", 
        message: "OpenAI API key not configured" 
      });
    }
    
    const testResponse = await callOpenAI("Hello, are you working?");
    
    if (testResponse) {
      res.json({ 
        status: "Success", 
        message: "OpenAI API is working!", 
        response: testResponse 
      });
    } else {
      res.json({ 
        status: "Failed", 
        message: "OpenAI API call failed" 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      status: "Error", 
      message: error.message 
    });
  }
});

router.post("/query", chatQuery);

// Get system insights endpoint
router.get("/insights", async (req, res) => {
  try {
    const { getSystemInsights } = require("../controllers/chatbot.controller");
    const insights = await getSystemInsights();
    
    res.json({ 
      status: "Success", 
      data: insights,
      message: "System insights retrieved successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      status: "Error", 
      message: error.message 
    });
  }
});

// Clear conversation memory endpoint
router.post("/clear-memory", (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (sessionId) {
      res.json({ 
        status: "Success", 
        message: `Memory cleared for session: ${sessionId}` 
      });
    } else {
      res.json({ 
        status: "Success", 
        message: "All conversation memory cleared" 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      status: "Error", 
      message: error.message 
    });
  }
});

module.exports = router;