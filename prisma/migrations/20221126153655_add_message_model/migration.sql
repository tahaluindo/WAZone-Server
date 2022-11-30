-- CreateTable
CREATE TABLE "Message" (
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
    "messageId" TEXT NOT NULL,
    "messageType" TEXT NOT NULL,
    "messageText" TEXT NOT NULL,
    "messageImage" TEXT NOT NULL,
    "messageTimestamp" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    CONSTRAINT "Message_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
