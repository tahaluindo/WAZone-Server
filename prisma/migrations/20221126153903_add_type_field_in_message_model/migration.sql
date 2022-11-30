/*
  Warnings:

  - Added the required column `type` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "botId" TEXT NOT NULL,
    "chatId" TEXT,
    "isFromMe" BOOLEAN NOT NULL,
    "isGroup" BOOLEAN NOT NULL,
    "isStatus" BOOLEAN NOT NULL,
    "sender" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "messageType" TEXT NOT NULL,
    "messageText" TEXT NOT NULL,
    "messageImage" TEXT NOT NULL,
    "messageTimestamp" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    CONSTRAINT "Message_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("botId", "chatId", "createdAt", "id", "isFromMe", "isGroup", "isStatus", "key", "message", "messageId", "messageImage", "messageText", "messageTimestamp", "messageType", "sender", "updatedAt") SELECT "botId", "chatId", "createdAt", "id", "isFromMe", "isGroup", "isStatus", "key", "message", "messageId", "messageImage", "messageText", "messageTimestamp", "messageType", "sender", "updatedAt" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
