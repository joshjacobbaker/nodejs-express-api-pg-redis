const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const redis = require("../redis");

router.get("/", async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to add a new user
router.post("/", async (req, res) => {
    try {
        const { name, email } = req.body;
        console.log("Creating user...");
        const user = await User.create({ name, email });
         // Store in Redis for faster retrieval
         console.log(`user:${user.id} in redis`)
         await redis.setex(`user:${user.id}`, 3600, JSON.stringify(user), (err) => {
            if (err) {
                console.error('Error setting value in Redis:', err);
            } else {
                console.log('Successfully set value in Redis for user:', user.id);
            }
        });        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint to get all Redis cached data
router.get("/cache", async (req, res) => {
    try {
        // Fetch all keys stored in Redis
        const keys = await redis.keys("user:*"); // Fetch keys that start with "user:"

        if (keys.length === 0) {
            return res.status(404).json({ message: "No data in cache" });
        }

        // Fetch all the data for these keys
        const userCacheData = await Promise.all(
            keys.map(async (key) => {
                const data = await redis.get(key); // Fetch data from Redis
                return JSON.parse(data); // Parse the cached JSON data
            })
        );

        res.json(userCacheData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/test", async (req, res) => {
    try {
    // Storing data in Redis cache
    redis.set('user:10000', JSON.stringify({ name: 'John Doe 10000', email: 'john10000@example.com' }));

    // Retrieving data from Redis cache
    redis.get('user:10000').then((data) => {
        console.log('Cached User:', JSON.parse(data));
        res.json(JSON.parse(data));
    });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch user by ID with caching
router.get("/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        // Check if user data is in Redis
        const cachedUser = await redis.get(`user:${userId}`);
        if (cachedUser) {
            console.log("🟢 Cache hit!");
            return res.json(JSON.parse(cachedUser)); // Return cached data
        }

        console.log("🔴 Cache miss. Fetching from DB...");
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Store user data in Redis for 60 seconds
        await redis.setex(`user:${userId}`, 3600, JSON.stringify(user));

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;
