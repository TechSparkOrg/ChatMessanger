import React, { useState } from 'react';
import {
  Box,
  Image,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import {
  CloseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import PropTypes from 'prop-types';

const MediaDisplay = ({ media, onRemove, isPreview = false }) => {
  const [viewIndex, setViewIndex] = useState(null);

  const getGridTemplate = (count) => {
    switch (count) {
      case 1: return '1fr';
      case 2: return 'repeat(2, 1fr)';
      case 3: return '100% 100%';
      case 4: return 'repeat(2, 1fr)';
      default: return 'repeat(3, 1fr)';
    }
  };

  return (
    <>
      <Grid
        templateColumns={getGridTemplate(media.length)}
        gap={1}
        maxW="100%"
        borderRadius="lg"
        overflow="hidden"
      >
        {media.map((item, index) => (
          <Box
            key={index}
            position="relative"
            paddingTop={media.length === 1 ? '56.25%' : '100%'}
            gridColumn={media.length === 3 && index === 2 ? 'span 2' : 'auto'}
          >
            <Image
              src={item.content}
              alt={item.fileName}
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              objectFit="cover"
              cursor="pointer"
              onClick={() => setViewIndex(index)}
              transition="transform 0.2s"
              _hover={{ transform: 'scale(1.02)' }}
            />
            {isPreview && onRemove && (
              <IconButton
                icon={<CloseIcon />}
                size="xs"
                position="absolute"
                top={2}
                right={2}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}
                colorScheme="blackAlpha"
              />
            )}
            {media.length > 4 && index === 3 && (
              <Box
                position="absolute"
                inset={0}
                bg="blackAlpha.700"
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="xl"
                fontWeight="bold"
              >
                +{media.length - 4}
              </Box>
            )}
          </Box>
        ))}
      </Grid>

      <Modal isOpen={viewIndex !== null} onClose={() => setViewIndex(null)} size="full">
        <ModalOverlay />
        <ModalContent bg="blackAlpha.900" m={0}>
          <ModalBody p={0} position="relative">
            <Flex h="100vh" align="center" justify="center">
              <IconButton
                icon={<ChevronLeftIcon boxSize={8} />}
                onClick={() => setViewIndex(prev => (prev > 0 ? prev - 1 : media.length - 1))}
                position="absolute"
                left={4}
                variant="ghost"
                colorScheme="whiteAlpha"
                isDisabled={media.length === 1}
              />
              <Image
                src={media[viewIndex]?.content}
                alt="preview"
                maxH="90vh"
                maxW="90vw"
                objectFit="contain"
              />
              <IconButton
                icon={<ChevronRightIcon boxSize={8} />}
                onClick={() => setViewIndex(prev => (prev < media.length - 1 ? prev + 1 : 0))}
                position="absolute"
                right={4}
                variant="ghost"
                colorScheme="whiteAlpha"
                isDisabled={media.length === 1}
              />
              <IconButton
                icon={<CloseIcon />}
                onClick={() => setViewIndex(null)}
                position="absolute"
                top={4}
                right={4}
                variant="ghost"
                colorScheme="whiteAlpha"
              />
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

MediaDisplay.propTypes = {
  media: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string.isRequired,
      fileName: PropTypes.string,
      type: PropTypes.string,
    })
  ).isRequired,
  onRemove: PropTypes.func,
  isPreview: PropTypes.bool,
};

MediaDisplay.defaultProps = {
  onRemove: null,
  isPreview: false,
};

export default MediaDisplay;
