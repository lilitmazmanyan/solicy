const express = require('express');
const router = express.Router();
const dbOperations = require('../dboperations'); // Update the path as needed

router.get('/:id', async (req, res) => {
    const catalogId = req.params.id;

    try {
        const catalogItem = await dbOperations.getCatalogById(catalogId);

        if (!catalogItem) {
            res.status(404).json({error: 'Catalog item not found'});
            return;
        }

        const groupedPrice = {
            cost1: catalogItem.cost1, cost2: catalogItem.cost2, cost3: catalogItem.cost3
        };

        const groupedReq = {
            req1: catalogItem.req1, req2: catalogItem.req2, req3: catalogItem.req3
        };

        const response = {
            id: catalogItem.id,
            name: catalogItem.name,
            description: catalogItem.description,
            imageUrl: catalogItem.imageUrl,
            price: groupedPrice,
            req: groupedReq
        };

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(404).json({error: 'Internal server error'});
    }
});

module.exports = router;
