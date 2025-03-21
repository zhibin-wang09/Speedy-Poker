"use client";

import { useEffect } from "react";
import { socket } from "../socket";
import { motion } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Box,
  Center,
  HoverCard,
  HStack,
  Input,
  Portal,
  Spinner,
  Stack,
  Strong,
  Text,
} from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaInfoCircle } from "react-icons/fa";

interface joinGameInput {
  roomID: number;
  playerName: string;
}

export default function Home() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<joinGameInput>();
  const watchPlayerName = watch("playerName");
  const router = useRouter();
  useEffect(() => {
    socket.on("receiveRoomID", (roomID) => {
      router.push(`/waiting/${roomID}`);
    });

    return () => {
      socket.off("receiveRoomID");
    };
  }, [router, watchPlayerName]);

  const createGame: SubmitHandler<joinGameInput> = (data: joinGameInput) => {
    socket.emit("joinGameRoom", data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
    >
      <Center height="100vh">
        <Box>
          <Stack direction={["column"]}>
            <HStack>
              <Text fontSize="4xl" as="b">
                Tatari
              </Text>
              <HoverCard.Root positioning={{placement: "top"}}>
                <HoverCard.Trigger asChild>
                  <FaInfoCircle />
                </HoverCard.Trigger>
                <Portal>
                  <HoverCard.Positioner>
                    <HoverCard.Content maxWidth="240px">
                      <HoverCard.Arrow />
                      <Box>
                        <Strong>Tatari</Strong> is card game where we compete to finish our cards on hand. But you <Strong>WILL</Strong> be punished if you spam the cards(you're using the wrong card)
                      </Box>
                      <Box> </Box>
                      <Box>
                        You can play cards that's one position away from the middle card(you can play card 2 or 4 if the target card is 3)
                      </Box>
                    </HoverCard.Content>
                  </HoverCard.Positioner>
                </Portal>
              </HoverCard.Root>
            </HStack>
            <form onSubmit={handleSubmit(createGame)}>
              <Stack direction={["column"]}>
                <Field
                  label="Game Code"
                  invalid={!!errors.roomID}
                  errorText={errors.roomID?.message}
                >
                  <Input
                    {...register("roomID", {
                      valueAsNumber: true,
                      validate: (value) => value > 0,
                    })}
                    placeholder="Ex. 1021"
                  />
                </Field>
                <Field
                  label="Name"
                  invalid={!!errors.playerName}
                  errorText={errors.playerName?.message}
                >
                  <Input
                    {...register("playerName", {
                      required: "Name is required",
                    })}
                    placeholder="Ex. Raisin"
                    size="md"
                  ></Input>
                </Field>
                <Button type="submit" variant="solid">
                  Start
                </Button>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Center>
    </motion.div>
  );
}
