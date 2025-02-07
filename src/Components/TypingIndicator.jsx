import React from 'react';
import { Box, Circle } from '@chakra-ui/react';

const TypingIndicator = () => (
  <Box display="flex" alignItems="center">
    <Circle size="8px" bg="gray.400" mr="2px" />
    <Circle size="8px" bg="gray.400" mr="2px" />
    <Circle size="8px" bg="gray.400" />
  </Box>
);

export default TypingIndicator;
