import * as yup from 'yup';

export const playerValidationSchema = yup.object().shape({
  position: yup.string().required(),
  skills: yup.string().required(),
  user_id: yup.string().nullable().required(),
  academy_id: yup.string().nullable().required(),
});
