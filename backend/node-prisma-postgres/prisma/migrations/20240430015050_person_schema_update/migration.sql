/*
  Warnings:

  - You are about to drop the column `firstName` on the `people` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `people` table. All the data in the column will be lost.
  - Added the required column `name` to the `people` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickName` to the `people` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "people" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "nickName" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phoneNumber" TEXT NOT NULL;
