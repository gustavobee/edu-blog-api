const { Op } = require('sequelize');
const Post = require('../models/post');

module.exports = {
  
  async create(req, res) {
    try {
      const postData = req.body;
      const newPost = await Post.create(postData);

      return res.status(201).json(newPost);

    } catch (error) {
      console.error("Error during creation: ", error);
      return res.status(500).json({ error: 'Failed to create post' });
    }
  },

  async read(req, res) {
    try {
      const token = req.headers['access_token'];
      let queryOptions = {};

      if (!token || token !== 'simulated_token') {
        queryOptions = {
          where: { status: 'publicado' }
        };
      }

      const posts = await Post.findAll(queryOptions);
      return res.status(200).json(posts);

    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar postagens' });
    }
  },

  async readById(req, res) {
    try {
        const { id } = req.params;
        const token = req.headers['access_token'];
        
        let queryOptions = {
            where: { id: id }
        };

        if (!token || token !== 'simulated_token') {
            queryOptions.where.status = 'publicado';
        }

        const post = await Post.findOne(queryOptions);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        return res.status(200).json(post);
    } catch (error) {
        console.error("Error during reading: ", error);
        return res.status(500).json({ error: 'Failed to read the post' });
    }
  },

  async update(req, res) {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const post = await Post.findByPk(id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        await post.update(updatedData);

        return res.status(200).json(post);
    } catch (error) {
        console.log("Error during updating: ", error);
        return res.status(500).json({ error: 'Failed to update the post' });
    }
  },

  async delete(req, res) {
    try{
        const { id } = req.params;
        const post = await Post.findByPk(id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        await post.destroy();

        return res.status(200).json( { message: 'Post successfully deleted' } );
    } catch (error) {
        console.log("Error during deleting: ", error);
        return res.status(500).json({ error: 'Failed to delete the post' });
    }
  },

  async search(req, res) {
    try {
        const { term } = req.query;
        const token = req.headers['access_token'];

        if (!term) {
            return res.status(400).json({ error: 'Provide a valid search term' });
        }

        const searchCondition = {
            [Op.or]: [
                { title: { [Op.iLike]: `%${term}%` } },
                { content: { [Op.iLike]: `%${term}%` } },
                { description: { [Op.iLike]: `%${term}%` } }
            ]
        };

        let whereClause = searchCondition;

        if (!token || token !== 'simulated_token') {
            whereClause = {
                [Op.and]: [
                    searchCondition,
                    { status: 'publicado' }
                ]
            };
        }

        const posts = await Post.findAll({
            where: whereClause
        });

        return res.status(200).json(posts);
    } catch (error) {
        console.log("Error during searching: ", error);
        return res.status(500).json({ error: 'Failed to search the post' });
    }
  }
};