import { ICompanyGeneratorAttributes } from "$generators/interfaces";
import { CuitGenerator } from "$generators/Cuit";
import { BusinessNameGenerator } from "$generators/BusinessName";

export const withMinimumData = ({ index, user }: IWithMinimumData) => ({
  cuit: CuitGenerator.generate(),
  companyName: "companyName",
  businessName: BusinessNameGenerator.generate(),
  user: {
    email: `company${index}@mail.com`,
    password: user?.password || "ASDqfdsfsdfwe234",
    name: "companyUserName",
    surname: "companyUserSurname"
  }
});

interface IWithMinimumData extends ICompanyGeneratorAttributes {
  index: number;
}
