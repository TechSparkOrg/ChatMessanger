// components/ChatSidebar/SidebarContacts.jsx

import PropTypes from 'prop-types';
import {
  Box,
  VStack,
  HStack,
  Avatar,
  Text,
  Badge,

  useToast,
} from '@chakra-ui/react';
import { MdAccessTime, MdDone, MdDoneAll } from 'react-icons/md';
import { AiOutlinePlus } from 'react-icons/ai';
import RemoteServices from '../Remoteservies/remoteservices';

const SidebarContacts = ({
  contacts,
  selectedContact,
  onSelectContact,
  typography,
  maxHeight 
}) => {
  const toast=useToast()
  const handleAdd = (id) => {
    RemoteServices.addUserContact(id).then((data) => {
      if (data.status === 200) {
        toast({
          title: 'Contact Added',
          description: 'Contact was added successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        window.location.reload();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add contact',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }).catch((error) => {
      toast({
        title: 'Error',
        description: error?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    });
  };

  
  
  const userid = JSON.parse(localStorage.getItem('user')).id;
  const getDisplayText = (contact) => {
    return contact?.chat_exists
      ? (contact?.last_message)
      : (contact?.phone_number);
  };

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
      {contacts?.map((contact) => (
          <Box
            key={contact?.id}
            onClick={() => onSelectContact?.(contact)}
            p={4}
            bg={
              contact?.unseen_count > 0
                ? 'blue.50'
                : selectedContact?.id === contact?.id
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
              bg: contact?.unseen_count > 0 ? 'blue.100' : 'gray.50',
            }}
            _active={{ transform: 'scale(0.98)' }}
            border={contact?.friend_status === 'unknown' ? "2px dashed rgb(213, 208, 228)" : undefined}
          >
            <HStack spacing={4}>
              <Box position="relative">
                <Avatar
                  name={contact?.name}
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
                  bg={contact?.online ? 'green.400' : 'gray.400'}
                  border="2px solid white"
                  borderRadius="full"
                  boxShadow="sm"
                />
                {contact?.friend_status === 'unknown' && (
                  <Box
                    position="absolute"
                    top={0}
                    right={0}
                    bg="white"
                    borderRadius="full"
                    p={1}
                  >
                    <AiOutlinePlus
                      color="green"
                      size="16px"
                      onClick={() => handleAdd(contact?.id)}
                    />
                  </Box>
                )}
              </Box>
              <Box flex="1" overflow="hidden">
                <HStack justifyContent="space-between" alignItems="center" mb={1}>
                  <Text
                    fontWeight="700"
                    color={typography?.colors?.primary}
                    fontSize={typography?.sizes?.md}
                    fontFamily={typography?.heading}
                    letterSpacing="tight"
                    isTruncated
                  >
                    {contact?.name}
                  </Text>
                  <HStack spacing={1}>
                    <Text
                      fontSize={typography?.sizes?.xs}
                      color={
                        contact?.unseen_count > 0
                          ? typography?.colors?.highlight
                          : typography?.colors?.muted
                      }
                      fontWeight={contact?.unseen_count > 0 ? '600' : '400'}
                      fontFamily={typography?.body}
                    >
                      {contact?.time ?? ''}
                    </Text>
                    {contact?.unseen_count > 0 && (
                      <Badge
                        colorScheme="red"
                        fontSize={typography?.sizes?.xs}
                        fontWeight="600"
                        fontFamily={typography?.body}
                        borderRadius="full"
                        px={2}
                        animation="pulse 2s infinite"
                      >
                        {contact?.unseen_count}
                      </Badge>
                    )}
                  </HStack>
                </HStack>
                <HStack spacing={2}>
                  {contact?.id === userid && (
                    <Box
                      color={
                         typography?.colors?.muted
                      }
                    >
                    you :
                    </Box>
                  )}
                  {contact?.id !== userid  && (
                    <Box
                      color={
                        contact?.delivery_status === 'read'
                          ? typography?.colors?.highlight
                          : typography?.colors?.muted
                      }
                    >
                      {contact?.delivery_status === 'pending' && (
                        <MdAccessTime color="gray" size="16px" />
                      )}
                      {contact?.delivery_status === 'sent' && (
                        <MdDone color="gray" size="16px" />
                      )}
                      {contact?.delivery_status === 'delivered' && (
                        <MdDoneAll color="gray" size="16px" />
                      )}
                      {contact?.delivery_status === 'read' && (
                        <MdDoneAll color="blue" size="16px" />
                      )}
                    </Box>
                  )}
                  <Text
                    fontSize={typography?.sizes?.sm}
                    color={
                      contact?.unseen_count > 0
                        ? typography?.colors?.primary
                        : typography?.colors?.secondary
                    }
                    fontWeight={contact?.unseen_count > 0 ? '500' : '400'}
                    fontFamily={typography?.body}
                    letterSpacing="0.2px"
                    noOfLines={1}
                    isTruncated
                    lineHeight="1.4"
                  >
                    {getDisplayText(contact)}
                  </Text>
                </HStack>
              </Box>
            </HStack>
          </Box>
      ))}
    </VStack>
  );
};

SidebarContacts.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      online: PropTypes.bool,
      unseen_count: PropTypes.number,
      time: PropTypes.string,
      friend_status: PropTypes.string,
      lastMessageFrom: PropTypes.oneOf(['self', 'other']),
      delivery_status: PropTypes.oneOf(['pending', 'sent', 'delivered', 'read']),
      lastMessage: PropTypes.string,
      phone_number: PropTypes.string,
      chat_exists: PropTypes.bool,
    })
  ),
  selectedContact: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  onSelectContact: PropTypes.func,
  typography: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string,
      secondary: PropTypes.string,
      muted: PropTypes.string,
      highlight: PropTypes.string,
    }),
    sizes: PropTypes.shape({
      xs: PropTypes.string,
      sm: PropTypes.string,
      md: PropTypes.string,
    }),
    heading: PropTypes.string,
    body: PropTypes.string,
  }),
  maxHeight: PropTypes.string,
};

SidebarContacts.defaultProps = {
  contacts: [],
  selectedContact: null,
  onSelectContact: () => {},
  typography: {
    colors: {
      primary: '#000000',
      secondary: '#666666',
      muted: '#999999',
      highlight: '#3182CE',
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
    },
    heading: 'system-ui',
    body: 'system-ui',
  },
};

export default SidebarContacts;
