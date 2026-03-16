import "dotenv/config";
import app from "./src/app.js";
import connectToDB from "./src/config/database.js";
import { testAI } from "./src/services/ai.service.js";

testAI()
connectToDB();
app.listen(3000, () => {
  console.log("Server is running on port 3000...");
});
