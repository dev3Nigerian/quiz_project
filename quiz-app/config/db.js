const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = process.env.DB_PATH || './quiz_app.db';
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Failed to open database:', err.message);
        process.exit(1);
    }
    console.log('Connected to SQLite database:', dbPath);
});

db.configure('busyTimeout', 5000);

function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
            db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows || []);
                }
            });
        } else {
            db.run(sql, params, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        insertId: this.lastID,
                        affectedRows: this.changes
                    });
                }
            });
        }
    });
}

function getConnection() {
    return Promise.resolve({
        query,
        beginTransaction: () => query('BEGIN TRANSACTION'),
        commit: () => query('COMMIT'),
        rollback: () => query('ROLLBACK'),
        release: () => Promise.resolve()
    });
}

async function initializeSchema() {
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const statements = schemaSql.split(';').filter((stmt) => stmt.trim());

    for (const statement of statements) {
        await query(statement);
    }
}

module.exports = {
    db,
    query,
    getConnection,
    initializeSchema
};
