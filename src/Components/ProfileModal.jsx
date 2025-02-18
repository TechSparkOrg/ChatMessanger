// components/ChatSidebar/ProfileModal.jsx
import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Avatar,
  Text,
  Box,
  VStack,
  HStack,
  Divider,
  Button,
} from '@chakra-ui/react';
import RemoteServices from '../Remoteservies/remoteservices';

const ProfileModal = ({
  isOpen,
  onClose,

  
 user,
  typography,
}) => {

  const handleLogout = () => {
    RemoteServices.logoutcookies();
    localStorage.clear();
    window.location.href = '/';
  }


  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontFamily={typography.heading} color={typography.colors.primary}>
          My Profile
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4} align="center">
              <Avatar size="lg" name={user.name} />
              <Box>
                <Text
                  fontSize={typography.sizes.md}
                  fontWeight="700"
                  fontFamily={typography.heading}
                >
                  {user.name}
                </Text>
                <Text
                  fontSize={typography.sizes.sm}
                  color="gray.600"
                  fontFamily={typography.body}
                >
                  {user.email}
                </Text>
              </Box>
            </HStack>
            <Divider />
            <Box>
              <Text
                fontSize={typography.sizes.sm}
                color="gray.500"
                mb={1}
                fontFamily={typography.body}
              >
                Phone Number
              </Text>
              <Text
                fontSize={typography.sizes.md}
                fontWeight="600"
                fontFamily={typography.body}
              >
                {user.phone_number}
              </Text>
            </Box>

            {/* Follower/Following Stats in Profile */}
            <Divider />
            <HStack justify="space-between">
              <Box>
                <Text
                  fontSize={typography.sizes.sm}
                  color="gray.500"
                  fontFamily={typography.body}
                  mb={1}
                >
                  Followers
                </Text>
                <Text
                  fontSize={typography.sizes.md}
                  fontWeight="700"
                  fontFamily={typography.heading}
                >
                  {user.followers}
                </Text>
              </Box>
              <Box>
                <Text
                  fontSize={typography.sizes.sm}
                  color="gray.500"
                  fontFamily={typography.body}
                  mb={1}
                >
                  Following
                </Text>
                <Text
                  fontSize={typography.sizes.md}
                  fontWeight="700"
                  fontFamily={typography.heading}
                >
                  {user.following}
                </Text>
              </Box>
              <Button
                size="sm"
                colorScheme="blue"
             
                variant={user.isFollowing ? 'solid' : 'outline'}
                alignSelf="flex-end"
              >
                {user.isFollowing ? 'Following' : 'Follow'}
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" colorScheme="red" mr={3} onClick={handleLogout}>
            Logout
          </Button>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProfileModal;
