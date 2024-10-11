import { PrismaService } from 'src/services/prisma.service';
import { EmployeeSeed } from './seedHelp';
const prisma = new PrismaService();
async function main() {
  await EmployeeSeed(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
