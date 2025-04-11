import { getFirestore } from "firebase-admin/firestore";

export type Message = {
  chatId: string | number;
  text: string;
  image?: string;
  inlineActions?: { type: "callback"; name: string; data: string }[];
  parseMode?: "MarkdownV2";
};

type ScheduleMessage = {
  date: Date | number;
  message: Message;
  status: "pending" | "sent" | "cancelled";
};

export const createScheduledMessage = (
  data: Omit<ScheduleMessage, "status">
) => {
  const firestore = getFirestore();
  return firestore.collection("messages").add({ ...data, status: "pending" });
};

export const getScheduledMessages = async (
  status: "pending" | "sent" | "cancelled"
) => {
  const firestore = getFirestore();
  const data = await firestore
    .collection("messages")
    .where("status", "==", status)
    .where("date", "<=", new Date())
    .get();
  return data.docs.map(
    (data) =>
      ({ id: data.id, ...data.data() } as ScheduleMessage & { id: string })
  );
};

export const updateScheduledMessages = async (
  id: string,
  data: Partial<ScheduleMessage>
) => {
  const firestore = getFirestore();
  return firestore.collection("messages").doc(id).update(data);
};
