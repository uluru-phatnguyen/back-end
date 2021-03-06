import { AdminRepository, Secretary } from "$models/Admin";
import { UserRepository } from "$models/User";
import { UniqueConstraintError } from "sequelize";
import { AdminGenerator } from "$generators/Admin";
import { AdminNotFoundError } from "$models/Admin/Errors";

describe("AdminRepository", () => {
  beforeAll(async () => {
    await UserRepository.truncate();
  });

  describe("create", () => {
    it("creates a valid Admin of extension", async () => {
      const adminAttributes = AdminGenerator.data(Secretary.extension);
      const admin = await AdminRepository.create(adminAttributes);
      expect(await admin.getUser()).toEqual(
        expect.objectContaining({
          ...adminAttributes.user,
          password: expect.any(String)
        })
      );
      expect(admin).toEqual(
        expect.objectContaining({
          secretary: adminAttributes.secretary
        })
      );
    });

    it("creates a valid Admin of graduados", async () => {
      const adminAttributes = AdminGenerator.data(Secretary.graduados);
      const admin = await AdminRepository.create(adminAttributes);
      expect(await admin.getUser()).toEqual(
        expect.objectContaining({
          ...adminAttributes.user,
          password: expect.any(String)
        })
      );
      expect(admin).toEqual(
        expect.objectContaining({
          secretary: adminAttributes.secretary
        })
      );
    });

    it("creates a valid Admin with timestamps", async () => {
      const adminAttributes = AdminGenerator.data(Secretary.graduados);
      const admin = await AdminRepository.create(adminAttributes);
      expect(admin.createdAt).toEqual(expect.any(Date));
      expect(admin.updatedAt).toEqual(expect.any(Date));
    });

    it("throws error if admin already exists and rollback transaction", async () => {
      const adminAttributes = AdminGenerator.data(Secretary.extension);
      await AdminRepository.create(adminAttributes);
      const numberOfAdmins = await AdminRepository.findAll();
      await expect(AdminRepository.create(adminAttributes)).rejects.toThrowErrorWithMessage(
        UniqueConstraintError,
        "Validation error"
      );
      expect(await AdminRepository.findAll()).toEqual(numberOfAdmins);
    });
  });

  describe("findByUserUuid", () => {
    it("returns an admin of extension by userUuid", async () => {
      const extensionAdminAttributes = AdminGenerator.data(Secretary.extension);
      const { userUuid: userExtensionUuid } = await AdminRepository.create(
        extensionAdminAttributes
      );

      const extensionAdmin = await AdminRepository.findByUserUuid(userExtensionUuid);
      expect(extensionAdmin.userUuid).toEqual(userExtensionUuid);
    });

    it("returns an admin of graduados by userUuid", async () => {
      const graduadosAdminAttributes = AdminGenerator.data(Secretary.graduados);
      const { userUuid: userGraduadosUuid } = await AdminRepository.create(
        graduadosAdminAttributes
      );
      const graduadosAdmin = await AdminRepository.findByUserUuid(userGraduadosUuid);
      expect(graduadosAdmin.userUuid).toEqual(userGraduadosUuid);
    });

    it("throws an error if the admin does not exist", async () => {
      const nonExistentUserUuid = "4c925fdc-8fd4-47ed-9a24-fa81ed5cc9da";
      await expect(
        AdminRepository.findByUserUuid(nonExistentUserUuid)
      ).rejects.toThrowErrorWithMessage(
        AdminNotFoundError,
        AdminNotFoundError.buildMessage(nonExistentUserUuid)
      );
    });
  });

  describe("cascade", () => {
    it("deletes all admins if users tables is truncated", async () => {
      await AdminRepository.create(AdminGenerator.data(Secretary.extension));
      await AdminRepository.create(AdminGenerator.data(Secretary.extension));
      await AdminRepository.create(AdminGenerator.data(Secretary.extension));
      expect((await AdminRepository.findAll()).length).toBeGreaterThan(0);
      await UserRepository.truncate();
      expect(await AdminRepository.findAll()).toHaveLength(0);
    });
  });
});
