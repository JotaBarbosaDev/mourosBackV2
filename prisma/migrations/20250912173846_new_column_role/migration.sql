-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'PRESIDENT', 'TREASURER', 'SECRETARY', 'BOARD_MEMBER', 'PARTNER', 'VISITOR');

-- AlterTable
ALTER TABLE "public"."Socio" ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'PARTNER',
ALTER COLUMN "password" SET DEFAULT '';
