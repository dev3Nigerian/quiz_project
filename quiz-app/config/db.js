const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Use DB_PATH from .env, otherwise create/use quiz_app.db in the project folder.
const dbPath = process.env.DB_PATH || './quiz_app.db';
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Failed to open database:', err.message);
        process.exit(1);
    }
    console.log('Connected to SQLite database:', dbPath);
});

// Wait up to 5 seconds if SQLite is temporarily busy.
db.configure('busyTimeout', 5000);

function query(sql, params = []) {
    const normalizedSql = sql.trim().toUpperCase();
    const isReadQuery = normalizedSql.startsWith('SELECT');

    return new Promise((resolve, reject) => {
        // SELECT -> return rows
        if (isReadQuery) {
            db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows || []);
                }
            });
            return;
        }

        // INSERT/UPDATE/DELETE -> return metadata
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
    });
}

function getConnection() {
    // Provide a MySQL-like transaction API used in some controllers.
    return Promise.resolve({
        query,
        beginTransaction: () => query('BEGIN TRANSACTION'),
        commit: () => query('COMMIT'),
        rollback: () => query('ROLLBACK'),
        release: () => Promise.resolve()
    });
}

async function initializeSchema() {
    // Load and run the full schema file.
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    await new Promise((resolve, reject) => {
        db.exec(schemaSql, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

module.exports = {
    db,
    query,
    getConnection,
    initializeSchema
};
