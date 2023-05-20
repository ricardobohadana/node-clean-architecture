-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "name" TEXT NOT NULL,
    "price" BIGINT NOT NULL,
    "inStockAmount" INTEGER NOT NULL,
    "size" TEXT,
    "color" TEXT,
    "notificationLimit" INTEGER
);
INSERT INTO "new_Product" ("color", "createdAt", "id", "inStockAmount", "name", "notificationLimit", "price", "size", "updatedAt") SELECT "color", "createdAt", "id", "inStockAmount", "name", "notificationLimit", "price", "size", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_name_size_color_key" ON "Product"("name", "size", "color");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
