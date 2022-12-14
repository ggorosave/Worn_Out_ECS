const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// retrieves all product data and includes category and tags
router.get('/', async (req, res) => {
  
  try {
    const productData =  await Product.findAll({
      include: [
        {model: Category}, 
        {model: Tag, through: ProductTag, attributes: {
        exclude: ['id', 'product_tag']
      }}],
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// retrieves data for a specific product and includes category and tags
router.get('/:id', async(req, res) => {
  
  try {
    const productData = await Product.findByPk(req.params.id, {include: [
      {model: Category}, 
      {model: Tag, through: ProductTag, attributes: {
      exclude: ['id', 'product_tag']
    }}],})

    // user sent 404 error and message if id doesn't exist
    if (!productData) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }

    res.status(200).json(productData);
  } catch(err) {
    res.status(500).json(err);
  }
});

// creates new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */

  Product.create(req.body)
    .then((product) => {
      // checks for tag ids in the body
      if (req.body.tagIds.length) {

        // creates an array of objects with the product id and tag id
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });

        // uses array to create new rows of data in the ProductTag table
        return ProductTag.bulkCreate(productTagIdArr);
      }

      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// updates product data
router.put('/:id', (req, res) => {
  
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {

      // finds all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {

      // gets list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);

      // creates filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });

      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // runs both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// delete one product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!productData) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }

    res.status(200).json(productData);
  } catch(err) {
    res.status(500).json(err);
  }
});

module.exports = router;
