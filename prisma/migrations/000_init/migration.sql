PRAGMA foreign_keys=OFF;

CREATE TABLE IF NOT EXISTS "Client" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "address" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Project" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "amount" INTEGER NOT NULL DEFAULT 0,
  "dueDate" DATETIME,
  "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
  "billingStatus" TEXT NOT NULL DEFAULT 'NOT_BILLED',
  "paymentStatus" TEXT NOT NULL DEFAULT 'UNPAID',
  "memo" TEXT,
  "fileUrl" TEXT,
  "referenceUrl" TEXT,
  "clientId" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Task" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "dueDate" DATETIME,
  "completed" BOOLEAN NOT NULL DEFAULT false,
  "memo" TEXT,
  "projectId" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Invoice" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "issueDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "dueDate" DATETIME,
  "subtotal" INTEGER NOT NULL,
  "tax" INTEGER NOT NULL,
  "total" INTEGER NOT NULL,
  "payee" TEXT,
  "note" TEXT,
  "projectId" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Invoice_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "DeliveryNote" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "issueDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "note" TEXT,
  "projectId" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DeliveryNote_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "BusinessSetting" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
  "businessName" TEXT NOT NULL DEFAULT '',
  "ownerName" TEXT NOT NULL DEFAULT '',
  "postalCode" TEXT,
  "address" TEXT,
  "phone" TEXT,
  "email" TEXT,
  "invoicePrefix" TEXT NOT NULL DEFAULT 'INV',
  "bankName" TEXT,
  "bankBranch" TEXT,
  "bankAccount" TEXT,
  "bankHolder" TEXT,
  "taxRate" INTEGER NOT NULL DEFAULT 10,
  "invoiceNote" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "Client_name_key" ON "Client"("name");
CREATE INDEX IF NOT EXISTS "Project_clientId_idx" ON "Project"("clientId");
CREATE INDEX IF NOT EXISTS "Project_status_idx" ON "Project"("status");
CREATE INDEX IF NOT EXISTS "Project_billingStatus_idx" ON "Project"("billingStatus");
CREATE INDEX IF NOT EXISTS "Project_paymentStatus_idx" ON "Project"("paymentStatus");
CREATE INDEX IF NOT EXISTS "Project_dueDate_idx" ON "Project"("dueDate");
CREATE INDEX IF NOT EXISTS "Task_projectId_idx" ON "Task"("projectId");
CREATE INDEX IF NOT EXISTS "Task_completed_idx" ON "Task"("completed");

INSERT OR IGNORE INTO "BusinessSetting" ("id", "businessName", "ownerName", "invoicePrefix", "taxRate")
VALUES ('default', '', '', 'INV', 10);

PRAGMA foreign_keys=ON;
