// src/gemini/gemini.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GeminiService {
  async getAIResponse(question: string): Promise<string> {
    try {
      const response = await axios.post('http://172.16.2.41:8000/chat', { question });
      return response.data.answer;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching AI response');
    }
  }
}
