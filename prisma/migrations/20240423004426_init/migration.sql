-- CreateTable
CREATE TABLE "Usuario" (
    "email" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
