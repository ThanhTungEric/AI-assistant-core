export class CreateMessageDto {
  content: string;
  sender: 'user' | 'ai';
  topicId?: number;
}
