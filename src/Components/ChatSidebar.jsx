// components/ChatSidebar/ChatSidebar.jsx
import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useBreakpointValue,
  useDisclosure,
  Button,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

import SidebarHeader from './SidebarHeader';
import SidebarContacts from './SidebarContacts';
import ProfileModal from './ProfileModal';

const ChatSidebar = ({ onSelectContact, selectedContact }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Profile Modal controls
  const {
    isOpen: isProfileOpen,
    onOpen: onOpenProfile,
    onClose: onCloseProfile,
  } = useDisclosure();

  // Dummy user info
  const [user, setUser] = useState({
    name: 'John Doe',
    phone: '+1 (123) 456-7890',
    email: 'john.doe@example.com',
    followers: 100,
    following: 50,
    isFollowing: false,
  });

  // Toggle follow/unfollow logic
  const handleToggleFollow = () => {
    setUser((prev) => ({ ...prev, isFollowing: !prev.isFollowing }));
  };

  // Example logout
  const handleLogout = () => {
    alert('Logged out!');
    // Replace with your real logout flow
  };

  // Filtered contacts (dummy data)
  const contacts = [
    {
      id: 1,
      name: 'Alice',
      lastMessage: 'See you later!',
      time: '10:30 AM',
      online: true,
      lastMessageFrom: 'other',
      unseenCount: 2,
    },
    {
      id: 2,
      name: 'Bob',
      lastMessage: 'Thanks!',
      time: '9:45 AM',
      online: false,
      lastMessageFrom: 'other',
      unseenCount: 0,
    },
    {
      id: 3,
      name: 'Charlie',
      lastMessage: 'Hello!',
      time: 'Yesterday',
      online: true,
      lastMessageFrom: 'self',
      lastMessageStatus: 'delivered',
      unseenCount: 0,
    },
    {
      id: 4,
      name: 'David',
      lastMessage: 'Let me know!',
      time: '8:00 AM',
      online: false,
      lastMessageFrom: 'self',
      lastMessageStatus: 'pending',
      unseenCount: 0,
    },
    {
      id: 5,
      name: 'Eva',
      lastMessage: 'Good night!',
      time: '11:00 PM',
      online: true,
      lastMessageFrom: 'other',
      unseenCount: 5,
    },
  ];
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Breakpoint check
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Basic typography & color style
  const typography = {
    heading: "'Montserrat', sans-serif",
    body: "'Inter', sans-serif",
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
    },
    colors: {
      primary: 'blue.600',
      secondary: 'gray.600',
      muted: 'gray.400',
      highlight: 'blue.500',
    },
  };

  // ---- Sidebar Content for Desktop and Drawer Body ----
  const SidebarContent = (
    <Box
      w={{ base: '100%', md: '320px' }}
      bg="white"
      h="100%"
      boxShadow={{ base: 'none', md: 'lg' }}
      borderRight="1px"
      borderColor="gray.200"
      p={4}
      bgGradient="linear(to-b, white, gray.50)"
    >
      <SidebarHeader
        user={user}
        onOpenProfile={onOpenProfile}
        handleToggleFollow={handleToggleFollow}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        typography={typography}
      />

      <SidebarContacts
        contacts={filteredContacts}
        selectedContact={selectedContact}
        onSelectContact={onSelectContact}
        typography={typography}
        maxHeight="calc(100vh - 280px)"
      />
    </Box>
  );

  return (
    <>
      {/* Mobile: Show hamburger icon that opens a drawer */}
      {isMobile ? (
        <>
          <IconButton
            icon={<HamburgerIcon />}
            variant="ghost"
            aria-label="Open sidebar"
            onClick={() => setIsDrawerOpen(true)}
            m={4}
            colorScheme="gray"
          />
          <Drawer
            isOpen={isDrawerOpen}
            placement="left"
            onClose={() => setIsDrawerOpen(false)}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader
                borderBottomWidth="1px"
                fontFamily={typography.heading}
                fontSize={typography.sizes.xl}
                fontWeight="700"
                color={typography.colors.primary}
              >
                Chats
              </DrawerHeader>
              <DrawerBody p={0}>{SidebarContent}</DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        // Desktop: Sidebar is always visible
        SidebarContent
      )}

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={onCloseProfile}
        user={user}
        handleToggleFollow={handleToggleFollow}
        handleLogout={handleLogout}
        typography={typography}
      />
    </>
  );
};

export default ChatSidebar;
