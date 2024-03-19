
require('dotenv').config()
import server from "./models/server";


const PORT = 3000; 
server.start(PORT);