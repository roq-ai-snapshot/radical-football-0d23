import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createPerformanceEvaluation } from 'apiSdk/performance-evaluations';
import { Error } from 'components/error';
import { performanceEvaluationValidationSchema } from 'validationSchema/performance-evaluations';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { PlayerInterface } from 'interfaces/player';
import { UserInterface } from 'interfaces/user';
import { TrainingSessionInterface } from 'interfaces/training-session';
import { getPlayers } from 'apiSdk/players';
import { getUsers } from 'apiSdk/users';
import { getTrainingSessions } from 'apiSdk/training-sessions';
import { PerformanceEvaluationInterface } from 'interfaces/performance-evaluation';

function PerformanceEvaluationCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PerformanceEvaluationInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPerformanceEvaluation(values);
      resetForm();
      router.push('/performance-evaluations');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PerformanceEvaluationInterface>({
    initialValues: {
      rating: 0,
      comments: '',
      player_id: (router.query.player_id as string) ?? null,
      coach_id: (router.query.coach_id as string) ?? null,
      training_session_id: (router.query.training_session_id as string) ?? null,
    },
    validationSchema: performanceEvaluationValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Performance Evaluation
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="rating" mb="4" isInvalid={!!formik.errors?.rating}>
            <FormLabel>Rating</FormLabel>
            <NumberInput
              name="rating"
              value={formik.values?.rating}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('rating', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.rating && <FormErrorMessage>{formik.errors?.rating}</FormErrorMessage>}
          </FormControl>
          <FormControl id="comments" mb="4" isInvalid={!!formik.errors?.comments}>
            <FormLabel>Comments</FormLabel>
            <Input type="text" name="comments" value={formik.values?.comments} onChange={formik.handleChange} />
            {formik.errors.comments && <FormErrorMessage>{formik.errors?.comments}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<PlayerInterface>
            formik={formik}
            name={'player_id'}
            label={'Select Player'}
            placeholder={'Select Player'}
            fetcher={getPlayers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.position}
              </option>
            )}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'coach_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <AsyncSelect<TrainingSessionInterface>
            formik={formik}
            name={'training_session_id'}
            label={'Select Training Session'}
            placeholder={'Select Training Session'}
            fetcher={getTrainingSessions}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.location}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'performance_evaluation',
  operation: AccessOperationEnum.CREATE,
})(PerformanceEvaluationCreatePage);
