import { ASTConverter, ASTResultKind } from '../../types'
import * as ts from 'typescript'

export const convertObjProps: ASTConverter<ts.PropertyAssignment> = (node, options) => {
  if (node.name.getText() === 'props') {
    const tsModule = options.typesciprt
    const attrutibes = (tsModule.isArrayLiteralExpression(node.initializer))
      ? node.initializer.elements
        .filter(expr => expr.kind === tsModule.SyntaxKind.StringLiteral)
        .map((el) => (el as ts.StringLiteral).text)
      : (node.initializer as ts.ObjectLiteralExpression).properties
        .map((el) => el.name!.getText())

    const nodes = (tsModule.isArrayLiteralExpression(node.initializer))
      ? node.initializer.elements
        .filter(expr => expr.kind === tsModule.SyntaxKind.StringLiteral)
        .map((el) => tsModule.createPropertyAssignment((el as ts.StringLiteral).text, tsModule.createNull()))
      : (node.initializer as ts.ObjectLiteralExpression).properties
        .map((el) => el as ts.PropertyAssignment)

    return {
      tag: 'Prop',
      kind: ASTResultKind.OBJECT,
      imports: [],
      attrutibes,
      nodes
    }
  }

  return false
}
