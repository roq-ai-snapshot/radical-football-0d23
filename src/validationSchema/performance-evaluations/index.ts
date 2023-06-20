import * as yup from 'yup';

export const performanceEvaluationValidationSchema = yup.object().shape({
  rating: yup.number().integer().required(),
  comments: yup.string(),
  player_id: yup.string().nullable().required(),
  coach_id: yup.string().nullable().required(),
  training_session_id: yup.string().nullable().required(),
});
