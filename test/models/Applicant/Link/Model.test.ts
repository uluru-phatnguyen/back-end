import { ValidationError } from "sequelize";
import { Applicant, ApplicantLink } from "$models";
import { UserRepository } from "$models/User";

describe("ApplicantLink", () => {
  let applicant: Applicant;

  beforeAll(async () => {
    await UserRepository.truncate();
    await ApplicantLink.truncate({ cascade: true });
    const { uuid: userUuid } = await UserRepository.create({
      email: "sblanco@yahoo.com",
      password: "fdmgkfHGH4353",
      name: "Bruno",
      surname: "Diaz"
    });
    applicant = await Applicant.create({
      padron: 1,
      description: "Batman",
      userUuid: userUuid
    });
  });

  it("should create a valid link with a name and a url", async () => {
    const params = {
      applicantUuid: applicant.uuid,
      name: "Google",
      url: "www.google.com"
    };
    const applicantLink = await ApplicantLink.create(params);

    expect(applicantLink).toMatchObject({
      name: params.name,
      url: params.url
    });
  });

  it("should throw an error if no name is provided", async () => {
    const applicantLink = new ApplicantLink({
      applicantUuid: applicant.uuid,
      url: "www.google.com"
    });
    await expect(applicantLink.validate()).rejects.toThrow(ValidationError);
  });

  it("should throw an error if invalid url is provided", async () => {
    const applicantLink = new ApplicantLink({
      applicantUuid: applicant.uuid,
      name: "Google",
      url: "http://google"
    });
    await expect(applicantLink.validate()).rejects.toThrow("La URL es inválida");
  });

  it("should throw an error if no url is provided", async () => {
    const applicantLink = new ApplicantLink({
      applicantUuid: applicant.uuid,
      name: "Google"
    });
    await expect(applicantLink.validate()).rejects.toThrow();
  });

  it("should throw an error if no applicantUuid is provided", async () => {
    const applicantLink = new ApplicantLink({
      name: "Google",
      url: "www.google.com"
    });
    await expect(applicantLink.validate()).rejects.toThrow();
  });
});
