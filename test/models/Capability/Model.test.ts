import Database from "../../../src/config/Database";
import { Applicant } from "../../../src/models/Applicant";
import { Capability } from "../../../src/models/Capability";
import { ApplicantCapability } from "../../../src/models/ApplicantCapability";

describe("Applicant model", () => {
  beforeAll(async () => {
    await Database.setConnection();
  });

  beforeEach(async () => {
    await Capability.sync({ force: true });
    await ApplicantCapability.sync({ force: true });
    await Applicant.sync({ force: true });
  });

  afterAll(async () => {
    await Database.close();
  });

  it("create a valid capability", async () => {
    const capability: Capability = new Capability({ description: "Python" });

    await capability.save();

    expect(capability).not.toBeNull();
    expect(capability).not.toBeUndefined();
  });

  it("persist the many to many relation between Capability and Applicant", async () => {
    const applicant: Applicant = new Applicant({
      name: "Bruno",
      surname: "Diaz",
      padron: 1,
      description: "Batman",
      credits: 150
    });
    const capability: Capability = new Capability({ description: "Python" });
    applicant.capabilities = [ capability ];
    capability.applicants = [ applicant ];

    const savedCapability = await capability.save();
    const saverdApplicant = await applicant.save();

    await ApplicantCapability.create({
      capabilityUuid: savedCapability.uuid , applicantUuid: saverdApplicant.uuid
    });
    const result = await Capability.findByPk(savedCapability.uuid ,{ include: [Applicant] });

    expect(result.applicants[0].name).toEqual(applicant.name);
    expect(result).toEqual(expect.objectContaining({
      uuid: savedCapability.uuid,
      description: savedCapability.description
    }));
  });

  it("raise an error if description is null", async () => {
    const capability: Capability = new Capability();

    await expect(capability.save()).rejects.toThrow();
  });
});