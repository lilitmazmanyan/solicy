const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);

router.use('/buyProduct', require('./routes/product'));
router.use('/catalog', require('./routes/catalog'));

// router.use((request, response, next) => {
// console.error(err.stack);
// res.json({status: 500}).send('Something went wrong!');
//     response.status(200).send('Hey!');
// });

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
