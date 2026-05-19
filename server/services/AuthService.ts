import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/UserRepository';

export class AuthService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async register(data: any) {
    const existing = await this.repository.findByEmail(data.email);
    if (existing) throw new Error("Email already registered");

    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.repository.create({
      ...data,
      password: hashedPassword
    });
  }

  async login(data: any) {
    const user = await this.repository.findByEmail(data.email);
    if (!user) throw new Error("Invalid credentials");

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    return { token, user: { id: user.id, name: user.name, email: user.email, stats: user.stats } };
  }
}
