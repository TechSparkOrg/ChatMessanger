import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Avatar,
  Text,
  Textarea,
  IconButton,
  useColorMode,
  Spinner,
  Grid,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
} from '@chakra-ui/react';
import { InfoIcon, CloseIcon } from '@chakra-ui/icons';
import { FiSend } from 'react-icons/fi';
import { BsTelephone, BsImage, BsCheck2All, BsCheck2 } from 'react-icons/bs';
import { BiTime } from 'react-icons/bi';

import { CHAT_STYLES, MESSAGE_STATUS, ALLOWED_FILE_TYPES } from '../constants/chatStyles';
import { getFileType, formatFileSize, scrollToBottom } from '../utils/chatUtils';
import ChatSidebar from './ChatSidebar';
import MediaDisplay from './MediaDisplay';
import TypingIndicator from './TypingIndicator';
import PropTypes from 'prop-types';

const ChatRoom = () => {
  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello there!', from: 'other', time: '09:41', status: 'read' },
    { id: 2, text: 'Hi! How are you?', from: 'self', time: '09:42', status: 'read' },
    { id: 3, text: "I'm good, thanks! What about you?", from: 'other', time: '09:43', status: 'delivered' },
  ]);
  const [message, setMessage] = useState('');
  const [selectedMedia, setSelectedMedia] = useState([]); // was null
  const [isTyping, setIsTyping] = useState(false);
  const { colorMode } = useColorMode();
  const [selectedContact, setSelectedContact] = useState(null);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const contacts = [
    { id: 1, name: 'Alice', lastMessage: 'See you later!' },
    { id: 2, name: 'Bob', lastMessage: 'Thanks!' },
    { id: 3, name: 'Charlie', lastMessage: 'Hello!' },
  ];

  useEffect(() => {
    scrollToBottom(messageEndRef);
  }, [messages]);

  useEffect(() => {
    if (message.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1500);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [message]);

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      if (file.size > ALLOWED_FILE_TYPES.maxSize) {
        setError('File too large. Maximum size is 10MB');
        return;
      }
      const fileType = getFileType(file);
      if (fileType === 'file') {
        setError('Unsupported file type');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedMedia((prev) => [
          ...prev,
          {
            type: fileType,
            content: e.target.result,
            fileName: file.name,
            fileSize: formatFileSize(file.size),
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  // New function to actually send the message
  const doSendMessage = async () => {
    const newMessage = {
      id: Date.now(),
      text: message,
      from: 'self',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: MESSAGE_STATUS.SENT,
      ...(selectedMedia.length > 0 && { media: selectedMedia }), // add media field
    };

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    setMessages((prev) => [...prev, newMessage]);
    setMessage('');
    setSelectedMedia([]);
    scrollToBottom(messageEndRef);
  };

  // Add new handler for enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Modified send handler: send directly without a confirmation modal
  const handleSendMessage = async () => {
    if ((message.trim() !== '' || selectedMedia.length > 0) && !isSending) {
      setIsSending(true);
      try {
        await doSendMessage();
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleSelectContact = (contact) => setSelectedContact(contact);
  const handleVoiceMessage = () => console.log("Voice message triggered");

  const bubbleStyle = {
    self: {
      bg: 'green.500',
      color: 'white',
      borderTopRightRadius: 0,
      ml: 'auto',
      position: 'relative',
      _after: {
        content: '""',
        position: 'absolute',
        right: '-8px',
        top: 0,
        width: 0,
        height: 0,
        borderTop: '8px solid #48BB78',
        borderRight: '8px solid transparent',
      }
    },
    other: {
      bg: 'white',
      color: 'gray.800',
      borderTopLeftRadius: 0,
      mr: 'auto',
      position: 'relative',
      _after: {
        content: '""',
        position: 'absolute',
        left: '-8px',
        top: 0,
        width: 0,
        height: 0,
        borderTop: '8px solid white',
        borderLeft: '8px solid transparent',
      }
    }
  };

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    if (scrollTop === 0) {
      console.log('Reached top of messages');
      // You can load more messages here
    }
  };

  return (
    <Flex h="100vh" overflow="hidden" bgGradient={colorMode === 'dark' ? "linear(to-br, gray.700, blue.900)" : "linear(to-br, gray.100, blue.50)"}>
      <ChatSidebar onSelectContact={handleSelectContact} selectedContact={selectedContact} />
      <Flex flex="1" direction="column">
        <Flex align="center" bg={colorMode === 'dark' ? "blue.800" : CHAT_STYLES.colors.primary} p={4} color="white" boxShadow="md">
          <Avatar
            size={CHAT_STYLES.avatar.sizes.header}
            name={selectedContact?.name || "Alice"}
            mr={3}
            border={CHAT_STYLES.avatar.border}
            borderColor={CHAT_STYLES.colors.avatarBorder}
            boxShadow={CHAT_STYLES.avatar.glow ? CHAT_STYLES.colors.avatarGlow : 'none'}
            bg="white"
            color={CHAT_STYLES.colors.primary}
            fontWeight="bold"
            _hover={{ boxShadow: CHAT_STYLES.avatar.hoverGlow, transition: 'box-shadow 0.3s ease' }}
            cursor="pointer"
          />
          <Box flex="1">
            <Text fontWeight="bold" fontSize="lg">{selectedContact?.name || "Alice"}</Text>
            {isTyping ? <TypingIndicator /> : <Text fontSize="xs" opacity={0.8}>online</Text>}
          </Box>
          <HStack spacing={3}>
            <IconButton icon={<BsTelephone />} variant="ghost" size="sm" color="white" _hover={{ bg: 'green.600' }} aria-label="Call" />
            <IconButton icon={<InfoIcon />} variant="ghost" size="sm" color="white" _hover={{ bg: 'green.600' }} aria-label="Info" />
          </HStack>
        </Flex>
        <Box flex="1" overflowY="auto" ref={messageEndRef} p={4} onScroll={handleScroll} css={{
          '&::-webkit-scrollbar': { width: CHAT_STYLES.scrollbar.width },
          '&::-webkit-scrollbar-thumb': { background: CHAT_STYLES.scrollbar.thumbColor, borderRadius: CHAT_STYLES.scrollbar.width },
        }}>
          <VStack spacing={2} align="stretch">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </VStack>
        </Box>
        {selectedMedia.length > 0 && (
          <Box
            p={3}
            bg={colorMode === 'dark' ? 'gray.800' : 'white'}
            borderTop="1px"
            borderColor="gray.200"
          >
            <Box maxW="md" mx="auto">
              <MediaDisplay
                media={selectedMedia}
                onRemove={(index) => setSelectedMedia(prev => prev.filter((_, i) => i !== index))}
                isPreview={true}
              />
            </Box>
          </Box>
        )}
        {isSliderOpen && (
          <MediaSlider
            isOpen={isSliderOpen}
            onClose={() => setIsSliderOpen(false)}
            media={selectedMedia}
          />
        )}
        <Flex p={3} bg={colorMode === 'dark' ? "gray.800" : "white"} borderTop="1px" borderColor="gray.200">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple // added multiple attribute
            accept={[...ALLOWED_FILE_TYPES.image, ...ALLOWED_FILE_TYPES.video].join(',')}
            style={{ display: 'none' }}
          />
          <HStack spacing={2} mr={3}>
            <IconButton icon={<BsImage />} variant="ghost" onClick={() => fileInputRef.current?.click()} aria-label="Upload media" />
          </HStack>
          {/* Updated Textarea design with decreased border and expandability */}
          <Textarea
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            bg="gray.50"
            borderRadius="xl"
            borderWidth="1px"
            size="lg"
            mr={2}
            resize="vertical"
            disabled={isSending}
            _hover={{ borderColor: 'blue.300' }}
            _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px rgba(66,153,225,0.5)' }}
          />
          <IconButton
            icon={isSending ? <Spinner size="sm" /> : <FiSend />}
            colorScheme="green"
            borderRadius="full"
            size="lg"
            onClick={handleSendMessage}
            isLoading={isSending}
            aria-label="Send message"
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

const ImagePreview = ({ src, onClick }) => (
  <Image
    src={src}
    alt="preview"
    objectFit="cover"
    borderRadius="md"
    cursor="pointer"
    onClick={onClick}
    _hover={{ opacity: 0.9 }}
  />
);

const MediaMessage = ({ media }) => {
  const [viewIndex, setViewIndex] = useState(null);

  const gridTemplates = {
    1: '1fr',
    2: 'repeat(2, 1fr)',
    3: 'repeat(2, 1fr)',
    4: 'repeat(2, 1fr)',
  };

  return (
    <>
      <Grid
        templateColumns={gridTemplates[Math.min(media.length, 4)]}
        gap={1}
        maxW="300px"
      >
        {media.slice(0, 4).map((item, index) => (
          <Box
            key={index}
            position="relative"
            height={media.length === 1 ? '200px' : '100px'}
            gridColumn={media.length === 3 && index === 2 ? 'span 2' : 'auto'}
          >
            <ImagePreview
              src={item.content}
              onClick={() => setViewIndex(index)}
            />
            {media.length > 4 && index === 3 && (
              <Box
                position="absolute"
                inset={0}
                bg="blackAlpha.600"
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="md"
              >
                +{media.length - 4}
              </Box>
            )}
          </Box>
        ))}
      </Grid>

      <Modal
        isOpen={viewIndex !== null}
        onClose={() => setViewIndex(null)}
        size="full"
      >
        <ModalOverlay />
        <ModalContent bg="blackAlpha.900">
          <ModalBody p={0}>
            <IconButton
              position="absolute"
              top={4}
              right={4}
              icon={<CloseIcon />}
              onClick={() => setViewIndex(null)}
              variant="ghost"
              colorScheme="whiteAlpha"
            />
            <Flex h="100vh" align="center" justify="center">
              <Image
                src={media[viewIndex]?.content}
                alt="full preview"
                maxH="90vh"
                maxW="90vw"
                objectFit="contain"
              />
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const MessageBubble = ({ message }) => {
  const isSelf = message.from === 'self';
  
  return (
    <Box
      maxW={message.media ? { base: '85%', md: '400px' } : '70%'}
      ml={isSelf ? 'auto' : 0}
      bg="transparent"
    >
      {message.media && (
        <Box
          mb={message.text ? 2 : 0}
          borderRadius="lg"
          overflow="hidden"
        >
          <MediaDisplay media={message.media} />
        </Box>
      )}
      {message.text && (
        <Box
          bg={isSelf ? 'green.500' : 'white'}
          color={isSelf ? 'white' : 'black'}
          p={3}
          borderRadius="lg"
          boxShadow="sm"
        >
          <Text>{message.text}</Text>
        </Box>
      )}
      <HStack spacing={1} justify="flex-end" fontSize="xs" mt={1} opacity={0.8}>
        <Text color={isSelf ? 'white' : 'gray.600'}>{message.time}</Text>
        {isSelf && <MessageStatus status={message.status} />}
      </HStack>
    </Box>
  );
};

MessageBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    text: PropTypes.string,
    from: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    status: PropTypes.string,
    type: PropTypes.string,
    content: PropTypes.string,
    fileName: PropTypes.string,
    fileSize: PropTypes.string,
    media: PropTypes.array, // Add this line
  }).isRequired,
};

const MessageStatus = ({ status }) => {
  switch (status) {
    case MESSAGE_STATUS.PENDING: return <BiTime />;
    case MESSAGE_STATUS.SENT: return <BsCheck2 />;
    case MESSAGE_STATUS.DELIVERED: return <BsCheck2All />;
    case MESSAGE_STATUS.READ: return <BsCheck2All color="#34B7F1" />;
    default: return null;
  }
};

MessageStatus.propTypes = { status: PropTypes.string.isRequired };

const GlobalStyles = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = GlobalStyles;
  document.head.appendChild(styleTag);
}

ImagePreview.propTypes = {
  src: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

MediaMessage.propTypes = {
  media: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string.isRequired,
      fileName: PropTypes.string,
      type: PropTypes.string,
    })
  ).isRequired,
};

export default ChatRoom;
