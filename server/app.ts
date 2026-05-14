import express from "express";

const app = express();
const port = 5000;

app.get("/", (req, res) => {
  res.send("🦉 Server fucking system successfully. 200 OK bro.");
});

app.listen(port, () => {
  console.log(`
      █████╗ ██╗  ██╗ █████╗ ███████╗██╗  ██╗                  
     ██╔══██╗██║ ██╔╝██╔══██╗██╔════╝██║  ██║
     ███████║█████╔╝ ███████║███████╗███████║
     ██╔══██║██╔═██╗ ██╔══██║╚════██║██╔══██║
     ██║  ██║██║  ██╗██║  ██║███████║██║  ██║    
     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝     
  🔥 Server 🏃  at http://localhost:${port}
  👀 Please do logs in even small fn to trace bugs, and make sure remove logs in prooduction..
  🥛 Powered by Chai & late-night coding
  `);
});