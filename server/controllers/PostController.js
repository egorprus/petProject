import PostModel from "../models/Post.js";
import jwt from "jsonwebtoken";

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
        status: req.body.status,
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

const getRequesterId = (req) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  if (!token) {
    return null;
  }
  try {
    return jwt.verify(token, process.env.JWT_SECRET)._id;
  } catch (error) {
    return null;
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    const existing = await PostModel.findById(postId);

    if (!existing) {
      return res.status(404).json({
        message: "Статья не найдена",
      });
    }

    if (existing.status && existing.user.toString() !== getRequesterId(req)) {
      return res.status(404).json({
        message: "Статья не найдена",
      });
    }

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      }
    )
      .populate("user")
      .then((doc) => {
        res.json(doc);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          message: "Не удалось вернуть статью",
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const requesterId = getRequesterId(req);
    const filter = requesterId
      ? { $or: [{ status: { $ne: true } }, { status: true, user: requesterId }] }
      : { status: { $ne: true } };

    const posts = await PostModel.find(filter)
      .sort({ createdAt: -1 })
      .populate("user")
      .exec();

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить статьи",
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
      status: req.body.status,
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
