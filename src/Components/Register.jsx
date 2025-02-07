import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  Grid,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import RemoteServices from '../Remoteservies/remoteservices';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone_number: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Replace with your actual registration API call
      const response = await RemoteServices.Registration(formData);
     

      if (response.ok) {
        toast({
          title: 'Registration Successful',
          description: 'Please login with your credentials',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/login');
      } else {
        const error = await response.json();
        toast({
          title: 'Registration Failed',
          description: error.message || 'Please try again',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred during registration',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-br, teal.50, blue.50)"
      px={4}
      py={8}
    >
      {/*
        Width Adjustments: 
        - base: '90%' on extra-small devices
        - sm and above: '80%' of container width
      */}
      <Box
        w={{ base: '90%', sm: '80%' }}
        bg="white"
        p={{ base: 8, md: 10 }}
        borderRadius="2xl"
        boxShadow="xl"
      >
        <VStack spacing={8} align="stretch">
          <Heading
            as="h1"
            fontSize={{ base: '2xl', md: '3xl' }}
            textAlign="center"
            fontFamily="Poppins, sans-serif"
            color="gray.800"
          >
            Create Account
          </Heading>

          <form onSubmit={handleRegister}>
            <VStack spacing={5}>
              {/* 2×2 Grid for 4 of the fields */}
              <Grid
                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                gap={5}
                w="full"
              >
                {/* Full Name */}
                <FormControl id="name" isRequired>
                  <FormLabel fontWeight="medium" color="gray.700">
                    Full Name
                  </FormLabel>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    focusBorderColor="teal.400"
                    borderRadius="md"
                  />
                </FormControl>

                {/* Email */}
                <FormControl id="email" isRequired>
                  <FormLabel fontWeight="medium" color="gray.700">
                    Email Address
                  </FormLabel>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    focusBorderColor="teal.400"
                    borderRadius="md"
                  />
                </FormControl>

                {/* Phone Number */}
                <FormControl id="phone_number" isRequired>
                  <FormLabel fontWeight="medium" color="gray.700">
                    Phone Number
                  </FormLabel>
                  <Input
                    type="tel"
                    value={formData.phone_number}
                    onChange={handleChange}
                    focusBorderColor="teal.400"
                    borderRadius="md"
                  />
                </FormControl>

                {/* Password */}
                <FormControl id="password" isRequired>
                  <FormLabel fontWeight="medium" color="gray.700">
                    Password
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      focusBorderColor="teal.400"
                      borderRadius="md"
                    />
                    <InputRightElement h="full">
                      <Button
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </Grid>

              {/* Confirm Password (below the grid) */}
              <FormControl id="confirmPassword" isRequired>
                <FormLabel fontWeight="medium" color="gray.700">
                  Confirm Password
                </FormLabel>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  focusBorderColor="teal.400"
                  borderRadius="md"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="teal"
                width="full"
                fontSize={{ base: 'md', md: 'lg' }}
                borderRadius="md"
                mt={4}
              >
                Register
              </Button>
            </VStack>
          </form>

          <Text
            fontSize={{ base: 'sm', md: 'md' }}
            color="gray.600"
            textAlign="center"
          >
            Already have an account?{' '}
            <Button
              variant="link"
              color="teal.500"
              fontWeight="bold"
              onClick={handleLoginClick}
            >
              Login here
            </Button>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Register;
