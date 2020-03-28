import Database from "../../../src/config/Database";
import { Applicant } from "../../../src/models/Applicant";
import { Section } from "../../../src/models/Applicant/Section";
import { Career } from "../../../src/models/Career";
import { CareerApplicant } from "../../../src/models/CareerApplicant";
import { ApplicantCapability } from "../../../src/models/ApplicantCapability";
import { Capability } from "../../../src/models/Capability";
import { random, lorem } from "faker";


describe("Applicant model", () => {
  beforeAll(async () => {
    await Database.setConnection();
  });

  beforeEach(async () => {
    await Section.truncate({ cascade: true });
    await Applicant.truncate({ cascade: true });
    await Career.truncate({ cascade: true });
  });

  afterAll(async () => {
    await Database.close();
  });

  const params = {
    name: "Bruno",
    surname: "Diaz",
    padron: 1,
    description: "Batman",
    credits: 150
  };

  it("create a valid applicant", async () => {
    const applicant: Applicant = new Applicant(params);
    const career: Career = new Career({
      code: "1",
      description: "Ingeniería Informática",
      credits: 250
    });
    const capability: Capability = new Capability({ description: "Python" });

    applicant.careers = [career];
    applicant.capabilities = [capability];

    expect(applicant.careers).toHaveLength(1);
    expect(applicant.capabilities).toHaveLength(1);
  });

  it("Persist the many to many relation between Applicant, Career and Capability", async () => {
    const applicant: Applicant = new Applicant(params);
    const career: Career = new Career({
      code: 3,
      description: "Ingeniería Mecanica",
      credits: 250
    });
    const capability: Capability = new Capability({ description: "Python" });

    applicant.careers = [career];
    applicant.capabilities = [capability];

    career.applicants = [applicant];
    capability.applicants = [applicant];

    const savedCareer = await career.save();
    const savedCapability = await capability.save();
    const saverdApplicant = await applicant.save();

    await CareerApplicant.create({
      careerCode: savedCareer.code, applicantUuid: saverdApplicant.uuid, creditsCount: 150
    });
    await ApplicantCapability.create({
      capabilityUuid: savedCapability.uuid, applicantUuid: saverdApplicant.uuid
    });
    const result = await Applicant.findOne({
      where: { name: "Bruno" },
      include: [Career, Capability]
    });

    expect(result.capabilities[0].uuid).toEqual(savedCapability.uuid);
    expect(result.careers[0]).toMatchObject({
      code: career.code,
      CareerApplicant: {
        applicantUuid: applicant.uuid,
        careerCode: career.code,
        creditsCount: 150
      }
    });
    expect(applicant).toEqual(expect.objectContaining({
      uuid: applicant.uuid,
      name: params.name,
      surname: params.surname,
      padron: params.padron,
      description: params.description
    }));
  });

  it("creates a valid section with a title and a description", async () => {
    const myApplicant: Applicant = new Applicant(params);

    const applicant = await myApplicant.save();
    const sectionParams = { title: random.words(), description: lorem.paragraphs() };
    await applicant.createSection(sectionParams);

    const [section] = await applicant.getSections();
    expect(section).toBeDefined();
    expect(section).toHaveProperty("uuid");
    expect(section).toMatchObject({
      title: sectionParams.title,
      description: sectionParams.description
    });
  });

  it("raise an error if name is null", async () => {
    const applicant: Applicant = new Applicant({
      name: null,
      surname: "Diaz",
      padron: 1,
      description: "Batman",
      credits: 150
    });

    await expect(applicant.save()).rejects.toThrow();
  });

  it("raise an error if surname is null", async () => {
    const applicant: Applicant = new Applicant({
      name: "Bruno",
      padron: 1,
      description: "Batman",
      credits: 150
    });

    await expect(applicant.save()).rejects.toThrow();
  });


  it("raise an error if padron is null", async () => {
    const applicant: Applicant = new Applicant({
      name: "Bruno",
      surname: "Diaz",
      description: "Batman",
      credits: 150
    });

    await expect(applicant.save()).rejects.toThrow();
  });

  it("raise an error if description is null", async () => {
    const applicant: Applicant = new Applicant({
      name: null,
      surname: "Diaz",
      padron: 1,
      credits: 150
    });

    await expect(applicant.save()).rejects.toThrow();
  });
});
