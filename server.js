const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML files from views directory
app.use(express.static(path.join(__dirname, 'views')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/wonders', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'wonders.html'));
});

app.get('/gallery', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'gallery.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

// API route for contact form submission
app.post('/contact', express.urlencoded({ extended: true }), (req, res) => {
    const { name, email, subject, message } = req.body;
    
    // In a real application, you would save this to a database
    console.log('Contact form submission:', { name, email, subject, message });
    
    // Simulate processing time
    setTimeout(() => {
        res.json({ 
            success: true, 
            message: 'Thank you for your message! We will get back to you soon.' 
        });
    }, 1000);
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🌍 Earth's Marvels server running on http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
});