export const CHAT_STYLES = {
  colors: {
    primary: 'green.500',
    secondary: 'blue.500',
    background: 'gray.50',
    messageSelf: 'green.500',
    messageOther: 'white',
    avatarBorder: 'rgba(255, 255, 255, 0.9)',
    avatarGlow: '0 0 8px rgba(0, 255, 0, 0.3)',
    mediaBackground: 'rgba(0, 0, 0, 0.03)',
  },
  messageBubble: {
    maxWidth: '70%',
    borderRadius: 'lg',
    padding: 3,
    media: {
      maxWidth: '300px',
      borderRadius: 'md',
      shadow: 'sm',
    }
  },
  scrollbar: {
    width: '6px',
    thumbColor: 'rgba(0,0,0,0.1)',
    trackColor: 'transparent',
  },
  avatar: {
    sizes: {
      header: 'lg',
      sidebar: 'md',
    },
    border: '3px solid',
    glow: true,
    hoverGlow: '0 0 12px rgba(0, 255, 0, 0.5)',
  },
  typingIndicator: {
    color: 'gray.500',
    fontSize: 'sm',
  },
};

export const MESSAGE_STATUS = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  PENDING: 'pending',
};

export const ALLOWED_FILE_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif'],
  video: ['video/mp4', 'video/webm'],
  maxSize: 10485760, // 10MB
};
