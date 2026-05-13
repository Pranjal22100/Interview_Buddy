require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

const PORT = process.env.PORT || 3000

connectToDB()


const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

server.setTimeout(600000); // 10 minutes timeout