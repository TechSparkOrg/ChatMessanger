// src/components/Login.jsx
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
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import RemoteServices from '../Remoteservies/remoteservices';

const Login = () => {
  const navigate = useNavigate();
  // State for form values and password visibility
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation for empty fields
    if (!email || !password) {
      toast({
        title: 'Missing fields',
        description: 'Please enter both email and password.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Replace with your actual login API call
      await RemoteServices.loginPost({ email, password }).then((response) => {
        if (response.status ===200) {
          // Store the token in local storage
          localStorage.setItem('token', response.token);
          localStorage.setItem('user',JSON.stringify(response.user));
          toast({
            title: 'Login successful',
            description: 'Welcome back! Redirecting to chat...',
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
          // Redirect to the home page
          navigate('/chat');
        } else if(response.status ===400) {
          toast({
            title: 'Login failed',
            description: 'Please check your credentials and try again.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      });
    
    } catch (error) {
      toast({
        title: 'Error',
        description: `${error.error}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      // Subtle gradient background for enhanced look
      bgGradient="linear(to-br, teal.50, blue.50)"
      p={4}
    >
      <Box
        bg="white"
        p={{ base: 8, md: 10 }}
        borderRadius="xl"
        boxShadow="lg"
        width={{ base: '90%', sm: '400px' }}
      >
        <VStack spacing={6} align="stretch">
          {/* Responsive and refined header */}
          <Heading
            as="h1"
            fontSize={{ base: '2xl', md: '3xl' }}
            textAlign="center"
            fontFamily="'Helvetica Neue', sans-serif"
            color="gray.800"
          >
            ChatMessage Login
          </Heading>
          <form onSubmit={handleLogin}>
            <FormControl id="email" isRequired>
              <FormLabel
                color="gray.600"
                fontFamily="'Helvetica Neue', sans-serif"
                fontSize={{ base: 'sm', md: 'md' }}
              >
                Email Address
              </FormLabel>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fontSize={{ base: 'sm', md: 'md' }}
                focusBorderColor="teal.400"
              />
            </FormControl>
            <FormControl id="password" mt={4} isRequired>
              <FormLabel
                color="gray.600"
                fontFamily="'Helvetica Neue', sans-serif"
                fontSize={{ base: 'sm', md: 'md' }}
              >
                Password
              </FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fontSize={{ base: 'sm', md: 'md' }}
                  focusBorderColor="teal.400"
                />
                <InputRightElement h="full">
                  <Button
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <ViewOffIcon color="gray.500" />
                    ) : (
                      <ViewIcon color="gray.500" />
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Button
              type="submit"
              colorScheme="teal"
              width="full"
              mt={6}
              fontSize={{ base: 'sm', md: 'md' }}
              fontFamily="'Helvetica Neue', sans-serif"
            >
              Login
            </Button>
          </form>
          <Text
            fontSize={{ base: 'xs', md: 'sm' }}
            color="gray.500"
            textAlign="center"
            fontFamily="'Helvetica Neue', sans-serif"
          >
            Forgot your password? Contact support.
          </Text>
          <Text
            fontSize={{ base: 'xs', md: 'sm' }}
            color="gray.500"
            textAlign="center"
          >
            Don't have an account?{' '}
            <Button variant="link" color="teal.500" onClick={handleRegisterClick}>
              Register here
            </Button>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Login;
