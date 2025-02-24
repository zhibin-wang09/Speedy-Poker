"use client";

import { socket } from "@/socket";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Box, Center, Spinner, Stack, Text } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";

export default function WaitingPage() {
  const params = useParams<{ roomID: string }>();
  const router = useRouter();

  useEffect(() => {
    socket.emit("onPlayerReady", Number(params.roomID));

    const handleStartGame = () => {
      router.push(`/game/${params.roomID}`);
    };

    socket.on("startGameSession", handleStartGame);

    return () => {
      socket.off("startGameSession", handleStartGame); // Proper cleanup
    };
  }, [router, params]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
    >
      <Center height="100vh">
        <Box>
          <Stack direction="column" justifyContent="center">
            <Text as="b">Waiting For Another Player</Text>
            <Center>
              <Spinner
                size="lg" // Adjust size of the spinner
                color="white" // Set the color to white
              />
            </Center>
            <Box boxShadow="xs" rounded="md" textAlign="center">
              {`Game Code: ${params.roomID}`}
            </Box>
          </Stack>
        </Box>
      </Center>
    </motion.div>
  );
}
