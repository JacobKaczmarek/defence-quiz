/*
  Warnings:

  - Added the required column `defensiveX` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defensiveY` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `offensiveX` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `offensiveY` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "defensiveX" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "defensiveY" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "offensiveX" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "offensiveY" DOUBLE PRECISION NOT NULL;
