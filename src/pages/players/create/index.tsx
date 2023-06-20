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
import { createPlayer } from 'apiSdk/players';
import { Error } from 'components/error';
import { playerValidationSchema } from 'validationSchema/players';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { AcademyInterface } from 'interfaces/academy';
import { getUsers } from 'apiSdk/users';
import { getAcademies } from 'apiSdk/academies';
import { PlayerInterface } from 'interfaces/player';

function PlayerCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PlayerInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPlayer(values);
      resetForm();
      router.push('/players');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PlayerInterface>({
    initialValues: {
      position: '',
      skills: '',
      user_id: (router.query.user_id as string) ?? null,
      academy_id: (router.query.academy_id as string) ?? null,
    },
    validationSchema: playerValidationSchema,
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
            Create Player
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="position" mb="4" isInvalid={!!formik.errors?.position}>
            <FormLabel>Position</FormLabel>
            <Input type="text" name="position" value={formik.values?.position} onChange={formik.handleChange} />
            {formik.errors.position && <FormErrorMessage>{formik.errors?.position}</FormErrorMessage>}
          </FormControl>
          <FormControl id="skills" mb="4" isInvalid={!!formik.errors?.skills}>
            <FormLabel>Skills</FormLabel>
            <Input type="text" name="skills" value={formik.values?.skills} onChange={formik.handleChange} />
            {formik.errors.skills && <FormErrorMessage>{formik.errors?.skills}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <AsyncSelect<AcademyInterface>
            formik={formik}
            name={'academy_id'}
            label={'Select Academy'}
            placeholder={'Select Academy'}
            fetcher={getAcademies}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
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
  entity: 'player',
  operation: AccessOperationEnum.CREATE,
})(PlayerCreatePage);
