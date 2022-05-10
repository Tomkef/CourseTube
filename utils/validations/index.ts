import yup from "utils/validations/yupExtended";

export const loginSchema = yup.object().shape({
  username: yup.string().noSpaces().min(4).max(10),
  password: yup.string().noSpaces().min(5).max(12),
});

export const registerSchema = yup.object().shape({
  username: yup.string().noSpaces().min(4).max(10),
  password: yup.string().noSpaces().min(5).max(12),
  email: yup.string().noSpaces().email().required(),
});
