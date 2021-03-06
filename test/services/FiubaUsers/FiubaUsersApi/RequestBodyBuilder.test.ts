import { RequestBodyBuilder } from "$services/FiubaUsers";
import { validate } from "fast-xml-parser";
import { DniGenerator } from "$generators/DNI";

describe("RequestBodyBuilder", () => {
  it("returns a valid request body for the api", async () => {
    const requestBody = RequestBodyBuilder.buildAuthenticate({
      dni: DniGenerator.generate(),
      password: "password"
    });
    expect(validate(requestBody)).toBe(true);
  });

  it("builds the request body for the api", async () => {
    const dni = "39207911";
    const password = "password";
    const requestBody = RequestBodyBuilder.buildAuthenticate({ dni, password });
    expect(requestBody).toEqualIgnoringSpacing(`
      <?xml version="1.0" encoding="utf-8"?>
      <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
        <SOAP-ENV:Header/>
        <SOAP-ENV:Body>
          <Autenticar>
            <userid>${dni}</userid>
            <password>${password}</password>
          </Autenticar>
        </SOAP-ENV:Body>
      </SOAP-ENV:Envelope>
    `);
  });
});
