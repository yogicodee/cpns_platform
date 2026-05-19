import prisma from '../infrastructure/db';

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { stats: true }
    });
  }

  async create(data: any) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        stats: {
          create: {} // Create empty stats record
        }
      }
    });
  }
}
