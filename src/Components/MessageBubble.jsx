import React, { memo, useMemo } from "react";
import PropTypes from "prop-types";
import { Box, HStack, Text } from "@chakra-ui/react";
import MediaDisplay from "./MediaDisplay";
import { MESSAGE_STATUS } from "../constants/chatStyles";
import { BsCheck2All, BsCheck2 } from "react-icons/bs";
import { BiTime } from "react-icons/bi";

// Memoized MessageBubble with display name
const MessageBubble = memo(
  (props) => {
    const { message } = props;
    
    const userId = useMemo(() => JSON.parse(localStorage.getItem("user"))?.id, []);
    const isSelf = (message.from || message.sender) === userId;
  
    return (
      <Box maxW={message.media ? { base: "85%", md: "400px" } : "70%"} ml={isSelf ? "auto" : 0} bg="transparent">
        {message.media && (
          <Box mb={message.text ? 2 : 0} borderRadius="lg" overflow="hidden">
            <MediaDisplay media={message.media} />
          </Box>
        )}
        {message.text && (
          <Box bg={isSelf ? "green.500" : "white"} color={isSelf ? "white" : "black"} p={3} borderRadius="lg" boxShadow="sm">
            <Text>{message.text}</Text>
          </Box>
        )}
        <HStack spacing={1} justify="flex-end" fontSize="xs" mt={1} opacity={0.8}>
          <Text color={isSelf ? "white" : "gray.600"}>{message.time}</Text>
          {isSelf && <MessageStatus status={message.status} />}
        </HStack>
      </Box>
    );
  },
  (prevProps, nextProps) => JSON.stringify(prevProps.message) === JSON.stringify(nextProps.message)
);

// Memoized MessageStatus
const MessageStatus = memo(({ status }) => {
  switch (status) {
    case MESSAGE_STATUS.PENDING:
      return <BiTime />;
    case MESSAGE_STATUS.SENT:
      return <BsCheck2 />;
    case MESSAGE_STATUS.DELIVERED:
      return <BsCheck2All />;
    case "read":
      return <BsCheck2All color="#34B7F1" />;
    default:
      return null;
  }
});

// Add Display Names
MessageBubble.displayName = "MessageBubble";
MessageStatus.displayName = "MessageStatus";

// Prop Types
MessageBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    text: PropTypes.string,
    from: PropTypes.string,
    time: PropTypes.string,
    status: PropTypes.string,
    media: PropTypes.array,
  }).isRequired,
};

MessageStatus.propTypes = {
  status: PropTypes.string.isRequired,
};

export default MessageBubble;
