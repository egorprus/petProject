import { body } from "express-validator";

export const registerValidation = [
  body("login", "Неверный формат почты").isString(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
  body("fullName", "Имя должно быть минимум 3 символа").isLength({ min: 3 }),
  body("avatar", "Неверная ссылка на картинку").optional().isURL(),
];
export const loginValidation = [
  body("login", "Неверный формат почты").isString(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
];

export const postCreateValidation = [
  body("title", "Введите заголовок статьи").isLength({ min: 3 }).isString(),
  body("text", "Введите текст статьи").isLength({ min: 10 }).isString(),
  body("tags", "Неверный формат тегов").optional().isString(),
  body("imageUrl", "Неверная ссылкан на изображение").optional().isString(),
  body("status", "Введите статус").optional().isString(),
];
