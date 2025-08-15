export interface Persona {
  id: number;
  name: string;
  twitterHandle: string;
  avatar: string;
  cover: string;
  tagline: string;
  description: string;
  expertise: string[];
  reach: {
    youtube: string;
    udemy: string;
    reviews: string;
  };
  systemPrompts: string;
}

export interface ChatType {
  role: "assistant" | "user" | "system";
  content: string;
  timestamp: number;
}
