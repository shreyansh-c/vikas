const express = require('express');
const bodyParser = require('body-parser');
const { sql, poolPromise } = require('./db');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// API Routes
app.get('/api/colleges', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM College');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/api/colleges', async (req, res) => {
    const { CollegeID, CollegeName, Status, CenterID } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('CollegeID', sql.Int, CollegeID)
            .input('CollegeName', sql.NVarChar(150), CollegeName)
            .input('Status', sql.NVarChar(10), Status)
            .input('CenterID', sql.NVarChar(50), CenterID)
            .query('INSERT INTO College (CollegeID, CollegeName, Status, CenterID) VALUES (@CollegeID, @CollegeName, @Status, @CenterID)');
        res.status(201).send('College created');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.put('/api/colleges/:id', async (req, res) => {
    const { id } = req.params;
    const { CollegeName, Status, CenterID } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('CollegeID', sql.Int, id)
            .input('CollegeName', sql.NVarChar(150), CollegeName)
            .input('Status', sql.NVarChar(10), Status)
            .input('CenterID', sql.NVarChar(50), CenterID)
            .query('UPDATE College SET CollegeName = @CollegeName, Status = @Status, CenterID = @CenterID WHERE CollegeID = @CollegeID');
        res.send('College updated');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.patch('/api/colleges/:id', async (req, res) => {
    const { id } = req.params;
    const { CollegeName, Status, CenterID } = req.body;
    try {
        const pool = await poolPromise;
        const query = 'UPDATE College SET ' + 
            (CollegeName ? 'CollegeName = @CollegeName, ' : '') +
            (Status ? 'Status = @Status, ' : '') +
            (CenterID ? 'CenterID = @CenterID ' : '') +
            'WHERE CollegeID = @CollegeID';
        
        const request = pool.request().input('CollegeID', sql.Int, id);
        if (CollegeName) request.input('CollegeName', sql.NVarChar(150), CollegeName);
        if (Status) request.input('Status', sql.NVarChar(10), Status);
        if (CenterID) request.input('CenterID', sql.NVarChar(50), CenterID);
        
        await request.query(query);
        res.send('College partially updated');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.delete('/api/colleges/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('CollegeID', sql.Int, id)
            .query('DELETE FROM College WHERE CollegeID = @CollegeID');
        res.send('College deleted');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
