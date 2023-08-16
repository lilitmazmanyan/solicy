const express = require('express');
const router = express.Router();
const dbOperations = require('../dboperations');

router.post('/buyProduct', async (req, res) => {
    const {id, address} = req.body;

    try {
        const user = await dbOperations.getUserByAddress(address);
        if (!user) {
            res.status(404).json({error: 'User not found'});
            return;
        }

        const catalogItem = await dbOperations.getCatalogById(id);
        if (!catalogItem) {
            res.status(404).json({error: 'Catalog item not found'});
            return;
        }

        if (user.cash1 < catalogItem.cost1 || user.cash2 < catalogItem.cost2 || user.cash3 < catalogItem.cost3) {
            res.status(400).json({success: false, error: {errorMessage: 'Insufficient funds'}});
            return;
        }

        if ((catalogItem.req1 !== null && !await dbOperations.hasAssetOfTypeAndLevel(address, 1, catalogItem.req1))
            || (catalogItem.req2 !== null && !await dbOperations.hasAssetOfTypeAndLevel(address, 2, catalogItem.req2))
            || (catalogItem.req3 !== null && !await dbOperations.hasAssetOfTypeAndLevel(address, 3, catalogItem.req3))) {
            res.status(400).json({success: false, error: {errorMessage: 'Requirements not met'}});
            return;
        }

        await dbOperations.deductResourcesAndUpdateUser(address, catalogItem);
        await dbOperations.createProduct(address, id);

        const updatedUser = await dbOperations.getUserByAddress(address);
        const successResponse = {
            success: true, data: {
                resources: {
                    cash1: updatedUser.cash1, cash2: updatedUser.cash2, cash3: updatedUser.cash3
                }
            }
        };

        res.json(successResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }
});

module.exports = router;
