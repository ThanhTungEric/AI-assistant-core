import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { ChatHistoryItem } from 'src/message/message.service';

@Injectable()
export class GeminiService {
  async getAIResponse(
    question: string,
    history: ChatHistoryItem[] = [],
  ): Promise<string> {
    try {
      const response = await axios.post('http://172.16.2.41:8000/chat', {
        question,
        history,
      });

      return response.data.answer;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching AI response');
    }
  }

  async getTopicName(history: ChatHistoryItem[]): Promise<string> {
    try {
      const response = await axios.post('http://172.16.2.41:8000/convo_name', {
        history,
      });

      if (response.status === 200) {
        return response.data.name;
      } else {
        throw new InternalServerErrorException('Error generating topic name');
      }
    } catch (error) {
      throw new InternalServerErrorException('Error generating topic name');
    }
  }
}
