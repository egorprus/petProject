import { body } from "express-validator";
import { PAGE_KEYS } from "../constants/pages.js";

export const registerValidation = [
  body("login", "Неверный формат почты").isString(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
  body("fullName", "Имя должно быть минимум 3 символа").isLength({ min: 3 }),
  body("avatar", "Неверная ссылка на картинку").optional().isURL(),
];
export const updateMeValidation = [
  body("fullName", "Имя должно быть минимум 3 символа").optional().isLength({ min: 3 }),
  body("email", "Неверный формат почты").optional({ values: "falsy" }).isEmail(),
  body("hiddenPage", "Неверный список скрытых страниц").optional().isArray(),
  body("hiddenPage.*", "Неизвестная страница").isIn(PAGE_KEYS),
];
export const changePasswordValidation = [
  body("currentPassword", "Введите текущий пароль").isString().notEmpty(),
  body("newPassword", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
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
  body("status", "Введите статус").optional().isBoolean(),
];
