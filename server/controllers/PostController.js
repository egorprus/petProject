import PostModel from "../models/Post.js";

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Статья не найдена",
      });
    }

    if (post.user.toString() !== req.userId) {
      return res.status(403).json({
        message: "Нет доступа",
      });
    }

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить статью",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Статья не найдена",
      });
    }

    if (post.user.toString() !== req.userId) {
      return res.status(403).json({
        message: "Нет доступа",
      });
    }

    await PostModel.findOneAndDelete({
      _id: postId,
    });

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось удалить статью",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id)
      .populate("user")
      .populate("comments.user");

    if (!post) {
      return res.status(404).json({
        message: "Статья не найдена",
      });
    }

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статью",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate("user")
      .populate("comments.user")
      .exec();

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const text = (req.body.text || "").trim();

    if (!text) {
      return res.status(400).json({
        message: "Комментарий не может быть пустым",
      });
    }

    const post = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $push: { comments: { text, user: req.userId } } },
      { returnDocument: "after" }
    )
      .populate("user")
      .populate("comments.user");

    if (!post) {
      return res.status(404).json({
        message: "Статья не найдена",
      });
    }

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось добавить комментарий",
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { id: postId, commentId } = req.params;
    const text = (req.body.text || "").trim();

    if (!text) {
      return res.status(400).json({
        message: "Комментарий не может быть пустым",
      });
    }

    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Статья не найдена",
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Комментарий не найден",
      });
    }

    if (comment.user.toString() !== req.userId) {
      return res.status(403).json({
        message: "Нет доступа",
      });
    }

    const updated = await PostModel.findOneAndUpdate(
      { _id: postId, "comments._id": commentId },
      { $set: { "comments.$.text": text } },
      { returnDocument: "after" }
    )
      .populate("user")
      .populate("comments.user");

    res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить комментарий",
    });
  }
};

export const removeComment = async (req, res) => {
  try {
    const { id: postId, commentId } = req.params;
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Статья не найдена",
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Комментарий не найден",
      });
    }

    if (comment.user.toString() !== req.userId) {
      return res.status(403).json({
        message: "Нет доступа",
      });
    }

    const updated = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $pull: { comments: { _id: commentId } } },
      { returnDocument: "after" }
    )
      .populate("user")
      .populate("comments.user");

    res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось удалить комментарий",
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
      message: "Не удалось создать статью",
    });
  }
};
