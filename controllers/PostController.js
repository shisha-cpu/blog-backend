import PostModel from '../models/post.js';

import CommentModel from '../models/comment.js';
export const test = async(req, res) => {
    try {

        res.json(req.body)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}
export const addCommentToPost = async (req, res) => {
    try {
        const { text } = req.body;
        const { id } = req.params;
        const userId = req.userId;

        // Проверяем существование поста
        const post = await PostModel.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Пост не найден' });
        }

        // Создаем новый комментарий
        const comment = new CommentModel({
            postId: id,
            text,
            user: userId,
        });

        // Сохраняем комментарий
        const savedComment = await comment.save();

        // Добавляем комментарий к списку комментариев поста
        await PostModel.findByIdAndUpdate(id, { $push: { comments: savedComment._id } });

        res.json(savedComment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Не удалось добавить комментарий к посту' });
    }
};

export const getCommentsForPost = async (req, res) => {
    try {
        const { id } = req.params;
        const comments = await CommentModel.find({ postId: id }).populate('user');

        res.json(comments);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to get comments' });
    }
};
export const getLastTags = async (req, res) => {
  
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить тэги',
    });
  }
};

export const getTags = async(req , res ) =>{

}
export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getOne = async (req, res) => {
    try {
      const postId = req.params.id;
  
      const doc = await PostModel.findOneAndUpdate(
        {
          _id: postId,
        },
        {
          $inc: { viewsCount: 1 },
        },
        {
          returnDocument: 'after',
        }
      ).populate('user');
  
      if (!doc) {
        return res.status(404).json({
          message: 'Статья не найдена',
        });
      }
  
      res.json(doc);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить статью',
      });
    }
  };
  

  export const remove = async (req, res) => {
    try {
      const postId = req.params.id;
  
      const doc = await PostModel.findOneAndDelete({ _id: postId });
  
      if (!doc) {
        return res.status(404).json({
          message: 'Статья не найдена',
        });
      }
  
      res.json({
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось удалить статью',
      });
    }
  };
  
export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать статью',
    });
  }
};

export const update = async (req, res) => {
    try {
      const postId = req.params.id;
  
      await PostModel.updateOne(
        {
          _id: postId,
        },
        {
          title: req.body.title,
          text: req.body.text,
          imageUrl: req.body.imageUrl,
          user: req.userId,
          tags: req.body.tags.split(','),
        }
      );
  
      res.json({
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось обновить статью',
      });
    }
  };
  