import prisma from '../infrastructure/db';

export class QuestionRepository {
  async findAll() {
    return prisma.question.findMany({
      include: { category: true }
    });
  }

  async findById(id: string) {
    return prisma.question.findUnique({
      where: { id },
      include: { category: true }
    });
  }

  async create(data: any) {
    return prisma.question.create({
      data: {
        title: data.title,
        option_a: data.option_a,
        option_b: data.option_b,
        option_c: data.option_c,
        option_d: data.option_d,
        option_e: data.option_e,
        correct_answer: data.correct_answer,
        explanation: data.explanation,
        category: {
          connect: { id: data.categoryId }
        }
      }
    });
  }

  async update(id: string, data: any) {
    return prisma.question.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return prisma.question.delete({
      where: { id }
    });
  }
}
