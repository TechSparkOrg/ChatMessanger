// components/ChatSidebar/SidebarHeader.jsx
import React from 'react';
import {
  Box,
  Text,
  IconButton,
  Avatar,
  VStack,
  HStack,
  Button,
  InputGroup,
  InputLeftElement,
  Input,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const SidebarHeader = ({
  user,
  onOpenProfile,
  handleToggleFollow,
  searchQuery,
  setSearchQuery,
  typography,
}) => {
  return (
    <VStack align="stretch" spacing={4} mb={6}>
      <HStack justify="space-between">
        {/* Title */}
        <Text
          fontSize={typography.sizes['2xl']}
          fontWeight="800"
          fontFamily={typography.heading}
          letterSpacing="tight"
          bgGradient="linear(to-r, blue.500, purple.500)"
          bgClip="text"
          textTransform="uppercase"
          transition="color 0.3s ease"
        >
          Chats
        </Text>
        {/* Profile Button (Avatar) */}
        <IconButton
          variant="ghost"
          aria-label="Open profile"
          icon={
            <Avatar
              size="sm"
              name={user.name}
              bg="gray.200"
              color="gray.800"
              cursor="pointer"
            />
          }
          onClick={onOpenProfile}
        />
      </HStack>

    

      {/* Search Field */}
      <InputGroup size="lg">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color={typography.colors.primary} />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          bg="gray.50"
          border="2px solid"
          borderColor="gray.100"
          borderRadius="xl"
          _focus={{
            bg: 'white',
            borderColor: 'blue.500',
            boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)',
          }}
          _hover={{ borderColor: 'gray.300' }}
          fontSize={typography.sizes.sm}
          fontFamily={typography.body}
          fontWeight="medium"
          transition="all 0.3s ease"
        />
      </InputGroup>
    </VStack>
  );
};

export default SidebarHeader;
