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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getPerformanceEvaluationById, updatePerformanceEvaluationById } from 'apiSdk/performance-evaluations';
import { Error } from 'components/error';
import { performanceEvaluationValidationSchema } from 'validationSchema/performance-evaluations';
import { PerformanceEvaluationInterface } from 'interfaces/performance-evaluation';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { PlayerInterface } from 'interfaces/player';
import { UserInterface } from 'interfaces/user';
import { TrainingSessionInterface } from 'interfaces/training-session';
import { getPlayers } from 'apiSdk/players';
import { getUsers } from 'apiSdk/users';
import { getTrainingSessions } from 'apiSdk/training-sessions';

function PerformanceEvaluationEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PerformanceEvaluationInterface>(
    () => (id ? `/performance-evaluations/${id}` : null),
    () => getPerformanceEvaluationById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PerformanceEvaluationInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePerformanceEvaluationById(id, values);
      mutate(updated);
      resetForm();
      router.push('/performance-evaluations');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<PerformanceEvaluationInterface>({
    initialValues: data,
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
            Edit Performance Evaluation
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'performance_evaluation',
  operation: AccessOperationEnum.UPDATE,
})(PerformanceEvaluationEditPage);
