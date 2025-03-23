// Topic interface representing a topic with an id, name, and description
export type TopicName = "Information and Ideas" | "Craft and Structure" | "Expression of Ideas" | "Standard English Conventions";

export interface Topic {
    id: number
    name: string
    description: string
    subtopics?: Topic[]
  }
  
  