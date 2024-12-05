const express = require("express")
const app = express()

app.get('/', (req, res) => { res.send('Hello World!'); });
app.listen(3000, () => { console.log('Server running on port 3000'); });

/**
 * Making a list of what I'll need.
 * 
 * For Spotify:
 * - profile for continuous authentication
 * - most recentely saved
 * - player control 
 * 
 * For Youtube
 * - just need the search functionality 
 */