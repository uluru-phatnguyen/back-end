import BulkRecordError from "sequelize/lib/errors/bulk-record-error";
import { AggregateError } from "bluebird";
import { toBeAggregateError } from "./toBeAggregateError";
import { toBeBulkRecordError } from "./toBeBulkRecordError";
import { Constructable } from "../../types/Constructable";

export interface IExpected {
  errorClass: Constructable;
  message: string;
}

interface IBuildMessageParameters {
  aggregateError: AggregateError;
  expected: IExpected[];
  pass: boolean;
}

const buildResponse = ({ aggregateError, expected, pass }: IBuildMessageParameters) => {
  return {
    pass,
    message: () => {
      if (pass) {
        return `Expected ${aggregateError} not to include ${JSON.stringify(expected)}`;
      } else {
        return `Expected ${aggregateError} to include ${JSON.stringify(expected)}`;
      }
    }
  };
};

export const toBeAggregateErrorIncluding = (received, expected: IExpected[]) => {
  const isAggregateError = toBeAggregateError(received);
  if (!isAggregateError.pass) return isAggregateError;

  const aggregateError: AggregateError = received;
  const isBulkError = toBeBulkRecordError(aggregateError);
  if (!isBulkError.pass) return isAggregateError;

  let aggregateErrorIncludes = buildResponse({
    aggregateError,
    expected,
    pass: false
  });
  if (aggregateError.length !== expected.length) return aggregateErrorIncludes;

  aggregateErrorIncludes = buildResponse({
    aggregateError,
    expected,
    pass: true
  });
  const errors = aggregateError.map((bulkError: BulkRecordError) => bulkError.errors);
  errors.forEach(error => {
    const includesMatch = expected.filter(
      ({ errorClass, message }) => error instanceof errorClass && error.message.includes(message)
    ).length;
    if (includesMatch > 0) return;

    aggregateErrorIncludes = buildResponse({
      aggregateError,
      expected,
      pass: false
    });
  });
  return aggregateErrorIncludes;
};
