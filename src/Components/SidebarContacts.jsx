// components/ChatSidebar/SidebarContacts.jsx
import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Avatar,
  Text,
  Badge,
} from '@chakra-ui/react';
import { MdAccessTime, MdDone, MdDoneAll } from 'react-icons/md';

const SidebarContacts = ({
  contacts,
  selectedContact,
  onSelectContact,
  typography,
  maxHeight = 'calc(100vh - 280px)',
}) => {
  return (
    <VStack
      spacing={3}
      align="stretch"
      overflowY="auto"
      maxH={maxHeight}
      sx={{
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-track': { width: '6px' },
        '&::-webkit-scrollbar-thumb': {
          background: 'gray.200',
          borderRadius: '24px',
        },
      }}
    >
      {contacts.map((contact) => (
        <Box
          key={contact.id}
          onClick={() => onSelectContact(contact)}
          p={4}
          bg={
            contact.unseenCount > 0
              ? 'blue.50'
              : selectedContact?.id === contact.id
              ? 'gray.100'
              : 'white'
          }
          borderRadius="xl"
          boxShadow="sm"
          transition="all 0.3s ease"
          cursor="pointer"
          position="relative"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'md',
            bg: contact.unseenCount > 0 ? 'blue.100' : 'gray.50',
          }}
          _active={{ transform: 'scale(0.98)' }}
        >
          <HStack spacing={4}>
            <Box position="relative">
              <Avatar
                name={contact.name}
                size="md"
                boxShadow="sm"
                border="2px solid white"
              />
              <Box
                position="absolute"
                bottom={0}
                right={0}
                w={3.5}
                h={3.5}
                bg={contact.online ? 'green.400' : 'gray.400'}
                border="2px solid white"
                borderRadius="full"
                boxShadow="sm"
              />
            </Box>
            <Box flex="1" overflow="hidden">
              <HStack justifyContent="space-between" alignItems="center" mb={1}>
                <Text
                  fontWeight="700"
                  color={typography.colors.primary}
                  fontSize={typography.sizes.md}
                  fontFamily={typography.heading}
                  letterSpacing="tight"
                  isTruncated
                >
                  {contact.name}
                </Text>
                <HStack spacing={1}>
                  <Text
                    fontSize={typography.sizes.xs}
                    color={
                      contact.unseenCount > 0
                        ? typography.colors.highlight
                        : typography.colors.muted
                    }
                    fontWeight={contact.unseenCount > 0 ? '600' : '400'}
                    fontFamily={typography.body}
                  >
                    {contact.time}
                  </Text>
                  {contact.unseenCount > 0 && (
                    <Badge
                      colorScheme="blue"
                      fontSize={typography.sizes.xs}
                      fontWeight="600"
                      fontFamily={typography.body}
                      borderRadius="full"
                      px={2}
                      animation="pulse 2s infinite"
                    >
                      {contact.unseenCount}
                    </Badge>
                  )}
                </HStack>
              </HStack>
              <HStack spacing={2}>
                {contact.lastMessageFrom === 'self' && (
                  <Box
                    color={
                      contact.lastMessageStatus === 'read'
                        ? typography.colors.highlight
                        : typography.colors.muted
                    }
                  >
                    {contact.lastMessageStatus === 'pending' && (
                      <MdAccessTime color="gray" size="16px" />
                    )}
                    {contact.lastMessageStatus === 'sent' && (
                      <MdDone color="gray" size="16px" />
                    )}
                    {contact.lastMessageStatus === 'delivered' && (
                      <MdDoneAll color="gray" size="16px" />
                    )}
                    {contact.lastMessageStatus === 'read' && (
                      <MdDoneAll color="blue" size="16px" />
                    )}
                  </Box>
                )}
                <Text
                  fontSize={typography.sizes.sm}
                  color={
                    contact.unseenCount > 0
                      ? typography.colors.primary
                      : typography.colors.secondary
                  }
                  fontWeight={contact.unseenCount > 0 ? '500' : '400'}
                  fontFamily={typography.body}
                  letterSpacing="0.2px"
                  noOfLines={1}
                  isTruncated
                  lineHeight="1.4"
                >
                  {contact.lastMessage}
                </Text>
              </HStack>
            </Box>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
};

export default SidebarContacts;
