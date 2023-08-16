const sql = require('mysql')
const config = require('./dbconfig')
const connection = require('./dbconfig');

async function getCatalogById(catalogId) {
    try {
        await connection.connect();

        const query = "SELECT * FROM Catalog WHERE ID = ?";
        const result = await new Promise((resolve) => {
            connection.query(query, [catalogId], (error, result) => {
                resolve(result);
            });
        });

        if (result?.length === 0) {
            throw new Error(`Catalog with id ${catalogId} not found`)
        }

        connection.end();

        return result[0];
    } catch (error) {
        throw error;
    }
}

async function getUserByAddress(address) {
    try {
        await connection.connect();

        const query = "SELECT * FROM [User] WHERE address = @input_parameter";
        const request = new sql.request(connection);
        request.input('input_parameter', sql.VarChar, address);

        const user = await request.query(query, [catalogId]).then(result => {
            connection.close();
            resolve(result.recordset);
        }).catch(error => {
            connection.close();
            console.error(error);
            resolve(null);
        });

        return user.recordset[0];
    } catch (error) {
        console.log(error);
    }
}

async function hasAssetOfTypeAndLevel(address, type, level) {
    try {
        let pool = await sql.connect(config);
        let asset = await pool.request()
            .input('address', sql.VarChar, address)
            .input('type', sql.Int, type)
            .input('level', sql.Int, level)
            .query("SELECT TOP 1 * FROM Asset WHERE user_address = @address AND type = @type AND level <= @level");

        return asset.recordset.length > 0;
    } catch (error) {
        console.log(error);
    }
}

async function deductResourcesAndUpdateUser(address, catalogItem) {
    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('address', sql.VarChar, address)
            .input('cash1', sql.Float, catalogItem.cost1)
            .input('cash2', sql.Float, catalogItem.cost2)
            .input('cash3', sql.Float, catalogItem.cost3)
            .query("UPDATE [User] SET cash1 -= @cash1, cash2 -= @cash2, cash3 -= @cash3 WHERE address = @address");
    } catch (error) {
        console.log(error);
    }
}

async function createProduct(address, id) {
    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.Int, id)
            .input('address', sql.VarChar, address)
            .query("INSERT INTO Product (id, address) VALUES (@id, @address)");
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    getCatalogById: getCatalogById,
    getUserByAddress: getUserByAddress,
    hasAssetOfTypeAndLevel: hasAssetOfTypeAndLevel,
    deductResourcesAndUpdateUser: deductResourcesAndUpdateUser,
    createProduct: createProduct
};
