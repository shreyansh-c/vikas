const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'cssh@12345',
    server: '192.168.60.19', // e.g., localhost
    database: 'Peonbook_demo',
    options: {
    
        trustServerCertificate: true // Change to true for local dev / self-signed certs
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL');
        return pool;
    })
    .catch(err => console.log('Database connection failed: ', err));

module.exports = {
    sql, poolPromise
};
