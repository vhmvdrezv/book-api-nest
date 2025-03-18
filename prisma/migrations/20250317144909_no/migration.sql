/*
  Warnings:

  - The primary key for the `Cart` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Cart` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CartBook" DROP CONSTRAINT "CartBook_cartId_fkey";

-- DropIndex
DROP INDEX "Cart_userId_key";

-- AlterTable
CREATE SEQUENCE cart_userid_seq;
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_pkey",
DROP COLUMN "id",
ALTER COLUMN "userId" SET DEFAULT nextval('cart_userid_seq'),
ADD CONSTRAINT "Cart_pkey" PRIMARY KEY ("userId");
ALTER SEQUENCE cart_userid_seq OWNED BY "Cart"."userId";

-- AddForeignKey
ALTER TABLE "CartBook" ADD CONSTRAINT "CartBook_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
