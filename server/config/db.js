import mysql from "mysql";

const connectdb = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "crud"
});

connectdb.connect((error) => {
    if (error) {
        console.log("Failed to connect with database");
    } else {
        console.log("Successfully, database connected");
    }
});

export default connectdb;
