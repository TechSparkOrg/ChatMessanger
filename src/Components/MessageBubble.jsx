const MessageBubble = ({ message }) => {
  const isSelf = message.from === 'self';
  const statusColor = message.status === MESSAGE_STATUS.READ ? '#34B7F1' : 'currentColor';

  return (
    <Box
      maxW={message.media ? '400px' : CHAT_STYLES.messageBubble.maxWidth}
      ml={isSelf ? 'auto' : 0}
      bg={message.media ? 'transparent' : isSelf ? CHAT_STYLES.colors.messageSelf : CHAT_STYLES.colors.messageOther}
      color={isSelf ? 'white' : 'black'}
      borderRadius="lg"
      p={message.media ? 0 : 3}
      position="relative"
      transition="transform 0.2s ease"
      _hover={{ transform: 'scale(1.01)' }}
    >
      {message.media ? (
        <Box bg="transparent">
          {message.media.length === 1 ? (
            <MediaPreview
              type={message.media[0].type}
              content={message.media[0].content}
              fileName={message.media[0].fileName}
            />
          ) : (
            <MediaGrid media={message.media} />
          )}
        </Box>
      ) : null}
      
      {message.text && (
        <Box
          bg={isSelf ? CHAT_STYLES.colors.messageSelf : CHAT_STYLES.colors.messageOther}
          p={3}
          borderRadius="lg"
          mt={message.media ? 2 : 0}
        >
          <Text mb={1} fontSize="md" lineHeight="1.5">{message.text}</Text>
        </Box>
      )}

      <HStack spacing={1} justify="flex-end" opacity={0.8} fontSize="xs" mt={1}>
        {message.fileSize && <Text fontSize="xs" opacity={0.8} mr={2}>{message.fileSize}</Text>}
        <Text color={isSelf ? 'white' : 'gray.600'}>{message.time}</Text>
        {isSelf && <Box color={statusColor}><MessageStatus status={message.status} /></Box>}
      </HStack>
    </Box>
  );
};
