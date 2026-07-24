/*
  Warnings:

  - You are about to drop the column `destination` on the `Train` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Train` table. All the data in the column will be lost.
  - Added the required column `destinationId` to the `Train` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceId` to the `Train` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Train" DROP COLUMN "destination",
DROP COLUMN "source",
ADD COLUMN     "destinationId" TEXT NOT NULL,
ADD COLUMN     "sourceId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Station" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Station_code_key" ON "Station"("code");

-- AddForeignKey
ALTER TABLE "Train" ADD CONSTRAINT "Train_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Train" ADD CONSTRAINT "Train_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
