1. add vercel.json to root :
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node",
      "config": { "includeFiles": ["dist/**"] }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}

2. Add these two lines before routes
app.set('views', __dirname + '/views');

// if using a static folder(assets) :
app.use(express.static(__dirname + '/assets')); //vercel

3. // Export server.js for Vercel Deployment
module.exports = app;