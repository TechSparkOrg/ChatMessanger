import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
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
} from "@chakra-ui/react";
import { InfoIcon, CloseIcon } from "@chakra-ui/icons";
import { FiSend } from "react-icons/fi";
import { BsTelephone, BsImage, BsCheck2All, BsCheck2 } from "react-icons/bs";
import { BiTime } from "react-icons/bi";
import {
  CHAT_STYLES,
  MESSAGE_STATUS,
  ALLOWED_FILE_TYPES,
} from "../constants/chatStyles";
import {
  getFileType,
  formatFileSize,
  scrollToBottom,
} from "../utils/chatUtils";
import ChatSidebar from "./ChatSidebar";
import MediaDisplay from "./MediaDisplay";
import TypingIndicator from "./TypingIndicator";
import PropTypes from "prop-types";
import { SocketContext } from "../Remoteservies/socket";
import RemoteServices from "../Remoteservies/remoteservices";
import MessageBubble from "./MessageBubble";

const ChatRoom = () => {
  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);
  const { socket } = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const { colorMode } = useColorMode();
  const [selectedContact, setSelectedContact] = useState(null);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [contact, setcontact] = useState([]);
  const [nexturl, setnexturl] = useState(null);

  useEffect(() => {
    scrollToBottom(messageEndRef);
  }, [messages]);

  useEffect(() => {
    const getContactlist = () => {
      RemoteServices.getContact()
        .then((res) => setcontact(res))
        .catch((error) => console.log("error getcontact", error));
    };

    getContactlist();
  }, []);

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      if (file.size > ALLOWED_FILE_TYPES.maxSize) {
        setError("File too large. Maximum size is 10MB");
        return;
      }
      const fileType = getFileType(file);
      if (fileType === "file") {
        setError("Unsupported file type");
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
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleMessage = useCallback((e) => {
    const data = JSON.parse(e.data);
    console.log("Socket message received:", data);

    if (data.action_type === "message" && selectedContact) {
      setMessages((prev) => [...prev, data]);
    }

    if (data.action_type === "delivery_status") {
      setMessages((prev) =>
        prev.map((msg) =>
          data.id === msg.id ? { ...msg, status: data.status } : msg
        )
      );
    }

    if (data.action_type === "typing") {
      if (selectedContact?.id === data.from) {
        setIsTyping(data.typing);
      }
    }

    if (
      data.to === JSON.parse(localStorage.getItem("user")).id &&
      data.action_type === "message"
    ) {
      let delivery = {
        action_type: "delivery_status",
        id: data.id,
        status:
          selectedContact?.id === data.from || selectedContact?.id === data.sender
            ? MESSAGE_STATUS.READ
            : MESSAGE_STATUS.DELIVERED,
        from: data.to,
        to: data.from || data.sender,
      };
      socket.send(JSON.stringify(delivery));
    }
  }, [socket, selectedContact]);

  useEffect(() => {
    if (socket) {
      socket.addEventListener("message", handleMessage);
    }
    return () => {
      if (socket) {
        socket.removeEventListener("message", handleMessage);
      }
    };
  }, [socket, handleMessage]);

  const doSendMessage = async () => {
    const user_id = JSON.parse(localStorage.getItem("user"))?.id;

    const newMessage = {
      from: user_id,
      to: selectedContact.id,
      text: message,
      timestamp: new Date().toISOString(),
      status: MESSAGE_STATUS.SENT,
      media: selectedMedia,
      action_type: "message",
    };

    await new Promise((resolve) => setTimeout(resolve, 500));
    socket.send(JSON.stringify(newMessage));
    setMessage("");
    setSelectedMedia([]);
    scrollToBottom(messageEndRef);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if ((message.trim() !== "" || selectedMedia.length > 0) && !isSending) {
      setIsSending(true);
      try {
        await doSendMessage();
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    RemoteServices.getMessageSelected(contact.id)
      .then((data) => {
        data.results
          .filter(
            (msg) =>
              (msg.from === contact.id || msg.sender === contact.id) &&
              msg.status !== MESSAGE_STATUS.READ
          )
          .forEach((msg) => {
            const deliveryUpdate = {
              action_type: "delivery_status",
              id: msg.id,
              status: MESSAGE_STATUS.READ,
              from: JSON.parse(localStorage.getItem("user")).id,
              to: contact.id,
            };
            socket.send(JSON.stringify(deliveryUpdate));
          });
        setMessages(data.results.reverse());
        setnexturl(data.next);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    if (scrollTop === 0) {
      console.log("Reached top of messages");
      if (nexturl !== null) {
        RemoteServices.paganitionUrl(nexturl)
          .then((data) => {
            setMessages((prev) => [...data.results.reverse(), ...prev]);
            setnexturl(data.next);
          })
          .catch((error) => {
            console.error("Error fetching messages:", error);
          });
      }
    }
  };

  const filteredMessages = useMemo(() => {
    return messages.filter(
      (msg) =>
        msg.sender === selectedContact?.id ||
        msg.recipient === selectedContact?.id ||
        msg.to === selectedContact?.id ||
        msg.from === selectedContact?.id
    );
  }, [messages, selectedContact]);

  return (
    <Flex
      h="100vh"
      overflow="hidden"
      bgGradient={
        colorMode === "dark"
          ? "linear(to-br, gray.700, blue.900)"
          : "linear(to-br, gray.100, blue.50)"
      }
    >
      <ChatSidebar
        onSelectContact={handleSelectContact}
        selectedContact={selectedContact}
        contacts={contact}
      />
      {selectedContact !== null ? (
        <Flex flex="1" direction="column">
          <Flex
            align="center"
            bg={colorMode === "dark" ? "blue.800" : CHAT_STYLES.colors.primary}
            p={4}
            color="white"
            boxShadow="md"
          >
            <Avatar
              size={CHAT_STYLES.avatar.sizes.header}
              name={selectedContact?.name}
              mr={3}
              border={CHAT_STYLES.avatar.border}
              borderColor={CHAT_STYLES.colors.avatarBorder}
              boxShadow={
                CHAT_STYLES.avatar.glow ? CHAT_STYLES.colors.avatarGlow : "none"
              }
              bg="white"
              color={CHAT_STYLES.colors.primary}
              fontWeight="bold"
              _hover={{
                boxShadow: CHAT_STYLES.avatar.hoverGlow,
                transition: "box-shadow 0.3s ease",
              }}
              cursor="pointer"
            />
            <Box flex="1">
              <Text fontWeight="bold" fontSize="lg">
                {selectedContact?.name}
              </Text>
              {isTyping ? (
                <TypingIndicator />
              ) : (
                <Text fontSize="xs" opacity={0.8}>
                  online
                </Text>
              )}
            </Box>
            <HStack spacing={3}>
              <IconButton
                icon={<BsTelephone />}
                variant="ghost"
                size="sm"
                color="white"
                _hover={{ bg: "green.600" }}
                aria-label="Call"
              />
              <IconButton
                icon={<InfoIcon />}
                variant="ghost"
                size="sm"
                color="white"
                _hover={{ bg: "green.600" }}
                aria-label="Info"
              />
            </HStack>
          </Flex>
          <Box
            flex="1"
            overflowY="auto"
            ref={messageEndRef}
            p={4}
            onScroll={handleScroll}
            css={{
              "&::-webkit-scrollbar": { width: CHAT_STYLES.scrollbar.width },
              "&::-webkit-scrollbar-thumb": {
                background: CHAT_STYLES.scrollbar.thumbColor,
                borderRadius: CHAT_STYLES.scrollbar.width,
              },
            }}
          >
            <VStack spacing={2} align="stretch">
              {filteredMessages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
            </VStack>
          </Box>
          {selectedMedia.length > 0 && (
            <Box
              p={3}
              bg={colorMode === "dark" ? "gray.800" : "white"}
              borderTop="1px"
              borderColor="gray.200"
            >
              <Box maxW="md" mx="auto">
                <MediaDisplay
                  media={selectedMedia}
                  onRemove={(index) =>
                    setSelectedMedia((prev) => prev.filter((_, i) => i !== index))
                  }
                  isPreview={true}
                />
              </Box>
            </Box>
          )}
          <Flex
            p={3}
            bg={colorMode === "dark" ? "gray.800" : "white"}
            borderTop="1px"
            borderColor="gray.200"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept={[
                ...ALLOWED_FILE_TYPES.image,
                ...ALLOWED_FILE_TYPES.video,
              ].join(",")}
              style={{ display: "none" }}
            />
            <HStack spacing={2} mr={3}>
              <IconButton
                icon={<BsImage />}
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Upload media"
              />
            </HStack>
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
              _hover={{ borderColor: "blue.300" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px rgba(66,153,225,0.5)",
              }}
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
      ) : (
        <Flex
          flex="1"
          direction="column"
          align="center"
          justify="center"
          bg={colorMode === "dark" ? "gray.800" : "white"}
        >
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color={colorMode === "dark" ? "white" : "gray.800"}
          >
            No Conversation Selected
          </Text>
          <Text
            fontSize="md"
            color={colorMode === "dark" ? "gray.300" : "gray.600"}
            mt={2}
          >
            Please select a contact from the sidebar to start a conversation.
          </Text>
        </Flex>
      )}
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
    1: "1fr",
    2: "repeat(2, 1fr)",
    3: "repeat(2, 1fr)",
    4: "repeat(2, 1fr)",
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
            height={media.length === 1 ? "200px" : "100px"}
            gridColumn={media.length === 3 && index === 2 ? "span 2" : "auto"}
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

const GlobalStyles = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
if (typeof document !== "undefined") {
  const styleTag = document.createElement("style");
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
