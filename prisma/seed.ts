import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  const writer1 = await prisma.writer.create({
    data: {
      name: 'صادق هدایت',
      bio: 'یکی از برجسته‌ترین نویسندگان ایرانی در قرن بیستم.',
    },
  });

  const writer2 = await prisma.writer.create({
    data: {
      name: 'جلال آل احمد',
      bio: 'نویسنده، اندیشمند و منتقد اجتماعی ایرانی.',
    },
  });

  const writer3 = await prisma.writer.create({
    data: {
      name: 'سیمین دانشور',
      bio: 'اولین رمان‌نویس زن ایرانی و نویسنده کتاب «سووشون».',
    },
  });


  const book1 = await prisma.book.create({
    data: {
      title: 'بوف کور',
      price: 300000,
      stock: 10,
      genre: 'FICTION',
      status: 'ACTIVE',
    },
  });

  const book2 = await prisma.book.create({
    data: {
      title: 'غرب‌زدگی',
      price: 250000,
      stock: 8,
      genre: 'NON_FICTION',
      status: 'ACTIVE',
    },
  });

  const book3 = await prisma.book.create({
    data: {
      title: 'سووشون',
      price: 270000,
      stock: 12,
      genre: 'FICTION',
      status: 'ACTIVE',
    },
  });

  await prisma.writerBook.createMany({
    data: [
      { writerId: writer1.id, bookId: book1.id },
      { writerId: writer2.id, bookId: book2.id },
      { writerId: writer3.id, bookId: book3.id },
    ],
  });

  console.log('done')
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
