const pool = require("./db");

const query1 = `
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(30) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(100) UNIQUE,
  is_member BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`
const query2 = `CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`


async function createDataBase(){
    const client = await pool.connect()
    try{
       await client.query("BEGIN");
       await client.query(query1);
       await client.query(query2);
       await client.query("COMMIT");
      console.log("Tables created successfully")
    }catch(err){
        console.error(err)
        await client.query("ROLLBACK")

    }finally{
        client.release()
    }

}

createDataBase()