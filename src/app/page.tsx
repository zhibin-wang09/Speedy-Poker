"use client";

import { useEffect } from "react";
import { socket } from "../socket";
import { motion } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Center, Input, Stack, Text } from "@chakra-ui/react";
import { Field} from "@/components/ui/field";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";


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
    socket.on("sendRoomID", (roomID) => {
      router.push(`/waiting/${roomID}`);
    });

    return () => {
      socket.off("sendRoomID");
    };
  }, [router, watchPlayerName]);

  const createGame: SubmitHandler<joinGameInput> = (data: joinGameInput) => {
    socket.emit("joinGameRoom", data.roomID);
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
            <Text fontSize="4xl" as="b">
              Up and Down Poker
            </Text>
            <form onSubmit={handleSubmit(createGame)}>
              <Stack direction={["column"]}>
                <Field
                  label="Game Code"
                  invalid={!!errors.roomID}
                  errorText={errors.roomID?.message}
                >
                  <Input
                    {...register("roomID", {
                      required: "Game code is required",
                      valueAsNumber: true,
                    })}
                    placeholder="Ex. 1021"
                  />
                </Field>
                <Field label="Name" invalid={!!errors.playerName} errorText={errors.playerName?.message}>
                  <Input
                    {...register("playerName", {
                      required: "Name is required",
                    })}
                    placeholder="Ex. Raisin"
                    size="md"
                  ></Input>
                </Field>
                <Button type="submit" variant="solid">Start</Button>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Center>
    </motion.div>
  );
}
