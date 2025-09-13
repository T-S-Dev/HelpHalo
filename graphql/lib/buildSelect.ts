import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";

function transformFields(currentFields: any): any {
  const select: any = {};

  for (const fieldName in currentFields) {
    const subFields = currentFields[fieldName];

    if (fieldName === "__typename") continue;

    // If there are no sub-fields, it's a scalar or a leaf-node relation.
    if (Object.keys(subFields).length === 0) {
      select[fieldName] = true;
    } else {
      // Otherwise, it's a relation with a nested selection. Recurse.
      select[fieldName] = {
        select: transformFields(subFields),
      };
    }
  }
  return select;
}

export function buildSelect(info: GraphQLResolveInfo) {
  const fields = graphqlFields(info);

  return transformFields(fields);
}
