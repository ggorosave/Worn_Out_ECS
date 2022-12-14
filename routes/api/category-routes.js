const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// retrieves all categories and includes products
router.get('/', async (req, res) => {0
  try {

    // findAll retieves all data
    const categoryData = await Category.findAll({
      include: [{model: Product}]
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// retrieves data for a specific catagory when given an id
router.get('/:id', async (req, res) => {
  
  try {

    // findByPk looks for the primary key (i.e. id)
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{model: Product}]
    })

    // if id doesn't exist, the user is sent a 404 error and a message
    if (!categoryData) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// creates a new category
router.post('/', async (req, res) => {
  try {

    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// updates the name of an existing category when given an id
router.put('/:id', async (req, res) => {
 
  try {
    const categoryData = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    })

    // if id doesn't exist, the user is sent a 404 error and a message
    if (!categoryData[0]) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// deletes a specific category when given an id
router.delete('/:id', async (req, res) => {
  
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id
      }
    })

    // if id doesn't exist, the user is sent a 404 error and a message
    if (!categoryData) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
