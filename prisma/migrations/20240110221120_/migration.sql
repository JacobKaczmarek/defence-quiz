/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Submission` table. All the data in the column will be lost.
  - Made the column `imageUrl` on table `Question` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "imageUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "updatedAt";
