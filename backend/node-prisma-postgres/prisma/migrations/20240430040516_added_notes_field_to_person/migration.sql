/*
  Warnings:

  - Added the required column `notes` to the `people` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "people" ADD COLUMN     "notes" TEXT NOT NULL;
