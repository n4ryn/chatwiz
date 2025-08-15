import Chatroom from "@/components/chat-room";
import { personaData } from "@/libs/persona";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const persona = personaData.find((p) => p.id === Number(slug));

  if (!persona) {
    return new Response("Not found", { status: 404 });
  }

  return <Chatroom persona={persona} />;
}
