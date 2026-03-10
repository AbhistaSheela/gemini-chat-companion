import { supabase } from "@/integrations/supabase/client";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export async function sendMessage(messages: { role: string; content: string }[]): Promise<string> {
  const { data, error } = await supabase.functions.invoke("chat", {
    body: { messages },
  });

  if (error) throw new Error(error.message || "Failed to get response");
  if (data?.error) throw new Error(data.error);
  return data.reply;
}
