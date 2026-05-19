import { QuestionRepository } from '../repositories/QuestionRepository';

export class QuestionService {
  private repository: QuestionRepository;

  constructor() {
    this.repository = new QuestionRepository();
  }

  async getAllQuestions() {
    // Add business logic/filtering here if needed
    return this.repository.findAll();
  }

  async createQuestion(data: any) {
    // Add validation or processing logic here
    if (!data.title) throw new Error("Title is required");
    return this.repository.create(data);
  }
}
