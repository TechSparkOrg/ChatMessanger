// components/ChatSidebar/ChatSidebar.jsx
import React, { useEffect, useState } from 'react';
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
import RemoteServices from '../Remoteservies/remoteservices';

const ChatSidebar = ({ onSelectContact, selectedContact,contacts }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [SearchData, setSearchData] = useState([])
  // Profile Modal controls
  const {
    isOpen: isProfileOpen,
    onOpen: onOpenProfile,
    onClose: onCloseProfile,
  } = useDisclosure();

    const user =JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
      if (searchQuery.length > 0) {
        RemoteServices.getSearchUser(searchQuery).then((data) => {
    
          setSearchData(data);
        });
      } else {
        setSearchData([]);
      }
    }, [searchQuery]);
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
      
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        typography={typography}
      />

     {SearchData.length > 0 ? (
            <SidebarContacts
              contacts={SearchData}
              selectedContact={selectedContact}
              onSelectContact={onSelectContact}
              typography={typography}
              maxHeight="calc(100vh - 280px)"
            />
          ) : (
            <SidebarContacts
              contacts={contacts}
              selectedContact={selectedContact}
              onSelectContact={onSelectContact}
              typography={typography}
              maxHeight="calc(100vh - 280px)"
            />
          )}
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
      
        typography={typography}
      />
    </>
  );
};

export default ChatSidebar;
